/**
 * Logging interno del servidor.
 *
 * Los errores reales (Supabase, red, validación interna) se registran acá
 * — visibles en la terminal de desarrollo o en los logs de Vercel — y al
 * usuario solo le llegan mensajes amigables, nunca detalles técnicos.
 */

export function logError(scope: string, detail: unknown): void {
  const message =
    detail instanceof Error
      ? `${detail.name}: ${detail.message}`
      : typeof detail === "string"
        ? detail
        : JSON.stringify(detail);
  console.error(`[fs-web] ${scope} — ${message}`);
}

export function logWarn(scope: string, detail: string): void {
  console.warn(`[fs-web] ${scope} — ${detail}`);
}
