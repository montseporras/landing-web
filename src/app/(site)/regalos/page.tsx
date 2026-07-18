import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/final-cta";
import { GiftsGrid } from "@/components/sections/gifts-grid";
import { PageHeader } from "@/components/sections/page-header";
import { getGifts } from "@/lib/content/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Regalos",
  description:
    "Guías, plantillas, checklists, meditaciones y audios gratuitos de gestión emocional y amor propio, creados por Francis Salazar. Descargalos sin costo.",
  alternates: { canonical: "/regalos" },
};

export default async function RegalosPage() {
  const gifts = await getGifts();

  return (
    <>
      <PageHeader
        eyebrow="Regalos"
        title="Herramientas gratuitas, creadas"
        accent="para vos"
        description="Guías, meditaciones, plantillas y checklists que uso con mis clientes, disponibles sin costo. Elegí el que tu momento necesita y descargalo."
      />
      <section className="pb-20 md:pb-28">
        <div className="container-content">
          <GiftsGrid gifts={gifts} />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
