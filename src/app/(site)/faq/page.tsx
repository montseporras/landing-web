import type { Metadata } from "next";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { PageHeader } from "@/components/sections/page-header";
import {
  getFaqPage,
  getFaqs,
  getHomeSections,
} from "@/lib/content/queries";
import { jsonLdScript, siteUrl } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas a las preguntas más frecuentes sobre los procesos de coaching emocional de Francis Salazar: sesiones, duración, modalidad y más.",
  alternates: { canonical: "/faq" },
};

/** El JSON-LD requiere texto plano: se despoja el HTML del texto enriquecido. */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default async function FaqPage() {
  const [faqs, page, homeSections] = await Promise.all([
    getFaqs(),
    getFaqPage(),
    getHomeSections(),
  ]);
  const { header } = page;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: stripHtml(f.answer) },
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
        eyebrow={header.eyebrow}
        title={header.title}
        accent={header.titleAccent}
        description={header.description}
      />
      <FaqSection faqs={faqs} showHeading={false} />
      <FinalCta content={homeSections.finalCta} />
    </>
  );
}
