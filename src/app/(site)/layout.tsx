import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { getGeneral, getSocial } from "@/lib/content/queries";
import { jsonLdScript, siteUrl } from "@/lib/utils";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [general, social] = await Promise.all([getGeneral(), getSocial()]);

  // Datos estructurados (Schema.org) para buscadores
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl()}/#person`,
        name: general.coachName,
        jobTitle: "Coach de gestión emocional",
        description: general.footerText,
        url: siteUrl(),
        knowsAbout: [
          "Gestión emocional",
          "Inteligencia emocional",
          "Neurociencia",
          "Coaching personal",
          "Amor propio",
          "Desarrollo personal",
        ],
        ...(social.instagram ? { sameAs: [social.instagram] } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl()}/#website`,
        url: siteUrl(),
        name: `${general.brandName} — ${general.coachName}`,
        inLanguage: "es",
        publisher: { "@id": `${siteUrl()}/#person` },
      },
    ],
  };

  return (
    <>
      {/* type="application/ld+json" no es ejecutable: CSP script-src no lo
          alcanza, así que no necesita nonce (y evita forzar renderizado
          dinámico leyendo headers() acá). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      {/* Accesibilidad: saltar directo al contenido con teclado */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-lavender-600 focus:px-5 focus:py-2.5 focus:text-sm focus:text-white"
      >
        Saltar al contenido
      </a>
      <ScrollProgress />
      <Navbar brandName={general.brandName} />
      <main id="contenido">{children}</main>
      <Footer general={general} social={social} />
      <WhatsAppButton href={social.whatsapp} />
    </>
  );
}
