import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Accordion } from "@/components/ui/accordion";
import type { Faq, SectionHeader } from "@/lib/types";

export function FaqSection({
  faqs,
  header,
  showHeading = true,
}: {
  faqs: Faq[];
  header?: SectionHeader;
  showHeading?: boolean;
}) {
  return (
    <section className="py-24 md:py-32" id="faq">
      <div className="container-content grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        {showHeading && header && (
          <Reveal>
            <p className="eyebrow mb-4">{header.eyebrow}</p>
            <h2 className="text-display-lg text-balance text-ink">
              {header.title}{" "}
              <em className="font-light italic text-gold-600">
                {header.titleAccent}
              </em>
            </h2>
            <p className="prose-fs mt-5">{header.subtitle}</p>
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
              answerAlign: f.answer_align,
            }))}
          />
        </Reveal>
      </div>
    </section>
  );
}
