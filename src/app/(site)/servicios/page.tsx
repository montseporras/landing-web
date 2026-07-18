import type { Metadata } from "next";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PageHeader } from "@/components/sections/page-header";
import { ServicesCards } from "@/components/sections/services-cards";
import { getFaqs, getHowItWorks, getServices } from "@/lib/content/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Procesos de coaching 1:1, sesiones de claridad y talleres de inteligencia emocional con Francis Salazar. Sesiones online, método con base en neurociencia.",
  alternates: { canonical: "/servicios" },
};

export default async function ServiciosPage() {
  const [services, howItWorks, faqs] = await Promise.all([
    getServices(),
    getHowItWorks(),
    getFaqs(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Servicios"
        title="Un acompañamiento a la medida de"
        accent="tu momento"
        description="Todos los procesos son online, confidenciales y combinan coaching, inteligencia emocional y neurociencia aplicada. Elegí el formato que mejor se adapte a vos."
      />
      <ServicesCards services={services} showHeading={false} />
      <HowItWorks steps={howItWorks} />
      <FaqSection faqs={faqs.slice(0, 4)} />
      <FinalCta />
    </>
  );
}
