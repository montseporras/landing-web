import type { Align } from "@/lib/sanitize-html";

/**
 * Tipos del dominio FS — Francis Salazar.
 * Reflejan el esquema de Supabase (supabase/schema.sql).
 */

export type { Align };

/**
 * Campo de texto enriquecido: HTML ya saneado (negrita, cursiva, listas,
 * enlaces) + alineación elegida por la administradora. Ver
 * `src/lib/sanitize-html.ts` para el saneamiento y
 * `src/components/ui/rich-text.tsx` para el render.
 */
export interface RichText {
  html: string;
  align: Align;
}

/**
 * Modo de acceso a un regalo, configurable por la administradora:
 * - "directo":        clic y descarga inmediata del archivo
 * - "email":          pide nombre (opcional) + email antes de entregar el archivo
 * - "enlace":         redirige a un enlace externo (Drive, YouTube, Canva, etc.)
 * - "breve_completo": descarga inmediata de una edición breve (file_url,
 *                      sin pedir nada); un CTA lleva a un formulario que pide
 *                      nombre + email antes de entregar la edición completa.
 */
export type GiftAccess = "directo" | "email" | "enlace" | "breve_completo";

export interface Gift {
  id: string;
  title: string;
  /** HTML saneado (texto enriquecido). */
  description: string;
  description_align: Align;
  /** Tipo de recurso: texto libre (Ebook, Guía, Curso, Workbook, …). */
  category: string;
  /** Imagen de la tarjeta (horizontal): /regalos y cualquier listado. */
  image: string | null;
  /**
   * Imagen alternativa SOLO para el bloque destacado del Home (vertical),
   * cuando `featured` es true. Opcional — si es null, el destacado usa
   * `image` como respaldo (ver getGifts en src/lib/content/queries.ts).
   */
  featured_image?: string | null;
  file_url: string | null;
  /** Enlace externo (solo para access = "enlace"). */
  url: string | null;
  access: GiftAccess;
  /**
   * Edición completa (solo para access = "breve_completo"). `full_file_path`
   * es la ruta dentro del bucket privado "gifts-full" — NUNCA una URL
   * pública — y solo debe llegar al servidor, jamás al navegador antes de
   * completar el formulario (ver `getGifts`/`getGiftById` en
   * `src/lib/content/queries.ts`, que la fuerzan a `null` en las lecturas
   * públicas). Los demás campos son los textos configurables del CTA y del
   * formulario "Quiero la edición completa".
   */
  full_file_path?: string | null;
  full_cta_label?: string | null;
  full_form_title?: string | null;
  full_form_intro?: string | null;
  full_form_button_label?: string | null;
  full_form_success_message?: string | null;
  /** Recurso destacado: se muestra en grande en la portada. */
  featured: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Faq {
  id: string;
  question: string;
  /** HTML saneado (texto enriquecido). */
  answer: string;
  answer_align: Align;
  active: boolean;
  sort_order: number;
}

export type SubmissionType = "contacto" | "llamada" | "descarga";

/** Estado de gestión de un formulario recibido, editable desde el panel. */
export type SubmissionStatus = "nuevo" | "leido" | "archivado";

export interface Submission {
  id: string;
  type: SubmissionType;
  name: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  meta: Record<string, unknown> | null;
  status: SubmissionStatus;
  /**
   * Oculto de la bandeja principal (soft-delete). El registro sigue en el
   * historial permanente; nunca se borra de la base de datos desde el panel.
   */
  hidden: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  /** HTML saneado (texto enriquecido). */
  description: string;
  description_align: Align;
  features: string[];
  price_label: string | null;
  cta_label: string;
  icon: string;
  /** Tono de color del ícono, de una paleta controlada (ver ICON_COLOR_OPTIONS en src/components/ui/icon.tsx). */
  icon_color?: string;
  image: string | null;
  highlighted: boolean;
  active: boolean;
  sort_order: number;
}

/** Tarjeta de la sección "Beneficios" del inicio (dentro de `site_content.benefits`). */
export interface BenefitItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  active: boolean;
}

/** Paso de "Camino Claro, Paso a Paso" (dentro de `site_content.how_it_works`).
 * El número (01, 02…) se calcula solo según el orden de los pasos activos —
 * no se guarda como campo editable. */
export interface StepItem {
  id: string;
  title: string;
  description: string;
  active: boolean;
}

/** Contenido editable por sección, guardado como JSON en site_content. */
export interface HeroContent {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string | null;
  badges: string[];
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  bio: RichText;
  story: RichText;
  mission: RichText;
  values: { title: string; description: string }[];
  photo: string | null;
  gallery: string[];
  stats: { value: number; suffix: string; label: string }[];
  videoUrl: string | null;
}

/** Encabezado reutilizable de una sección (eyebrow + título + acento + bajada). */
export interface SectionHeader {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
}

/** Encabezado editorial de una página interior (alimenta `<PageHeader>`). */
export interface PageHeaderContent {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
}

export interface CtaButton {
  label: string;
  href: string;
}

export interface FinalCtaContent {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  primaryCta: CtaButton;
  secondaryCta: CtaButton;
}

/** Encabezados editables de las secciones de la página de inicio. */
export interface HomeSections {
  benefits: SectionHeader;
  howItWorks: SectionHeader;
  services: SectionHeader;
  giftsTeaser: SectionHeader;
  faq: SectionHeader;
  finalCta: FinalCtaContent;
}

/** Encabezados editables de "Sobre mí" que no forman parte de `about`. */
export interface AboutSections {
  storyHeading: string;
  valuesHeader: { eyebrow: string; title: string; titleAccent: string };
  galleryHeader: { eyebrow: string; title: string };
}

export interface ServicesPageContent {
  header: PageHeaderContent;
}

export interface GiftsPageContent {
  header: PageHeaderContent;
}

export interface FaqPageContent {
  header: PageHeaderContent;
}

export interface ContactPageContent {
  header: PageHeaderContent;
  channelBlurbs: { whatsapp: string; email: string; instagram: string };
  note: { title: string; text: string };
}

/** Bloque CTA de la columna derecha del footer. */
export interface FooterCta {
  eyebrow: string;
  title: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface SocialLinks {
  instagram: string;
  whatsapp: string;
  /** Si es false, WhatsApp no se muestra en ningún lugar del sitio público. */
  whatsappEnabled: boolean;
  email: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string | null;
}

export interface GeneralSettings {
  brandName: string;
  coachName: string;
  tagline: string;
  footerText: string;
  legalName: string;
}
