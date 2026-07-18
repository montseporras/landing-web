/**
 * Detección de la configuración de Supabase.
 *
 * Además de exigir que las variables existan, rechaza los valores de EJEMPLO
 * del `.env.example` (por ejemplo `https://TU-PROYECTO.supabase.co` o `eyJ...`).
 * Así, si alguien copia el `.env.example` pero todavía no puso sus claves
 * reales, la app lo trata como "sin configurar" y muestra la guía amigable en
 * el panel, en vez de intentar conectarse a una base inexistente y fallar.
 */

/** ¿El valor está presente y no es un placeholder del ejemplo? */
function isRealValue(value: string | undefined): value is string {
  if (!value) return false;
  const v = value.trim();
  if (!v) return false;
  if (v.includes("TU-PROYECTO")) return false; // URL de ejemplo
  if (v === "eyJ..." || v === "eyJ") return false; // claves de ejemplo
  if (v.startsWith("TU-") || v.startsWith("tu-")) return false;
  return true;
}

/** URL de un proyecto Supabase real (https://xxxx.supabase.co). */
function isValidSupabaseUrl(url: string | undefined): url is string {
  return (
    isRealValue(url) &&
    /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url.trim())
  );
}

/** ¿Están las claves públicas (para el sitio) bien configuradas? */
export function hasSupabasePublicConfig(): boolean {
  return (
    isValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    isRealValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

/** ¿Está la service key (para el panel) bien configurada? */
export function hasSupabaseServiceConfig(): boolean {
  return (
    isValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    isRealValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}
