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
  getHomeSections,
  getHowItWorks,
  getServices,
} from "@/lib/content/queries";

export const revalidate = 300; // el contenido editado aparece a los 5 minutos

export default async function HomePage() {
  const [hero, benefits, howItWorks, services, gifts, faqs, sections] =
    await Promise.all([
      getHero(),
      getBenefits(),
      getHowItWorks(),
      getServices(),
      getGifts(),
      getFaqs(),
      getHomeSections(),
    ]);

  // El regalo destacado (eBook principal): el marcado como featured, o el primero.
  const featured = gifts.find((g) => g.featured) ?? gifts[0];
  // En la grilla de la portada no repetimos el destacado.
  const gridGifts = gifts.filter((g) => g.id !== featured?.id).slice(0, 3);

  return (
    <>
      <Hero content={hero} />
      <Benefits items={benefits} header={sections.benefits} />
      <HowItWorks steps={howItWorks} header={sections.howItWorks} />
      <ServicesCards services={services} header={sections.services} />

      {featured && <FeaturedGift gift={featured} />}

      {/* Regalos destacados */}
      {gridGifts.length > 0 && (
        <section className="bg-sand-50/60 py-20 md:py-28 lg:py-32">
          <div className="container-content">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow mb-4">{sections.giftsTeaser.eyebrow}</p>
              <h2 className="text-display-lg text-balance text-ink">
                {sections.giftsTeaser.title}{" "}
                <em className="font-light italic text-gold-600">
                  {sections.giftsTeaser.titleAccent}
                </em>
              </h2>
              <p className="prose-fs mt-5">{sections.giftsTeaser.subtitle}</p>
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

      <FaqSection faqs={faqs.slice(0, 5)} header={sections.faq} />
      <FinalCta content={sections.finalCta} />
    </>
  );
}
