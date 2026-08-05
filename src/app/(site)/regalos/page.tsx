import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/final-cta";
import { GiftsGrid } from "@/components/sections/gifts-grid";
import { PageHeader } from "@/components/sections/page-header";
import {
  getGifts,
  getGiftsPage,
  getHomeSections,
} from "@/lib/content/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Regalos",
  description:
    "Guías, plantillas, checklists, meditaciones y audios gratuitos de gestión emocional y amor propio, creados por Francis Salazar. Descargalos sin costo.",
  alternates: { canonical: "/regalos" },
};

export default async function RegalosPage() {
  const [gifts, page, homeSections] = await Promise.all([
    getGifts(),
    getGiftsPage(),
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
      <section className="pb-20 md:pb-28">
        <div className="container-content">
          <GiftsGrid gifts={gifts} />
        </div>
      </section>
      <FinalCta content={homeSections.finalCta} />
    </>
  );
}
