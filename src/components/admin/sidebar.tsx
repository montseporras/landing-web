"use client";

import {
  Gift,
  HelpCircle,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/lib/admin/actions";
import { ADMIN_BASE_PATH } from "@/lib/admin/config";
import { cn } from "@/lib/utils";

/**
 * Navegación del panel, reducida a lo esencial para que sea simple de usar:
 * contenido del sitio (Inicio, Sobre mí, Servicios, Regalos, FAQ, Contacto),
 * mensajes y ajustes. Las rutas se derivan de ADMIN_BASE_PATH (ruta secreta
 * del panel).
 */
const nav = [
  { href: ADMIN_BASE_PATH, label: "Panel", icon: LayoutDashboard },
  { href: `${ADMIN_BASE_PATH}/inicio`, label: "Página de inicio", icon: Home },
  { href: `${ADMIN_BASE_PATH}/sobre-mi`, label: "Sobre mí", icon: UserRound },
  { href: `${ADMIN_BASE_PATH}/servicios`, label: "Servicios", icon: Sparkles },
  { href: `${ADMIN_BASE_PATH}/regalos`, label: "Regalos", icon: Gift },
  {
    href: `${ADMIN_BASE_PATH}/faq`,
    label: "Preguntas frecuentes",
    icon: HelpCircle,
  },
  { href: `${ADMIN_BASE_PATH}/contacto`, label: "Contacto", icon: Mail },
  { href: `${ADMIN_BASE_PATH}/formularios`, label: "Formularios", icon: Inbox },
  {
    href: `${ADMIN_BASE_PATH}/configuracion`,
    label: "Ajustes",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await logoutAction(); // borra la cookie y redirige al inicio
    router.refresh();
  }

  const items = (
    <>
      <div className="flex items-center justify-between px-2">
        <Link href={ADMIN_BASE_PATH} className="block">
          <span className="font-display text-2xl font-semibold text-ink">
            FS<span className="text-gold-500">.</span>
          </span>
          <span className="block text-[0.6rem] uppercase tracking-[0.25em] text-muted">
            Panel de administración
          </span>
        </Link>
        <button
          type="button"
          className="rounded-full p-2 text-muted lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="mt-8 flex-1 space-y-1" aria-label="Secciones del panel">
        {nav.map((item) => {
          const active =
            item.href === ADMIN_BASE_PATH
              ? pathname === ADMIN_BASE_PATH
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender-500",
                active
                  ? "bg-lavender-600 text-white"
                  : "text-muted hover:bg-lavender-50 hover:text-ink",
              )}
            >
              <item.icon size={17} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-sand-200 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted transition-colors hover:bg-sand-100 hover:text-ink"
        >
          <Home size={17} aria-hidden /> Ver el sitio
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={17} aria-hidden /> Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Barra móvil */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-sand-200 bg-cream px-4 py-3 lg:hidden">
        <span className="font-display text-xl font-semibold text-ink">
          FS<span className="text-gold-500">.</span>{" "}
          <span className="text-sm font-normal text-muted">Admin</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="rounded-full p-2 text-ink"
        >
          <Menu size={20} />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-y-auto bg-cream p-5">
            {items}
          </aside>
        </div>
      )}

      {/* Sidebar escritorio */}
      <aside className="sticky top-0 hidden h-screen w-72 flex-none flex-col overflow-y-auto border-r border-sand-200 bg-cream p-5 lg:flex">
        {items}
      </aside>
    </>
  );
}
