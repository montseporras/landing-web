import type { Metadata } from "next";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ContactForms } from "@/components/sections/contact-forms";
import { PageHeader } from "@/components/sections/page-header";
import { getSocial } from "@/lib/content/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Reservá tu llamada de claridad gratuita con Francis Salazar o escribile directamente. Respuesta en menos de 48 horas.",
  alternates: { canonical: "/contacto" },
};

export default async function ContactoPage() {
  const social = await getSocial();

  const channels = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      description: "La vía más rápida para consultas breves.",
      href: social.whatsapp,
      cta: "Escribime por WhatsApp",
    },
    {
      icon: Mail,
      label: "Email",
      description: "Para consultas más largas o propuestas.",
      href: social.email ? `mailto:${social.email}` : "",
      cta: social.email || "Email",
    },
    {
      icon: Instagram,
      label: "Instagram",
      description: "Contenido diario y mensajes directos.",
      href: social.instagram,
      cta: "Seguime en Instagram",
    },
  ].filter((c) => c.href);

  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="Demos el primer paso,"
        accent="juntas"
        description="Reservá tu llamada de claridad gratuita o escribime lo que necesites. Leo y respondo personalmente cada mensaje, en menos de 48 horas."
      />

      <section className="pb-28">
        <div className="container-content grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <ContactForms />
          </Reveal>

          <div className="space-y-4">
            {channels.map((channel, i) => (
              <Reveal key={channel.label} delay={0.1 + i * 0.08}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-3xl border border-sand-200 bg-white/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-soft"
                >
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-lavender-100 text-lavender-500 transition-colors group-hover:bg-gold-300/30 group-hover:text-gold-600">
                    <channel.icon size={20} aria-hidden />
                  </span>
                  <div>
                    <h2 className="font-display text-lg text-ink">
                      {channel.label}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {channel.description}
                    </p>
                    <p className="mt-2 text-sm font-medium text-gold-600">
                      {channel.cta} →
                    </p>
                  </div>
                </a>
              </Reveal>
            ))}

            <Reveal delay={0.35}>
              <div className="rounded-3xl bg-sand-50 p-6 text-sm leading-relaxed text-muted">
                <p className="font-display text-lg text-ink">
                  Un detalle importante
                </p>
                <p className="text-justify-soft mt-2">
                  Tu información es 100% confidencial. Nunca comparto datos y
                  solo te escribo para responder tu consulta.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
