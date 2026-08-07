import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { DynamicIcon } from "@/components/ui/icon";
import type { BenefitItem, SectionHeader } from "@/lib/types";

export function Benefits({
  items,
  header,
}: {
  items: BenefitItem[];
  header: SectionHeader;
}) {
  return (
    <section id="beneficios" className="py-24 md:py-32">
      <div className="container-content">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">{header.eyebrow}</p>
          <h2 className="text-display-lg text-balance text-ink">
            {header.title}{" "}
            <em className="font-light italic text-gold-600">
              {header.titleAccent}
            </em>
          </h2>
          <p className="prose-fs mt-5">{header.subtitle}</p>
        </Reveal>

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((benefit) => (
            <StaggerItem key={benefit.id}>
              <article className="group h-full rounded-4xl border border-sand-200 bg-white/70 p-8 backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-300 hover:shadow-lifted">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender-100 text-lavender-500 transition-colors duration-500 group-hover:bg-gold-300/30 group-hover:text-gold-600">
                  <DynamicIcon name={benefit.icon} />
                </span>
                <h3 className="mt-6 font-display text-xl text-ink">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {benefit.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
