import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

/**
 * Seguridad del panel de administración — SIN Supabase Auth.
 *
 * - El login es usuario + contraseña (variables de entorno ADMIN_USERNAME y
 *   ADMIN_PASSWORD); la sesión vive en una cookie httpOnly firmada con HMAC.
 * - Todas las rutas /admin/* exigen esa cookie válida.
 * - Un visitante NO autenticado que escriba la URL a mano es redirigido al
 *   inicio del sitio: el panel es invisible para el público.
 * - /admin/login es la única ruta administrativa accesible sin sesión.
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isLogin = path.startsWith("/admin/login");

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
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
