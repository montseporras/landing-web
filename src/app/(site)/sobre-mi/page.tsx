import type { Metadata } from "next";
import { Heart } from "lucide-react";
import Image from "next/image";
import { Counter } from "@/components/motion/counter";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { FinalCta } from "@/components/sections/final-cta";
import { PageHeader } from "@/components/sections/page-header";
import { Portrait } from "@/components/ui/portrait";
import { getAbout } from "@/lib/content/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sobre mí",
  description:
    "Conocé la historia, la misión y los valores de Francis Salazar, coach especializada en gestión emocional, inteligencia emocional y neurociencia.",
  alternates: { canonical: "/sobre-mi" },
};

export default async function SobreMiPage() {
  const about = await getAbout();
  const gallery = about.gallery.filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow={about.eyebrow}
        title={about.title}
        description={about.bio}
      />

      {/* Historia + foto */}
      <section className="pb-20 md:pb-28">
        <div className="container-content grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative mx-auto max-w-md">
              <div
                aria-hidden
                className="absolute -right-4 -top-4 h-full w-full rounded-4xl border border-gold-300/50 md:-right-5 md:-top-5"
              />
              <Portrait
                src={about.photo}
                alt="Francis Salazar"
                className="relative aspect-[4/5]"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="text-display-md text-ink">Mi historia</h2>
              <p className="prose-fs mt-5 whitespace-pre-line">{about.story}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 rounded-3xl border-l-2 border-gold-400 bg-sand-50 p-6">
                <p className="flex items-start gap-3 font-display text-lg italic leading-relaxed text-ink">
                  <Heart
                    size={18}
                    className="mt-1.5 flex-none text-gold-500"
                    aria-hidden
                  />
                  {about.mission}
                </p>
              </div>
            </Reveal>

            {about.videoUrl && (
              <Reveal delay={0.15}>
                <div className="mt-8 overflow-hidden rounded-3xl shadow-soft">
                  <iframe
                    src={about.videoUrl}
                    title="Video de presentación de Francis Salazar"
                    className="aspect-video w-full"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Estadísticas editables desde el panel */}
      <section
        aria-label="Estadísticas"
        className="border-y border-sand-200 bg-sand-50/60 py-14 md:py-16"
      >
        <div className="container-content grid grid-cols-2 gap-x-6 gap-y-10 text-center md:grid-cols-4">
          {about.stats.map((stat) => (
            <Reveal key={stat.label}>
              <p className="font-display text-4xl text-gold-600 md:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 md:py-28">
        <div className="container-content">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-4">Mis valores</p>
            <h2 className="text-display-lg text-balance text-ink">
              Cómo trabajo{" "}
              <em className="font-light italic text-gold-600">con vos</em>
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
            {about.values.map((value) => (
              <StaggerItem key={value.title} className="h-full">
                <article className="h-full rounded-4xl bg-lavender-50/80 p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft md:p-8">
                  <h3 className="font-display text-xl text-ink">
                    {value.title}
                  </h3>
                  <p className="text-justify-soft mt-3 text-sm leading-relaxed text-muted">
                    {value.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Galería de imágenes (se gestiona desde el panel) */}
      {gallery.length > 0 && (
        <section className="pb-20 md:pb-28">
          <div className="container-content">
            <Reveal>
              <p className="eyebrow mb-4">Galería</p>
              <h2 className="text-display-md text-ink">Detrás de escena</h2>
            </Reveal>
            <Stagger className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
              {gallery.map((src, i) => (
                <StaggerItem key={src}>
                  <div className="relative aspect-square overflow-hidden rounded-3xl">
                    <Image
                      src={src}
                      alt={`Fotografía ${i + 1} de la galería de Francis Salazar`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <FinalCta />
    </>
  );
}
