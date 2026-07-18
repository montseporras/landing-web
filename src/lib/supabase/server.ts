import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { hasSupabasePublicConfig } from "@/lib/supabase/config";

/**
 * Cliente público SIN cookies para leer contenido publicado.
 * Al no tocar cookies, permite que Next.js genere las páginas de forma
 * estática con revalidación (ISR) — clave para que el sitio cargue en <2s.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

/**
 * ¿Está Supabase configurado en este entorno? (con claves reales, no los
 * valores de ejemplo del .env.example).
 */
export function isSupabaseConfigured(): boolean {
  return hasSupabasePublicConfig();
}

/**
 * Cliente Supabase para Server Components, Server Actions y Route Handlers.
 * Devuelve null si las variables de entorno no están configuradas, de modo
 * que el sitio funcione con contenido por defecto sin base de datos.
 */
export function createClient() {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Llamado desde un Server Component: se puede ignorar si hay
            // middleware refrescando las sesiones.
          }
        },
      },
    },
  );
}
