import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Accordion } from "@/components/ui/accordion";
import type { Faq } from "@/lib/types";

export function FaqSection({
  faqs,
  showHeading = true,
}: {
  faqs: Faq[];
  showHeading?: boolean;
}) {
  return (
    <section className="py-24 md:py-32" id="faq">
      <div className="container-content grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        {showHeading && (
          <Reveal>
            <p className="eyebrow mb-4">Preguntas frecuentes</p>
            <h2 className="text-display-lg text-balance text-ink">
              Todo lo que querés{" "}
              <em className="font-light italic text-gold-600">saber</em>
            </h2>
            <p className="prose-fs mt-5">
              Si tu pregunta no está acá, escribime sin vergüenza: respondo
              personalmente cada mensaje.
            </p>
            <Link
              href="/contacto"
              className="mt-6 inline-block text-sm font-medium text-gold-600 underline underline-offset-4 hover:text-gold-500"
            >
              Hacer otra pregunta →
            </Link>
          </Reveal>
        )}
        <Reveal delay={0.1} className={showHeading ? "" : "lg:col-span-2"}>
          <Accordion
            items={faqs.map((f) => ({
              id: f.id,
              question: f.question,
              answer: f.answer,
            }))}
          />
        </Reveal>
      </div>
    </section>
  );
}
