import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import type { FinalCtaContent } from "@/lib/types";

export function FinalCta({ content }: { content: FinalCtaContent }) {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* Bloque visual */}
      <div className="container-content">
        <Reveal>
          <div className="relative overflow-hidden rounded-[3rem] bg-ink px-8 py-20 text-center md:px-20 md:py-28">
            {/* Luces suaves */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-lavender-400/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />
            </div>

            <p className="eyebrow relative text-gold-300">{content.eyebrow}</p>
            <h2 className="text-display-lg relative mx-auto mt-5 max-w-2xl text-balance text-cream">
              {content.title}{" "}
              <em className="font-light italic text-gold-300">
                {content.titleAccent}
              </em>
            </h2>
            <p className="text-justify-soft relative mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/70">
              {content.description}
            </p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-4">
              <Button
                href={content.primaryCta.href}
                variant="lila"
                size="lg"
                className="shadow-lifted"
              >
                {content.primaryCta.label}
              </Button>
              <Button
                href={content.secondaryCta.href}
                size="lg"
                className="border border-lavender-200/30 bg-transparent text-cream hover:border-lavender-200/60 hover:bg-cream/10"
              >
                {content.secondaryCta.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
