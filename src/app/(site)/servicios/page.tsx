import type { Metadata } from "next";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PageHeader } from "@/components/sections/page-header";
import { ServicesCards } from "@/components/sections/services-cards";
import {
  getFaqs,
  getHomeSections,
  getHowItWorks,
  getServices,
  getServicesPage,
} from "@/lib/content/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Procesos de coaching 1:1, sesiones de claridad y talleres de inteligencia emocional con Francis Salazar. Sesiones online, método con base en neurociencia.",
  alternates: { canonical: "/servicios" },
};

export default async function ServiciosPage() {
  const [services, howItWorks, faqs, page, homeSections] = await Promise.all([
    getServices(),
    getHowItWorks(),
    getFaqs(),
    getServicesPage(),
    getHomeSections(),
  ]);
  const { header } = page;

  return (
    <>
      <PageHeader
        eyebrow={header.eyebrow}
        title={header.title}
        accent={header.titleAccent}
        description={header.description}
      />
      <ServicesCards services={services} showHeading={false} />
      <HowItWorks steps={howItWorks} header={homeSections.howItWorks} />
      <FaqSection faqs={faqs.slice(0, 4)} header={homeSections.faq} />
      <FinalCta content={homeSections.finalCta} />
    </>
  );
}
