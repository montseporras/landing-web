import { logError } from "@/lib/log";
import { coerceRichText } from "@/lib/sanitize-html";
import { createPublicClient as createClient } from "@/lib/supabase/server";
import type {
  AboutContent,
  AboutSections,
  ContactPageContent,
  Faq,
  FaqPageContent,
  FooterCta,
  GeneralSettings,
  Gift,
  GiftsPageContent,
  HeroContent,
  HomeSections,
  SeoSettings,
  Service,
  ServicesPageContent,
  SocialLinks,
} from "@/lib/types";
import {
  defaultAbout,
  defaultAboutSections,
  defaultBenefits,
  defaultContactPage,
  defaultFaqPage,
  defaultFaqs,
  defaultFooterCta,
  defaultGeneral,
  defaultGifts,
  defaultGiftsPage,
  defaultHero,
  defaultHomeSections,
  defaultHowItWorks,
  defaultSeo,
  defaultServices,
  defaultServicesPage,
  defaultSocial,
} from "./defaults";

/**
 * Capa de contenido con fallback.
 *
 * Cada función intenta leer de Supabase; si la base no está configurada o la
 * fila no existe, devuelve el contenido por defecto. Así el sitio funciona
 * desde el primer `npm run dev`, y el panel va sobrescribiendo el contenido
 * a medida que la administradora lo edita.
 */

async function getSiteContent<T>(key: string, fallback: T): Promise<T> {
  const supabase = createClient();
  if (!supabase) return fallback;
  try {
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (data?.value) {
      // Con fallback tipo objeto se combinan campos (por si el guardado es
      // anterior a un campo nuevo); con arrays se usa el valor tal cual —
      // hacer spread de un array sobre otro produciría un objeto inválido.
      if (Array.isArray(fallback)) {
        return Array.isArray(data.value) ? (data.value as T) : fallback;
      }
      return { ...fallback, ...(data.value as T) };
    }
  } catch (e) {
    logError(`getSiteContent(${key})`, e); // el fallback mantiene el sitio en pie
  }
  return fallback;
}

export const getHero = () => getSiteContent<HeroContent>("hero", defaultHero);

/**
 * `about.bio/story/mission` pasaron de texto plano a texto enriquecido
 * (`{ html, align }`) en la v6. `coerceRichText` normaliza filas guardadas
 * ANTES de ese cambio (texto plano) sin perder el contenido ni romper el
 * render — ver `src/lib/sanitize-html.ts`.
 */
export async function getAbout(): Promise<AboutContent> {
  const raw = await getSiteContent<AboutContent>("about", defaultAbout);
  return {
    ...raw,
    bio: coerceRichText(raw.bio, defaultAbout.bio),
    story: coerceRichText(raw.story, defaultAbout.story),
    mission: coerceRichText(raw.mission, defaultAbout.mission),
  };
}
export const getSocial = () =>
  getSiteContent<SocialLinks>("social", defaultSocial);
export const getSeo = () => getSiteContent<SeoSettings>("seo", defaultSeo);
export const getGeneral = () =>
  getSiteContent<GeneralSettings>("general", defaultGeneral);
export const getBenefits = () => getSiteContent("benefits", defaultBenefits);
export const getHowItWorks = () =>
  getSiteContent("how_it_works", defaultHowItWorks);
export const getHomeSections = () =>
  getSiteContent<HomeSections>("home_sections", defaultHomeSections);
export const getAboutSections = () =>
  getSiteContent<AboutSections>("about_sections", defaultAboutSections);
export const getServicesPage = () =>
  getSiteContent<ServicesPageContent>("services_page", defaultServicesPage);
export const getGiftsPage = () =>
  getSiteContent<GiftsPageContent>("gifts_page", defaultGiftsPage);
export const getFaqPage = () =>
  getSiteContent<FaqPageContent>("faq_page", defaultFaqPage);
export const getContactPage = () =>
  getSiteContent<ContactPageContent>("contact_page", defaultContactPage);
export const getFooterCta = () =>
  getSiteContent<FooterCta>("footer", defaultFooterCta);

/**
 * Lista de una tabla con fallback inteligente:
 * - Sin Supabase o con error → contenido por defecto (el sitio nunca se cae).
 * - Tabla vacía y todavía NUNCA sembrada desde el panel → contenido por
 *   defecto (primer arranque).
 * - Tabla vacía pero ya sembrada (`seeded:<tabla>`) → lista vacía real: si
 *   la administradora ocultó o borró todo, el sitio lo respeta.
 */
async function getList<T>(
  table: "gifts" | "faqs" | "services",
  fallback: T[],
  query: (q: any) => any,
): Promise<T[]> {
  const supabase = createClient();
  if (!supabase) return fallback;
  try {
    const { data, error } = await query(supabase.from(table).select("*"));
    if (error || !data) {
      if (error) logError(`getList(${table})`, error.message);
      return fallback;
    }
    if (data.length > 0) return data as T[];

    const { data: mark } = await supabase
      .from("site_content")
      .select("key")
      .eq("key", `seeded:${table}`)
      .maybeSingle();
    return mark ? [] : fallback;
  } catch (e) {
    logError(`getList(${table})`, e);
    return fallback;
  }
}

/** Regalos descargables activos, en el orden definido en el panel. */
export function getGifts(): Promise<Gift[]> {
  return getList<Gift>("gifts", defaultGifts, (q) =>
    q.eq("active", true).order("sort_order", { ascending: true }),
  );
}

export function getFaqs(): Promise<Faq[]> {
  return getList<Faq>("faqs", defaultFaqs, (q) =>
    q.eq("active", true).order("sort_order", { ascending: true }),
  );
}

/** Servicios activos, en el orden definido en el panel. */
export function getServices(): Promise<Service[]> {
  return getList<Service>("services", defaultServices, (q) =>
    q.eq("active", true).order("sort_order", { ascending: true }),
  );
}
