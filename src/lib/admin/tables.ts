import { cleanText, isSafeUrl, LIMITS } from "@/lib/validation";

/**
 * Allowlist de tablas y columnas del panel.
 *
 * Las server actions genéricas (adminInsert/adminUpdate) solo aceptan tablas
 * y columnas listadas acá, y cada valor pasa por su sanitizador. Así ningún
 * payload manipulado desde el navegador puede tocar columnas o tablas ajenas.
 */

type Sanitizer = (value: unknown) => unknown | undefined;

const asBool: Sanitizer = (v) => Boolean(v);
const asInt: Sanitizer = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(100000, Math.round(n))) : 0;
};
const asText =
  (max: number, { required = false } = {}): Sanitizer =>
  (v) => {
    const s = cleanText(v, max);
    if (required && !s) return undefined; // undefined ⇒ payload inválido
    return s;
  };
const asNullableText =
  (max: number): Sanitizer =>
  (v) => {
    const s = cleanText(v, max);
    return s || null;
  };
const asNullableUrl: Sanitizer = (v) => {
  const s = cleanText(v, LIMITS.url);
  if (!s) return null;
  return isSafeUrl(s) ? s : undefined;
};
/** Array de líneas (una por ítem): limpia cada línea y descarta vacías. */
const asLines: Sanitizer = (v) => {
  const arr = Array.isArray(v) ? v : typeof v === "string" ? v.split("\n") : [];
  return arr
    .map((line) => cleanText(line, 200))
    .filter(Boolean)
    .slice(0, 20);
};

const GIFT_ACCESS = new Set(["directo", "email", "enlace"]);
const SUBMISSION_STATUS = new Set(["nuevo", "leido", "archivado"]);

const TABLES: Record<string, Record<string, Sanitizer>> = {
  gifts: {
    title: asText(LIMITS.title, { required: true }),
    description: asText(LIMITS.description),
    category: (v) => cleanText(v, 60) || "Ebook",
    image: asNullableUrl,
    file_url: asNullableUrl,
    url: asNullableUrl,
    access: (v) => (GIFT_ACCESS.has(String(v)) ? String(v) : "directo"),
    featured: asBool,
    active: asBool,
    sort_order: asInt,
  },
  faqs: {
    question: asText(LIMITS.title, { required: true }),
    answer: asText(LIMITS.answer),
    active: asBool,
    sort_order: asInt,
  },
  services: {
    title: asText(LIMITS.title, { required: true }),
    description: asText(LIMITS.description),
    features: asLines,
    price_label: asNullableText(60),
    cta_label: (v) => cleanText(v, 80) || "Reservar llamada",
    icon: (v) => cleanText(v, 40) || "Sparkles",
    image: asNullableUrl,
    highlighted: asBool,
    active: asBool,
    sort_order: asInt,
  },
  // De los formularios recibidos, la admin solo puede cambiar el estado o
  // quitarlos de la bandeja (soft-delete); jamás borrarlos de la base.
  submissions: {
    status: (v) => (SUBMISSION_STATUS.has(String(v)) ? String(v) : "nuevo"),
    hidden: asBool,
  },
};

export const ALLOWED_TABLES = new Set(Object.keys(TABLES));

/** Claves permitidas de site_content (contenido editable por secciones). */
export const ALLOWED_CONTENT_KEYS = new Set([
  "hero",
  "about",
  "social",
  "seo",
  "general",
  "benefits",
  "how_it_works",
  "seeded:gifts",
  "seeded:faqs",
  "seeded:services",
]);

export interface SanitizeResult {
  payload: Record<string, unknown> | null;
  error: string | null;
}

/**
 * Filtra y sanitiza un payload contra la allowlist de su tabla.
 * Devuelve error amigable si la tabla no existe o un campo requerido quedó vacío.
 */
export function sanitizePayload(
  table: string,
  raw: Record<string, unknown>,
): SanitizeResult {
  const columns = TABLES[table];
  if (!columns) return { payload: null, error: "Operación no permitida." };

  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    const sanitize = columns[key];
    if (!sanitize) continue; // columna no listada: se ignora
    const clean = sanitize(value);
    if (clean === undefined) {
      return {
        payload: null,
        error:
          key === "title" || key === "question"
            ? "Completá el título antes de guardar."
            : "Revisá los datos ingresados: hay un valor inválido.",
      };
    }
    payload[key] = clean;
  }

  if (Object.keys(payload).length === 0) {
    return { payload: null, error: "No hay cambios para guardar." };
  }
  return { payload, error: null };
}
