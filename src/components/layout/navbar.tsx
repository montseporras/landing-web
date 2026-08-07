"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/servicios", label: "Servicios" },
  { href: "/regalos", label: "Regalos" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

/**
 * Navbar inteligente: transparente arriba, sólida al hacer scroll,
 * se oculta al bajar y reaparece al subir.
 */
export function Navbar({ brandName = "FS" }: { brandName?: string }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const prev = scrollY.getPrevious() ?? 0;
      setScrolled(latest > 24);
      setHidden(latest > 140 && latest > prev && !open);
    });
  }, [scrollY, open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-sand-200/70 bg-cream/90 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label="Navegación principal"
        className="container-content flex h-[4.5rem] items-center justify-between"
      >
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            {brandName}
          </span>
          <span className="hidden text-[0.7rem] uppercase tracking-[0.25em] text-muted transition-colors group-hover:text-gold-600 sm:inline">
            Francis Salazar
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm transition-colors duration-200",
                    active ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-500"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Button href="/contacto" variant="lila" size="sm">
            Reservar llamada
          </Button>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-ink lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-sand-200/70 bg-cream lg:hidden"
          >
            <ul className="container-content flex flex-col py-4">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    className="block py-3 font-display text-xl text-ink"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-3">
                <Button href="/contacto" variant="lila" className="w-full">
                  Reservar llamada gratuita
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
