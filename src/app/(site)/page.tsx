import { Benefits } from "@/components/sections/benefits";
import { FaqSection } from "@/components/sections/faq-section";
import { FeaturedGift } from "@/components/sections/featured-gift";
import { FinalCta } from "@/components/sections/final-cta";
import { GiftsGrid } from "@/components/sections/gifts-grid";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Reveal } from "@/components/motion/reveal";
import { ServicesCards } from "@/components/sections/services-cards";
import { Button } from "@/components/ui/button";
import {
  getBenefits,
  getFaqs,
  getGifts,
  getHero,
  getHowItWorks,
  getServices,
} from "@/lib/content/queries";

export const revalidate = 300; // el contenido editado aparece a los 5 minutos

export default async function HomePage() {
  const [hero, benefits, howItWorks, services, gifts, faqs] = await Promise.all(
    [
      getHero(),
      getBenefits(),
      getHowItWorks(),
      getServices(),
      getGifts(),
      getFaqs(),
    ],
  );

  // El regalo destacado (eBook principal): el marcado como featured, o el primero.
  const featured = gifts.find((g) => g.featured) ?? gifts[0];
  // En la grilla de la portada no repetimos el destacado.
  const gridGifts = gifts.filter((g) => g.id !== featured?.id).slice(0, 3);

  return (
    <>
      <Hero content={hero} />
      <Benefits items={benefits} />
      <HowItWorks steps={howItWorks} />
      <ServicesCards services={services} />

      {featured && <FeaturedGift gift={featured} />}

      {/* Regalos destacados */}
      {gridGifts.length > 0 && (
        <section className="bg-sand-50/60 py-20 md:py-28 lg:py-32">
          <div className="container-content">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow mb-4">Regalos para vos</p>
              <h2 className="text-display-lg text-balance text-ink">
                Empezá hoy, con un{" "}
                <em className="font-light italic text-gold-600">regalo</em>
              </h2>
              <p className="prose-fs mt-5">
                Guías, meditaciones y plantillas gratuitas para dar el primer
                paso a tu ritmo.
              </p>
            </Reveal>
            <div className="mt-12 md:mt-14">
              <GiftsGrid gifts={gridGifts} showFilters={false} />
            </div>
            <Reveal className="mt-10 text-center">
              <Button href="/regalos" variant="secondary">
                Ver todos los regalos
              </Button>
            </Reveal>
          </div>
        </section>
      )}

      <FaqSection faqs={faqs.slice(0, 5)} />
      <FinalCta />
    </>
  );
}
