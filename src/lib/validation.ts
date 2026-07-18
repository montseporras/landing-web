/**
 * Validación y sanitización de entradas (frontend Y backend).
 *
 * Toda entrada del público o del panel pasa por estas funciones antes de
 * tocar la base de datos: longitudes máximas, formatos y limpieza de
 * caracteres de control. La capa de presentación de React ya escapa el HTML,
 * por lo que con esto se cubre XSS almacenado + datos basura.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Caracteres de control, excepto \n (u000A) y \t (u0009).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Recorta espacios, elimina caracteres de control y limita la longitud. */
export function cleanText(value: unknown, maxLength: number): string {
  return String(value ?? "")
    .replace(CONTROL_CHARS_RE, "")
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email);
}

/** Solo se aceptan URLs http(s) absolutas o rutas internas (/regalos). */
export function isSafeUrl(url: string): boolean {
  if (!url) return true;
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Honeypot anti-spam: un campo oculto que las personas nunca completan y
 * los bots sí. Si viene con contenido, el envío se descarta en silencio.
 */
export function isHoneypotTripped(formData: FormData): boolean {
  return cleanText(formData.get("website"), 100).length > 0;
}

/** Límites de longitud compartidos entre formularios públicos y panel. */
export const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  subject: 160,
  message: 4000,
  shortText: 200,
  title: 200,
  description: 2000,
  answer: 4000,
  url: 500,
} as const;
