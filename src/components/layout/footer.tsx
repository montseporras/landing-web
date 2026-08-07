import {
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Music2,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { FooterCta, GeneralSettings, SocialLinks } from "@/lib/types";

const nav = [
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/servicios", label: "Servicios" },
  { href: "/regalos", label: "Regalos" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer({
  general,
  social,
  cta,
}: {
  general: GeneralSettings;
  social: SocialLinks;
  cta: FooterCta;
}) {
  const year = new Date().getFullYear();

  const socials = [
    { href: social.instagram, icon: Instagram, label: "Instagram" },
    { href: social.whatsapp, icon: MessageCircle, label: "WhatsApp" },
    {
      href: social.email ? `mailto:${social.email}` : "",
      icon: Mail,
      label: "Email",
    },
    { href: social.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: social.youtube, icon: Youtube, label: "YouTube" },
    { href: social.tiktok, icon: Music2, label: "TikTok" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-sand-200 bg-sand-50">
      <div className="container-content grid gap-12 py-14 md:grid-cols-2 md:py-16 lg:grid-cols-4">
        {/* Marca */}
        <div className="lg:col-span-2">
          <p className="font-display text-3xl font-semibold text-ink">
            {general.brandName}
            <span className="text-gold-500">.</span>
          </p>
          <p className="mt-1 text-sm uppercase tracking-[0.2em] text-muted">
            {general.coachName}
          </p>
          <p className="text-justify-soft mt-5 max-w-sm whitespace-pre-line text-sm leading-relaxed text-muted">
            {general.footerText}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-sand-200 bg-white text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-lavender-400 hover:text-gold-600 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender-500"
              >
                <Icon size={17} aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <nav aria-label="Enlaces del pie de página">
          <p className="eyebrow mb-4">Explorar</p>
          <ul className="space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacto / CTA */}
        <div>
          <p className="eyebrow mb-4">{cta.eyebrow}</p>
          <p className="font-display text-lg text-ink">{cta.title}</p>
          <p className="text-justify-soft mb-5 mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">
            {cta.text}
          </p>
          <Button href={cta.buttonHref} variant="lila" size="sm">
            {cta.buttonLabel}
          </Button>
        </div>
      </div>

      <div className="border-t border-sand-200">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-muted md:flex-row md:text-left">
          <p>
            © {year} {general.legalName}. Todos los derechos reservados.
          </p>
          <p>Hecho con calma y neurociencia.</p>
        </div>
      </div>
    </footer>
  );
}
