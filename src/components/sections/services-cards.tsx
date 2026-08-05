import { Check } from "lucide-react";
import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/icon";
import { RichTextView } from "@/components/ui/rich-text";
import { cn } from "@/lib/utils";
import type { SectionHeader, Service } from "@/lib/types";

export function ServicesCards({
  services,
  header,
  showHeading = true,
}: {
  services: Service[];
  header?: SectionHeader;
  showHeading?: boolean;
}) {
  return (
    <section className="py-24 md:py-32" id="servicios">
      <div className="container-content">
        {showHeading && header && (
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
        )}

        <Stagger className="mt-16 grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-4xl border p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lifted",
                  service.highlighted
                    ? "border-gold-400 bg-gradient-to-b from-white to-sand-50 shadow-gold"
                    : "border-sand-200 bg-white/70 backdrop-blur hover:border-gold-300",
                )}
              >
                {service.highlighted && (
                  <Badge tone="gold" className="absolute -top-3 left-8">
                    Más elegido
                  </Badge>
                )}
                {service.image ? (
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender-100 text-lavender-500">
                    <DynamicIcon name={service.icon} />
                  </span>
                )}
                <h3 className="mt-6 font-display text-2xl text-ink">
                  {service.title}
                </h3>
                <RichTextView
                  html={service.description}
                  align={service.description_align}
                  className="mt-3 text-sm leading-relaxed text-muted"
                />
                <ul className="mt-6 flex-1 space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-ink"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 flex-none text-gold-500"
                        aria-hidden
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                {service.price_label && (
                  <p className="mt-6 font-display text-xl text-ink">
                    {service.price_label}
                  </p>
                )}
                <Button
                  href="/contacto"
                  variant={service.highlighted ? "lila" : "secondary"}
                  className="mt-8 w-full"
                >
                  {service.cta_label}
                </Button>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
