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

/**
 * Contenido por defecto del sitio.
 *
 * Se usa cuando Supabase todavía no está configurado o cuando una sección aún
 * no fue editada desde el panel. Una vez conectada la base de datos, todo esto
 * se modifica desde /admin sin tocar código.
 */

export const defaultHero: HeroContent = {
  eyebrow: "Coaching · Inteligencia emocional · Neurociencia",
  title: "Volver a vos es el viaje",
  titleAccent: "más importante de tu vida",
  subtitle:
    "Soy Francis Salazar. Acompaño a mujeres y hombres a gestionar sus emociones, reconstruir su confianza y vivir con calma, claridad y amor propio — con herramientas de coaching respaldadas por la neurociencia.",
  primaryCta: { label: "Descargar regalo gratuito", href: "/regalos" },
  secondaryCta: { label: "Reservar una llamada", href: "/contacto" },
  image: null,
  badges: ["+500 personas acompañadas", "Certificación ICF", "Sesiones online"],
};

export const defaultBenefits = [
  {
    icon: "HeartHandshake",
    title: "Gestión emocional real",
    description:
      "Aprendé a identificar, nombrar y regular lo que sentís, en lugar de reprimirlo o quedar a su merced.",
  },
  {
    icon: "Brain",
    title: "Base en neurociencia",
    description:
      "Cada herramienta que uso está respaldada por cómo funciona realmente tu cerebro, sin promesas mágicas.",
  },
  {
    icon: "Sparkles",
    title: "Amor propio sólido",
    description:
      "Construí una relación con vos que no dependa de la validación externa ni de resultados perfectos.",
  },
  {
    icon: "Compass",
    title: "Claridad y dirección",
    description:
      "Definí qué querés de verdad y diseñá pasos concretos para llegar, a tu ritmo y sin autoexigencia tóxica.",
  },
  {
    icon: "ShieldCheck",
    title: "Confianza que se sostiene",
    description:
      "Dejá de esperar sentirte lista para actuar: la seguridad se entrena con método y acompañamiento.",
  },
  {
    icon: "Leaf",
    title: "Calma como hábito",
    description:
      "Prácticas simples y sostenibles para bajar el ruido mental y habitar tu día con más serenidad.",
  },
];

export const defaultAbout: AboutContent = {
  eyebrow: "Sobre mí",
  title: "Hola, soy Francis",
  bio: "Coach especializada en gestión emocional, inteligencia emocional y neurociencia aplicada al desarrollo personal. Acompaño procesos de transformación profundos, humanos y sin fórmulas vacías.",
  story:
    "Durante años hice todo «bien» — estudié, trabajé, cumplí — y aun así sentía que vivía en piloto automático, con una autoexigencia que no descansaba nunca. Mi propio proceso de terapia, formación en coaching y estudio de la neurociencia me enseñó algo que hoy es el corazón de mi trabajo: no necesitás convertirte en otra persona, necesitás volver a vos. Desde entonces acompañé a cientos de personas a hacer ese mismo viaje: del ruido mental a la calma, de la autocrítica al amor propio, del miedo a la confianza.",
  mission:
    "Mi misión es que tengas herramientas concretas para gestionar tus emociones y construir una vida que se sienta tuya — con ciencia, con calidez y sin juicio.",
  values: [
    {
      title: "Calidez sin juicio",
      description:
        "Este es un espacio seguro. Nada de lo que sientas está mal; todo es información para trabajar.",
    },
    {
      title: "Ciencia con alma",
      description:
        "Uso herramientas validadas por la neurociencia y la psicología, traducidas a un lenguaje simple y humano.",
    },
    {
      title: "Resultados sostenibles",
      description:
        "No busco cambios de una semana: busco hábitos emocionales que te acompañen toda la vida.",
    },
  ],
  photo: null,
  gallery: [],
  stats: [
    { value: 500, suffix: "+", label: "Personas acompañadas" },
    { value: 7, suffix: "", label: "Años de experiencia" },
    { value: 2500, suffix: "+", label: "Horas de sesión" },
    { value: 98, suffix: "%", label: "Clientes que recomiendan" },
  ],
  videoUrl: null,
};

export const defaultHowItWorks = [
  {
    step: "01",
    title: "Llamada de claridad",
    description:
      "Nos conocemos en una llamada gratuita de 30 minutos. Me contás dónde estás, qué te pasa y qué querés cambiar. Sin compromiso.",
  },
  {
    step: "02",
    title: "Diseño de tu proceso",
    description:
      "Si somos match, diseño un plan a tu medida: objetivos, frecuencia de sesiones y herramientas específicas para tu momento.",
  },
  {
    step: "03",
    title: "Sesiones + práctica",
    description:
      "Trabajamos en sesiones online profundas y entre sesiones aplicás ejercicios concretos. Acá es donde ocurre el cambio.",
  },
  {
    step: "04",
    title: "Integración",
    description:
      "Cerramos el proceso cuando las herramientas ya son tuyas: te vas con un método propio para sostener lo logrado.",
  },
];

export const defaultServices: Service[] = [
  {
    id: "s1",
    title: "Proceso individual 1:1",
    description:
      "Un acompañamiento personalizado de 3 meses para trabajar en profundidad tu gestión emocional, confianza y amor propio.",
    features: [
      "12 sesiones online de 60 minutos",
      "Plan de trabajo 100% personalizado",
      "Ejercicios y material entre sesiones",
      "Acompañamiento por WhatsApp",
    ],
    price_label: null,
    cta_label: "Reservar llamada de claridad",
    icon: "UserRound",
    image: null,
    highlighted: true,
    active: true,
    sort_order: 1,
  },
  {
    id: "s2",
    title: "Sesión de claridad puntual",
    description:
      "Una sesión intensiva de 90 minutos para destrabar una situación concreta: una decisión, un conflicto, un momento de ansiedad.",
    features: [
      "90 minutos de trabajo enfocado",
      "Herramientas aplicables desde el día uno",
      "Resumen escrito con tu plan de acción",
    ],
    price_label: null,
    cta_label: "Quiero mi sesión",
    icon: "Lightbulb",
    image: null,
    highlighted: false,
    active: true,
    sort_order: 2,
  },
  {
    id: "s3",
    title: "Coaching Organizacional",
    description:
      "Acompañamiento para empresas e instituciones: capacitaciones corporativas e intervenciones que fortalecen el liderazgo, la comunicación efectiva y el bienestar de los equipos.",
    features: [
      "Desarrollo de liderazgo y formación de equipos",
      "Inteligencia emocional aplicada al trabajo",
      "Manejo del estrés laboral y bienestar organizacional",
      "Programas a medida, online o presenciales",
    ],
    price_label: null,
    cta_label: "Solicitar propuesta para mi empresa",
    icon: "Users",
    image: null,
    highlighted: false,
    active: true,
    sort_order: 3,
  },
];

export const defaultGifts: Gift[] = [
  {
    id: "g1",
    title: "Calma: guía práctica de gestión emocional",
    description:
      "Mi ebook con el método de 5 pasos que uso con mis clientes para pasar del caos emocional a la calma. Incluye ejercicios, plantillas y un plan de 7 días.",
    category: "ebook",
    image: null,
    file_url: null,
    url: null,
    access: "directo" as const,
    featured: true,
    active: true,
    sort_order: 1,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "g2",
    title: "Meditación guiada: volver al cuerpo",
    description:
      "Audio de 12 minutos para soltar el ruido mental y volver al presente. Ideal para empezar o cerrar el día.",
    category: "meditacion",
    image: null,
    file_url: null,
    url: null,
    access: "directo" as const,
    featured: false,
    active: true,
    sort_order: 2,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "g3",
    title: "Checklist: tu botiquín emocional",
    description:
      "Una lista imprimible con recursos rápidos para días difíciles: qué hacer, qué evitar y a quién llamar.",
    category: "checklist",
    image: null,
    file_url: null,
    url: null,
    access: "directo" as const,
    featured: false,
    active: true,
    sort_order: 3,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "g4",
    title: "Plantilla: diario de emociones semanal",
    description:
      "Registrá tus emociones, disparadores y aprendizajes semana a semana con esta plantilla lista para imprimir.",
    category: "plantilla",
    image: null,
    file_url: null,
    url: null,
    access: "directo" as const,
    featured: false,
    active: true,
    sort_order: 4,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "g5",
    title: "Audio: respiración para calmar la ansiedad",
    description:
      "Una práctica de respiración guiada de 6 minutos, basada en neurociencia, para usar en cualquier momento.",
    category: "audio",
    image: null,
    file_url: null,
    url: null,
    access: "directo" as const,
    featured: false,
    active: true,
    sort_order: 5,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "g6",
    title: "Guía: conversaciones difíciles sin explotar",
    description:
      "Un guion paso a paso para comunicar límites con calma y firmeza, sin culpa y sin discusiones eternas.",
    category: "guia",
    image: null,
    file_url: null,
    url: null,
    access: "directo" as const,
    featured: false,
    active: true,
    sort_order: 6,
    created_at: "2026-01-01T00:00:00Z",
  },
];

/**
 * Etiquetas bonitas para algunos tipos conocidos. El tipo de un regalo es
 * texto libre: cualquier valor no listado acá se muestra capitalizado tal
 * cual lo escribió la administradora.
 */
export const giftCategoryLabel: Record<string, string> = {
  ebook: "Ebook",
  guia: "Guía",
  plantilla: "Plantilla",
  checklist: "Checklist",
  meditacion: "Meditación",
  audio: "Audio",
  video: "Video",
  pdf: "PDF",
  curso: "Curso",
  workbook: "Workbook",
};

/** Convierte un tipo libre en etiqueta legible. */
export function giftCategoryDisplay(category: string): string {
  const key = category.trim().toLowerCase();
  if (giftCategoryLabel[key]) return giftCategoryLabel[key];
  const clean = category.trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export const defaultFaqs: Faq[] = [
  {
    id: "f1",
    question: "¿Qué diferencia hay entre coaching y terapia?",
    answer:
      "La terapia trabaja principalmente sanando el pasado y tratando cuadros clínicos; el coaching trabaja desde tu presente hacia tus objetivos. Yo trabajo con personas funcionales que quieren mejorar su gestión emocional, confianza y claridad. Si en el proceso detecto que necesitás apoyo terapéutico, te lo digo con honestidad y puedo derivarte con profesionales de confianza.",
    active: true,
    sort_order: 1,
  },
  {
    id: "f2",
    question: "¿Cómo son las sesiones?",
    answer:
      "Son encuentros online de 60 minutos por videollamada, en un espacio 100% confidencial. Combinamos conversación profunda con herramientas prácticas de coaching, inteligencia emocional y neurociencia. Entre sesiones te llevás ejercicios concretos para aplicar lo trabajado.",
    active: true,
    sort_order: 2,
  },
  {
    id: "f3",
    question: "¿Cuánto dura un proceso?",
    answer:
      "El proceso individual completo dura 3 meses, con una sesión semanal. Es el tiempo que la evidencia y mi experiencia muestran necesario para instalar nuevos hábitos emocionales. También ofrezco sesiones puntuales de claridad para temas específicos.",
    active: true,
    sort_order: 3,
  },
  {
    id: "f4",
    question: "¿La primera llamada tiene costo?",
    answer:
      "No. La llamada de claridad de 30 minutos es gratuita y sin compromiso. Sirve para conocernos, entender tu momento y ver si puedo ayudarte. Si no soy la persona indicada, te lo digo.",
    active: true,
    sort_order: 4,
  },
  {
    id: "f5",
    question: "¿Trabajás con hombres también?",
    answer:
      "Sí. Aunque gran parte de mi comunidad son mujeres, acompaño a cualquier persona comprometida con su desarrollo emocional. Las emociones no tienen género.",
    active: true,
    sort_order: 5,
  },
  {
    id: "f6",
    question: "¿Qué pasa si necesito reprogramar una sesión?",
    answer:
      "Podés reprogramar sin costo avisando con al menos 24 horas de anticipación. La vida pasa, y el proceso está diseñado para adaptarse a ella.",
    active: true,
    sort_order: 6,
  },
];

export const defaultSocial: SocialLinks = {
  instagram: "https://instagram.com/francissalazar.coach",
  whatsapp: "https://wa.me/5490000000000",
  email: "hola@francissalazar.com",
  linkedin: "",
  youtube: "",
  tiktok: "",
};

export const defaultSeo: SeoSettings = {
  metaTitle: "FS · Francis Salazar — Coaching emocional y desarrollo personal",
  metaDescription:
    "Coaching de gestión emocional, inteligencia emocional y neurociencia. Recuperá tu calma, tu confianza y tu amor propio con Francis Salazar. Regalos descargables y sesiones online.",
  keywords:
    "coaching emocional, inteligencia emocional, gestión emocional, amor propio, confianza, neurociencia, desarrollo personal, coach online",
  ogImage: null,
};

export const defaultGeneral: GeneralSettings = {
  brandName: "FS",
  coachName: "Francis Salazar",
  tagline: "Coaching emocional con base en neurociencia",
  footerText:
    "Acompaño a personas a gestionar sus emociones, reconstruir su confianza y vivir con más calma y amor propio.",
  legalName: "Francis Salazar Coaching",
};
