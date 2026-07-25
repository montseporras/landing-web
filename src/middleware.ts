import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_BASE_PATH, ADMIN_LOGIN_PATH } from "@/lib/admin/config";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

/**
 * Seguridad del panel de administración — SIN Supabase Auth.
 *
 * - El panel vive en una ruta secreta (ADMIN_BASE_PATH), no en `/admin`.
 * - El login es usuario + contraseña (variables de entorno ADMIN_USERNAME y
 *   ADMIN_PASSWORD); la sesión vive en una cookie httpOnly firmada con HMAC.
 * - Todas las rutas del panel exigen esa cookie válida.
 * - Un visitante NO autenticado que escriba la URL a mano es redirigido al
 *   inicio del sitio: el panel es invisible para el público.
 * - Solo el login es accesible sin sesión.
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isLogin = path.startsWith(ADMIN_LOGIN_PATH);

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = await verifySessionToken(token);

  // Visitante sin sesión intentando entrar al panel → al inicio del sitio.
  if (!isLogin && !authenticated) {
    const home = request.nextUrl.clone();
    home.pathname = "/";
    home.search = "";
    return NextResponse.redirect(home);
  }

  // Administradora ya autenticada visitando el login → directo al panel.
  if (isLogin && authenticated) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = ADMIN_BASE_PATH;
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

/**
 * El matcher DEBE ser un literal estático (Next.js lo analiza en build; no
 * resuelve variables). Tiene que coincidir con ADMIN_BASE_PATH: si cambiás la
 * ruta del panel, actualizá también esta línea.
 */
export const config = {
  matcher: ["/mi-estudio/:path*"],
};
