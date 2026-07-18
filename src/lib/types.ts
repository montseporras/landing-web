/**
 * Tipos del dominio FS — Francis Salazar.
 * Reflejan el esquema de Supabase (supabase/schema.sql).
 */

/**
 * Modo de acceso a un regalo, configurable por la administradora:
 * - "directo": clic y descarga inmediata del archivo
 * - "email":   pide nombre (opcional) + email antes de entregar el archivo
 * - "enlace":  redirige a un enlace externo (Drive, YouTube, Canva, etc.)
 */
export type GiftAccess = "directo" | "email" | "enlace";

export interface Gift {
  id: string;
  title: string;
  description: string;
  /** Tipo de recurso: texto libre (Ebook, Guía, Curso, Workbook, …). */
  category: string;
  image: string | null;
  file_url: string | null;
  /** Enlace externo (solo para access = "enlace"). */
  url: string | null;
  access: GiftAccess;
  /** Recurso destacado: se muestra en grande en la portada. */
  featured: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
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
  description: string;
  features: string[];
  price_label: string | null;
  cta_label: string;
  icon: string;
  image: string | null;
  highlighted: boolean;
  active: boolean;
  sort_order: number;
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
  bio: string;
  story: string;
  mission: string;
  values: { title: string; description: string }[];
  photo: string | null;
  gallery: string[];
  stats: { value: number; suffix: string; label: string }[];
  videoUrl: string | null;
}

export interface SocialLinks {
  instagram: string;
  whatsapp: string;
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
