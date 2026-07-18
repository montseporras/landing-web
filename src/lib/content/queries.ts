import { logError } from "@/lib/log";
import { createPublicClient as createClient } from "@/lib/supabase/server";
import type {
  AboutContent,
  Faq,
  GeneralSettings,
  Gift,
  HeroContent,
  SeoSettings,
  Service,
  SocialLinks,
} from "@/lib/types";
import {
  defaultAbout,
  defaultBenefits,
  defaultFaqs,
  defaultGeneral,
  defaultGifts,
  defaultHero,
  defaultHowItWorks,
  defaultSeo,
  defaultServices,
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
export const getAbout = () =>
  getSiteContent<AboutContent>("about", defaultAbout);
export const getSocial = () =>
  getSiteContent<SocialLinks>("social", defaultSocial);
export const getSeo = () => getSiteContent<SeoSettings>("seo", defaultSeo);
export const getGeneral = () =>
  getSiteContent<GeneralSettings>("general", defaultGeneral);
export const getBenefits = () => getSiteContent("benefits", defaultBenefits);
export const getHowItWorks = () =>
  getSiteContent("how_it_works", defaultHowItWorks);

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
