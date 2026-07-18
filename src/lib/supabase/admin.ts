import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseServiceConfig } from "@/lib/supabase/config";

/**
 * Cliente de Supabase con la SERVICE ROLE KEY.
 *
 * ⚠️ SOLO puede usarse del lado del servidor (server actions / route
 * handlers): la service key salta las políticas RLS. Nunca se expone al
 * navegador — el acceso está protegido por la cookie de sesión del panel
 * (ver src/lib/admin/session.ts) antes de ejecutar cualquier operación.
 *
 * Devuelve null si faltan las variables o si todavía son los valores de
 * ejemplo del .env.example (en ese caso el panel muestra la guía de setup).
 */
export function createServiceClient() {
  if (!hasSupabaseServiceConfig()) return null;
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
