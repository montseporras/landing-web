/**
 * Sesión del panel de administración — sin Supabase Auth.
 *
 * El login es usuario + contraseña (definidos en variables de entorno) y la
 * sesión es una cookie httpOnly con un token firmado con HMAC-SHA256:
 *
 *     token = <expira>.<firma-base64url>
 *
 * Usa la Web Crypto API, por lo que funciona tanto en Node como en el Edge
 * runtime del middleware. No guarda nada en base de datos.
 *
 * Duración: hay dos modos según el checkbox «Recordarme» del login.
 *  - Sin «Recordarme» (por defecto): la cookie es de SESIÓN (sin maxAge), así
 *    que el navegador la borra al cerrarse. El token se firma con una vida
 *    corta como segunda barrera. Es el comportamiento seguro por defecto:
 *    al cerrar y reabrir el navegador se vuelve a pedir la contraseña.
 *  - Con «Recordarme»: la cookie persiste hasta SESSION_REMEMBER_S.
 */

export const SESSION_COOKIE = "fs_admin_session";

/** Vida del token cuando se marca «Recordarme» (cookie persistente): 7 días. */
export const SESSION_REMEMBER_S = 60 * 60 * 24 * 7;
/** Vida del token en una sesión normal (cookie de sesión del navegador): 12 h. */
export const SESSION_SESSION_S = 60 * 60 * 12;

function getSecret(): string | null {
  // ADMIN_SECRET es opcional; si no está, se deriva de la contraseña.
  const secret =
    process.env.ADMIN_SECRET ??
    (process.env.ADMIN_PASSWORD
      ? `fs-secret::${process.env.ADMIN_PASSWORD}`
      : null);
  return secret;
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  const arr = new Uint8Array(bytes);
  for (const b of arr) binary += String.fromCharCode(b);
  const base64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toBase64Url(signature);
}

/** Crea un token de sesión válido por `durationS` segundos (default: 12 h). */
export async function createSessionToken(
  durationS: number = SESSION_SESSION_S,
): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + durationS;
  const signature = await sign(`fs-admin.${exp}`, secret);
  return `${exp}.${signature}`;
}

/** Verifica un token de sesión (firma + expiración). */
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;

  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;

  const expected = await sign(`fs-admin.${expStr}`, secret);

  // Comparación de longitud constante para no filtrar información por timing.
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}
