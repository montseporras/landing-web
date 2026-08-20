import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GiftFullRequestForm } from "@/components/sections/gift-full-request-form";
import { PageHeader } from "@/components/sections/page-header";
import { getGiftById } from "@/lib/content/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function GiftFullEditionPage({
  params,
}: {
  params: { id: string };
}) {
  const gift = await getGiftById(params.id);

  if (!gift || gift.access !== "breve_completo") {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow={gift.title}
        title={gift.full_form_title || "Quiero la edición completa"}
        description={
          gift.full_form_intro ||
          "Dejame tu nombre y tu email y te envío la versión completa."
        }
      />
      <section className="pb-20 md:pb-28">
        <div className="container-content mx-auto max-w-lg">
          <GiftFullRequestForm gift={gift} />
        </div>
      </section>
    </>
  );
}
