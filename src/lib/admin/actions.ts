"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_BASE_PATH } from "@/lib/admin/config";
import {
  SESSION_COOKIE,
  SESSION_REMEMBER_S,
  SESSION_SESSION_S,
  createSessionToken,
  verifySessionToken,
} from "@/lib/admin/session";
import {
  ALLOWED_CONTENT_KEYS,
  ALLOWED_TABLES,
  sanitizeContentPayload,
  sanitizePayload,
} from "@/lib/admin/tables";
import {
  defaultAbout,
  defaultFaqs,
  defaultGifts,
  defaultServices,
} from "@/lib/content/defaults";
import { logError, logWarn } from "@/lib/log";
import { fileExtension, validateUpload } from "@/lib/media";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { coerceRichText } from "@/lib/sanitize-html";
import { createServiceClient } from "@/lib/supabase/admin";
import { cleanText } from "@/lib/validation";

/**
 * `about.bio/story/mission` pasaron de texto plano a texto enriquecido en la
 * v6. Normaliza filas guardadas ANTES de ese cambio para que el panel las
 * muestre en el editor en vez de un campo vacío — mismo mecanismo que
 * `getAbout()` usa para el sitio público (`src/lib/content/queries.ts`).
 */
function coerceContentOnRead(key: string, value: unknown): unknown {
  if (key !== "about" || !value || typeof value !== "object") return value;
  const v = value as Record<string, unknown>;
  return {
    ...v,
    bio: coerceRichText(v.bio, defaultAbout.bio),
    story: coerceRichText(v.story, defaultAbout.story),
    mission: coerceRichText(v.mission, defaultAbout.mission),
  };
}

/**
 * API del panel de administración.
 *
 * Todas las lecturas/escrituras del panel pasan por estas server actions:
 * 1. Verifican la cookie de sesión firmada (login usuario + contraseña).
 * 2. Sanitizan el payload contra una allowlist de tablas y columnas.
 * 3. Operan sobre Supabase con la service key, que nunca sale del servidor.
 * 4. Tras cada escritura revalidan el sitio público (los cambios se ven
 *    al instante, sin esperar el ciclo de ISR ni recargar a mano).
 *
 * Los errores devueltos al navegador son SIEMPRE mensajes amigables; el
 * detalle técnico queda registrado en el log del servidor.
 */

export interface AdminResult<T = unknown> {
  data: T | null;
  error: string | null;
}

const GENERIC_SAVE_ERROR =
  "No se pudieron guardar los cambios. Intentalo nuevamente.";
const GENERIC_LOAD_ERROR =
  "No se pudo cargar la información. Recargá la página e intentá de nuevo.";

/** El sitio público se regenera al instante después de cada cambio. */
function revalidateSite(): void {
  try {
    revalidatePath("/", "layout");
  } catch (e) {
    logError("revalidate", e);
  }
}

// ── Autenticación ────────────────────────────────────────────────────

export interface LoginState {
  error: string | null;
}

/** Comparación en tiempo constante vía HMAC (no filtra longitud ni contenido). */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode("fs-compare-key"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const [da, db] = await Promise.all([
    crypto.subtle.sign("HMAC", key, enc.encode(a)),
    crypto.subtle.sign("HMAC", key, enc.encode(b)),
  ]);
  const va = new Uint8Array(da);
  const vb = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i]! ^ vb[i]!;
  return diff === 0;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;

    if (!expectedUser || !expectedPass) {
      logWarn(
        "login",
        "Faltan ADMIN_USERNAME / ADMIN_PASSWORD en las variables de entorno",
      );
      return {
        error:
          "El acceso todavía no está configurado. Revisá la guía del README.",
      };
    }

    // Máx. 5 intentos cada 15 minutos por IP (frena fuerza bruta).
    const ip = getClientIp();
    if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
      logWarn("login", `Rate limit alcanzado para ${ip}`);
      return {
        error:
          "Demasiados intentos. Por seguridad, esperá unos minutos y probá de nuevo.",
      };
    }

    const username = cleanText(formData.get("username"), 200);
    const password = String(formData.get("password") ?? "").slice(0, 500);
    // «Recordarme»: si está marcado, la sesión persiste entre reinicios del
    // navegador; si no, es una cookie de sesión (se borra al cerrar el navegador).
    const remember = formData.get("remember") === "on";

    const [userOk, passOk] = await Promise.all([
      safeEqual(username, expectedUser),
      safeEqual(password, expectedPass),
    ]);
    if (!userOk || !passOk) {
      return { error: "Usuario o contraseña incorrectos." };
    }

    const duration = remember ? SESSION_REMEMBER_S : SESSION_SESSION_S;
    const token = await createSessionToken(duration);
    if (!token) {
      logError("login", "No se pudo crear el token de sesión");
      return { error: "No fue posible iniciar sesión. Intentalo nuevamente." };
    }

    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // Con «Recordarme» la cookie persiste; sin él es cookie de sesión (sin
      // maxAge), así el navegador la elimina al cerrarse y se vuelve a pedir
      // la contraseña. La expiración firmada del token es la segunda barrera.
      ...(remember ? { maxAge: SESSION_REMEMBER_S } : {}),
    });
  } catch (e) {
    logError("login", e);
    return { error: "No fue posible iniciar sesión. Intentalo nuevamente." };
  }

  redirect(ADMIN_BASE_PATH);
  return { error: null }; // inalcanzable: redirect() lanza internamente
}

export async function logoutAction(): Promise<void> {
  // Borrado robusto: sobrescribe la cookie ya vencida (mismo path/flags con
  // los que se creó) y además la elimina. Así no queda ningún rastro que
  // permita volver a entrar automáticamente.
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  cookies().delete(SESSION_COOKIE);
  redirect("/");
}

/**
 * Verifica la contraseña del panel (para confirmar acciones sensibles como
 * quitar registros de la bandeja). Con rate limiting para evitar fuerza bruta.
 */
async function checkPanelPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const ip = getClientIp();
  if (!rateLimit(`pwd:${ip}`, 10, 15 * 60 * 1000)) return false;
  return safeEqual(String(password ?? "").slice(0, 500), expected);
}

/** ¿Hay una sesión de administradora válida en esta request? */
async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Guardia común: sesión válida + Supabase configurado. */
async function guard(): Promise<
  | { client: NonNullable<ReturnType<typeof createServiceClient>>; error: null }
  | { client: null; error: string }
> {
  if (!(await isAuthenticated())) {
    return { client: null, error: "no_session" };
  }
  const client = createServiceClient();
  if (!client) return { client: null, error: "not_configured" };
  return { client, error: null };
}

// ── Contenido por secciones (tabla site_content) ─────────────────────

export async function adminGetContent(key: string): Promise<AdminResult> {
  const g = await guard();
  if (!g.client) return { data: null, error: g.error };
  if (!ALLOWED_CONTENT_KEYS.has(key)) {
    logWarn("adminGetContent", `Clave no permitida: ${key}`);
    return { data: null, error: GENERIC_LOAD_ERROR };
  }
  const { data, error } = await g.client
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    logError(`adminGetContent(${key})`, error.message);
    return { data: null, error: GENERIC_LOAD_ERROR };
  }
  return { data: coerceContentOnRead(key, data?.value ?? null), error: null };
}

export async function adminUpsertContent(
  key: string,
  value: unknown,
): Promise<AdminResult> {
  const g = await guard();
  if (!g.client) return { data: null, error: g.error };
  if (!ALLOWED_CONTENT_KEYS.has(key)) {
    logWarn("adminUpsertContent", `Clave no permitida: ${key}`);
    return { data: null, error: GENERIC_SAVE_ERROR };
  }

  // Normaliza a JSON plano y limita el tamaño total (protección básica).
  let plain: unknown;
  try {
    const json = JSON.stringify(value);
    if (!json || json.length > 300_000) {
      return {
        data: null,
        error: "El contenido es demasiado grande para guardarse.",
      };
    }
    plain = JSON.parse(json);
  } catch {
    return { data: null, error: GENERIC_SAVE_ERROR };
  }

  // Sanea TODOS los strings del contenido (recorta caracteres de control) y
  // aplica el saneamiento estricto de texto enriquecido en los campos
  // listados en RICH_FIELD_PATHS — rechaza el guardado si detecta una firma
  // de ataque en vez de limpiarla en silencio.
  const sanitized = sanitizeContentPayload(key, plain);
  if (sanitized.error) {
    logWarn("adminUpsertContent", `Contenido rechazado en "${key}"`);
    return { data: null, error: sanitized.error };
  }

  const { error } = await g.client
    .from("site_content")
    .upsert({ key, value: sanitized.value }, { onConflict: "key" });
  if (error) {
    logError(`adminUpsertContent(${key})`, error.message);
    return { data: null, error: GENERIC_SAVE_ERROR };
  }
  revalidateSite();
  return { data: null, error: null };
}

// ── CRUD genérico (gifts, faqs, submissions) ─────────────────────────

function assertTable(table: string): string | null {
  return ALLOWED_TABLES.has(table) ? null : GENERIC_SAVE_ERROR;
}

export interface ListOptions {
  eq?: [string, string];
  order?: { column: string; ascending: boolean };
}

/**
 * Extrae el nombre de columna de un error de "columna inexistente" — puede
 * venir de dos capas distintas y NO comparten código de error:
 * - Postgres nativo (código `42703`): `column "x" of relation "y" does not exist`.
 * - PostgREST, que valida contra su caché de esquema ANTES de tocar
 *   Postgres (código `PGRST204`, a veces sin `code` en absoluto):
 *   `Could not find the 'x' column of 'y' in the schema cache`.
 * Por eso se detecta por PATRÓN DEL MENSAJE, no por código: el nombre
 * extraído solo se usa si además coincide con una clave real del payload
 * que se está por enviar (`writeWithMigrationFallback`), así que un texto
 * de error no relacionado no puede gatillar un strip incorrecto.
 */
function extractMissingColumn(message: string | undefined): string | null {
  const msg = message ?? "";
  // Postgres nativo: column "x" of relation "y" does not exist
  const postgres = /column ['"]([a-zA-Z0-9_]+)['"]/i.exec(msg);
  if (postgres) return postgres[1];
  // PostgREST: Could not find the 'x' column of 'y' in the schema cache
  // (el nombre de columna va ANTES de la palabra "column", orden inverso)
  const postgrest = /['"]([a-zA-Z0-9_]+)['"] column/i.exec(msg);
  return postgrest ? postgrest[1] : null;
}

/**
 * Siembra el contenido por defecto de la app en una tabla vacía, UNA sola
 * vez (marcador `seeded:<tabla>` en site_content). Gracias a esto, las FAQ
 * y los Regalos que vienen de fábrica aparecen en el panel y la admin puede
 * editarlos, ocultarlos o eliminarlos como cualquier otro registro.
 */
async function seedDefaultsIfNeeded(
  client: NonNullable<ReturnType<typeof createServiceClient>>,
  table: string,
): Promise<void> {
  if (table !== "gifts" && table !== "faqs" && table !== "services") return;

  const marker = `seeded:${table}`;
  const { data: mark } = await client
    .from("site_content")
    .select("key")
    .eq("key", marker)
    .maybeSingle();
  if (mark) return; // ya se sembró una vez: respetar lo que decidió la admin

  // Cada rama inserta con su propia forma de fila para que TypeScript pueda
  // acoplar el literal de `table` con el tipo de `rows` (una `rows` unión
  // de las tres formas no puede tipar bien un solo `.insert()` genérico).
  const rows: Record<string, unknown>[] =
    table === "gifts"
      ? defaultGifts.map(({ id: _id, created_at: _c, ...rest }) => rest)
      : table === "services"
        ? defaultServices.map(({ id: _id, ...rest }) => rest)
        : defaultFaqs.map(({ id: _id, ...rest }) => rest);

  // Igual que en adminInsert/adminUpdate: si `description_align`/
  // `answer_align` todavía no existen (falta correr la migración "Desde v5
  // → v6"), se reintenta sembrando sin esa columna en vez de dejar la tabla
  // vacía para siempre.
  let attemptRows = rows;
  let insertError: { message: string; code?: string } | null = null;
  for (let i = 0; i < 5; i++) {
    const { error } = await client.from(table).insert(attemptRows);
    if (!error) {
      insertError = null;
      break;
    }
    const missing = extractMissingColumn(error.message);
    if (missing && attemptRows.every((r) => missing in r)) {
      logWarn(
        `seed(${table})`,
        `Columna "${missing}" no existe todavía — falta ejecutar una migración de supabase/schema.sql. Se siembra sin ese campo.`,
      );
      attemptRows = attemptRows.map((r) => {
        const { [missing]: _drop, ...rest } = r;
        return rest;
      });
      continue;
    }
    insertError = error;
    break;
  }
  if (insertError) {
    logError(`seed(${table})`, insertError.message);
    return;
  }
  await client
    .from("site_content")
    .upsert({ key: marker, value: { at: new Date().toISOString() } });
  revalidateSite();
}

export async function adminList(
  table: string,
  options?: ListOptions,
): Promise<AdminResult<Record<string, unknown>[]>> {
  const bad = assertTable(table);
  if (bad) return { data: null, error: bad };
  const g = await guard();
  if (!g.client) return { data: null, error: g.error };
  const client = g.client;

  const run = async () => {
    let q = client.from(table).select("*");
    if (options?.eq) q = q.eq(options.eq[0], options.eq[1]);
    if (options?.order)
      q = q.order(options.order.column, {
        ascending: options.order.ascending,
      });
    return q;
  };

  let { data, error } = await run();
  if (error) {
    logError(`adminList(${table})`, error.message);
    return { data: null, error: GENERIC_LOAD_ERROR };
  }

  // Tabla vacía: sembrar el contenido de fábrica la primera vez.
  if ((data?.length ?? 0) === 0 && !options?.eq) {
    await seedDefaultsIfNeeded(client, table);
    ({ data, error } = await run());
    if (error) {
      logError(`adminList(${table})`, error.message);
      return { data: null, error: GENERIC_LOAD_ERROR };
    }
  }

  return { data: (data as Record<string, unknown>[]) ?? [], error: null };
}

type WriteResult = {
  data: unknown;
  error: { message: string; code?: string } | null;
};

/**
 * Inserta/actualiza con tolerancia a migraciones todavía no ejecutadas.
 *
 * Columnas como `description_align`/`answer_align` (bloque "Desde v5 → v6"
 * de `supabase/schema.sql`) se agregan al código antes de que la
 * administradora corra la migración en su proyecto de Supabase. Sin este
 * reintento, CUALQUIER guardado en esa tabla (no solo el de textos largos)
 * fallaría por completo con "columna no existe" hasta que se ejecute el SQL
 * — lo cual rompería el panel para instalaciones que todavía no migraron.
 * En vez de eso: si Postgres rechaza la escritura porque falta una columna,
 * se reintenta sin ese campo (se guarda el resto igual; esa columna en
 * particular vuelve a intentarse en el próximo guardado, una vez migrada la
 * base). Deja rastro en el log para que quede claro que falta correr SQL.
 */
async function writeWithMigrationFallback(
  run: (payload: Record<string, unknown>) => Promise<WriteResult>,
  payload: Record<string, unknown>,
  context: string,
): Promise<WriteResult> {
  let attempt = { ...payload };
  for (let i = 0; i < 5; i++) {
    const { data, error } = await run(attempt);
    if (!error) return { data, error: null };

    const missing = extractMissingColumn(error.message);
    if (missing && missing in attempt) {
      logWarn(
        context,
        `Columna "${missing}" no existe todavía — falta ejecutar una migración de supabase/schema.sql. Se guarda sin ese campo.`,
      );
      const { [missing]: _drop, ...rest } = attempt;
      attempt = rest;
      continue;
    }
    return { data: null, error };
  }
  return { data: null, error: { message: "too many columnas faltantes" } };
}

export async function adminInsert(
  table: string,
  payload: Record<string, unknown>,
): Promise<AdminResult<Record<string, unknown>>> {
  const bad = assertTable(table);
  if (bad) return { data: null, error: bad };
  const g = await guard();
  if (!g.client) return { data: null, error: g.error };

  const clean = sanitizePayload(table, payload);
  if (!clean.payload) return { data: null, error: clean.error };
  const client = g.client;

  const { data, error } = await writeWithMigrationFallback(
    (p) => Promise.resolve(client.from(table).insert(p).select("*").single()),
    clean.payload,
    `adminInsert(${table})`,
  );
  if (error) {
    logError(`adminInsert(${table})`, error.message);
    return { data: null, error: GENERIC_SAVE_ERROR };
  }
  revalidateSite();
  return { data: (data as Record<string, unknown>) ?? null, error: null };
}

export async function adminUpdate(
  table: string,
  id: string,
  payload: Record<string, unknown>,
): Promise<AdminResult<Record<string, unknown>>> {
  const bad = assertTable(table);
  if (bad) return { data: null, error: bad };
  const g = await guard();
  if (!g.client) return { data: null, error: g.error };

  const clean = sanitizePayload(table, payload);
  if (!clean.payload) return { data: null, error: clean.error };
  const client = g.client;
  const cleanId = cleanText(id, 100);

  const { data, error } = await writeWithMigrationFallback(
    (p) =>
      Promise.resolve(
        client.from(table).update(p).eq("id", cleanId).select("*").single(),
      ),
    clean.payload,
    `adminUpdate(${table})`,
  );
  if (error) {
    logError(`adminUpdate(${table})`, error.message);
    return { data: null, error: GENERIC_SAVE_ERROR };
  }
  revalidateSite();
  return { data: (data as Record<string, unknown>) ?? null, error: null };
}

export async function adminDelete(
  table: string,
  id: string,
): Promise<AdminResult> {
  const bad = assertTable(table);
  if (bad) return { data: null, error: bad };
  const g = await guard();
  if (!g.client) return { data: null, error: g.error };

  const { error } = await g.client
    .from(table)
    .delete()
    .eq("id", cleanText(id, 100));
  if (error) {
    logError(`adminDelete(${table})`, error.message);
    return { data: null, error: "No se pudo eliminar. Intentalo nuevamente." };
  }
  revalidateSite();
  return { data: null, error: null };
}

export async function adminCount(
  table: string,
  eq?: [string, string],
): Promise<AdminResult<number>> {
  const bad = assertTable(table);
  if (bad) return { data: null, error: bad };
  const g = await guard();
  if (!g.client) return { data: null, error: g.error };
  let q = g.client.from(table).select("id", { count: "exact", head: true });
  if (eq) q = q.eq(eq[0], eq[1]);
  const { count, error } = await q;
  if (error) {
    logError(`adminCount(${table})`, error.message);
    return { data: 0, error: null }; // el dashboard muestra 0 sin romperse
  }
  return { data: count ?? 0, error: null };
}

/**
 * Quita un registro de la bandeja principal (soft-delete). Requiere la
 * contraseña del panel. El registro NO se borra de la base: queda en el
 * historial permanente. Devuelve un mensaje amigable si la contraseña falla.
 */
export async function adminHideSubmission(
  id: string,
  password: string,
): Promise<AdminResult> {
  const g = await guard();
  if (!g.client) return { data: null, error: g.error };

  if (!(await checkPanelPassword(password))) {
    return {
      data: null,
      error: "La contraseña no es correcta. Volvé a intentarlo.",
    };
  }

  const { error } = await g.client
    .from("submissions")
    .update({ hidden: true })
    .eq("id", cleanText(id, 100));
  if (error) {
    logError("adminHideSubmission", error.message);
    return {
      data: null,
      error: "No se pudo completar la acción. Intentalo nuevamente.",
    };
  }
  return { data: null, error: null };
}

// ── Subida de archivos (bucket media) ────────────────────────────────

export async function adminUploadFile(
  formData: FormData,
): Promise<AdminResult<string>> {
  const g = await guard();
  if (!g.client) return { data: null, error: g.error };

  const file = formData.get("file");
  const kind = formData.get("kind") === "image" ? "image" : "file";
  const folder =
    String(formData.get("folder") ?? "uploads")
      .replace(/[^a-z0-9_-]/gi, "")
      .slice(0, 40) || "uploads";

  if (!(file instanceof File)) {
    return { data: null, error: "No se recibió ningún archivo." };
  }

  // Validación estricta en el servidor (extensión + tamaño + no vacío).
  const invalid = validateUpload(file, kind);
  if (invalid) return { data: null, error: invalid };

  const ext = fileExtension(file.name);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await g.client.storage.from("media").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) {
    logError("adminUploadFile", error.message);
    return {
      data: null,
      error: "No se pudo subir el archivo. Intentalo nuevamente.",
    };
  }

  const { data } = g.client.storage.from("media").getPublicUrl(path);
  return { data: data.publicUrl, error: null };
}
