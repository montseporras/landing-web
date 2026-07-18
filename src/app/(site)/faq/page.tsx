import type { Metadata } from "next";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { PageHeader } from "@/components/sections/page-header";
import { getFaqs } from "@/lib/content/queries";
import { jsonLdScript, siteUrl } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas a las preguntas más frecuentes sobre los procesos de coaching emocional de Francis Salazar: sesiones, duración, modalidad y más.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
    url: `${siteUrl()}/faq`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <PageHeader
        eyebrow="FAQ"
        title="Preguntas"
        accent="frecuentes"
        description="Todo lo que necesitás saber antes de empezar tu proceso. Si algo no está acá, escribime."
      />
      <FaqSection faqs={faqs} showHeading={false} />
      <FinalCta />
    </>
  );
}
