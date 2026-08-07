import type {
  AboutContent,
  AboutSections,
  BenefitItem,
  ContactPageContent,
  Faq,
  FaqPageContent,
  FooterCta,
  GeneralSettings,
  Gift,
  GiftsPageContent,
  HeroContent,
  HomeSections,
  RichText,
  SeoSettings,
  Service,
  ServicesPageContent,
  SocialLinks,
  StepItem,
} from "@/lib/types";

/** Envuelve texto plano en un párrafo de texto enriquecido, alineado a la izquierda. */
function rich(text: string): RichText {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return { html: `<p>${escaped}</p>`, align: "left" };
}

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

export const defaultBenefits: BenefitItem[] = [
  {
    id: "benefit-1",
    icon: "HeartHandshake",
    title: "Gestión emocional real",
    description:
      "Aprendé a identificar, nombrar y regular lo que sentís, en lugar de reprimirlo o quedar a su merced.",
    active: true,
  },
  {
    id: "benefit-2",
    icon: "Brain",
    title: "Base en neurociencia",
    description:
      "Cada herramienta que uso está respaldada por cómo funciona realmente tu cerebro, sin promesas mágicas.",
    active: true,
  },
  {
    id: "benefit-3",
    icon: "Sparkles",
    title: "Amor propio sólido",
    description:
      "Construí una relación con vos que no dependa de la validación externa ni de resultados perfectos.",
    active: true,
  },
  {
    id: "benefit-4",
    icon: "Compass",
    title: "Claridad y dirección",
    description:
      "Definí qué querés de verdad y diseñá pasos concretos para llegar, a tu ritmo y sin autoexigencia tóxica.",
    active: true,
  },
  {
    id: "benefit-5",
    icon: "ShieldCheck",
    title: "Confianza que se sostiene",
    description:
      "Dejá de esperar sentirte lista para actuar: la seguridad se entrena con método y acompañamiento.",
    active: true,
  },
  {
    id: "benefit-6",
    icon: "Leaf",
    title: "Calma como hábito",
    description:
      "Prácticas simples y sostenibles para bajar el ruido mental y habitar tu día con más serenidad.",
    active: true,
  },
];

/**
 * Normaliza el array de beneficios a la forma actual (`id`/`active`), sin
 * perder contenido guardado ANTES de que esos dos campos existieran: a los
 * ítems viejos se les asigna un `id` estable por posición y `active: true`
 * (mismo comportamiento visual que tenían antes de este campo existir).
 */
export function coerceBenefitItems(items: unknown): BenefitItem[] {
  if (!Array.isArray(items)) return defaultBenefits;
  return items.map((raw, i) => {
    const item = (raw ?? {}) as Partial<BenefitItem>;
    return {
      id: typeof item.id === "string" && item.id ? item.id : `benefit-legacy-${i}`,
      icon: typeof item.icon === "string" && item.icon ? item.icon : "Sparkles",
      title: typeof item.title === "string" ? item.title : "",
      description: typeof item.description === "string" ? item.description : "",
      active: typeof item.active === "boolean" ? item.active : true,
    };
  });
}

export const defaultAbout: AboutContent = {
  eyebrow: "Sobre mí",
  title: "Hola, soy Francis",
  bio: rich(
    "Coach especializada en gestión emocional, inteligencia emocional y neurociencia aplicada al desarrollo personal. Acompaño procesos de transformación profundos, humanos y sin fórmulas vacías.",
  ),
  story: rich(
    "Durante años hice todo «bien» — estudié, trabajé, cumplí — y aun así sentía que vivía en piloto automático, con una autoexigencia que no descansaba nunca. Mi propio proceso de terapia, formación en coaching y estudio de la neurociencia me enseñó algo que hoy es el corazón de mi trabajo: no necesitás convertirte en otra persona, necesitás volver a vos. Desde entonces acompañé a cientos de personas a hacer ese mismo viaje: del ruido mental a la calma, de la autocrítica al amor propio, del miedo a la confianza.",
  ),
  mission: rich(
    "Mi misión es que tengas herramientas concretas para gestionar tus emociones y construir una vida que se sienta tuya — con ciencia, con calidez y sin juicio.",
  ),
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

export const defaultHowItWorks: StepItem[] = [
  {
    id: "step-1",
    title: "Llamada de claridad",
    description:
      "Nos conocemos en una llamada gratuita de 30 minutos. Me contás dónde estás, qué te pasa y qué querés cambiar. Sin compromiso.",
    active: true,
  },
  {
    id: "step-2",
    title: "Diseño de tu proceso",
    description:
      "Si somos match, diseño un plan a tu medida: objetivos, frecuencia de sesiones y herramientas específicas para tu momento.",
    active: true,
  },
  {
    id: "step-3",
    title: "Sesiones + práctica",
    description:
      "Trabajamos en sesiones online profundas y entre sesiones aplicás ejercicios concretos. Acá es donde ocurre el cambio.",
    active: true,
  },
  {
    id: "step-4",
    title: "Integración",
    description:
      "Cerramos el proceso cuando las herramientas ya son tuyas: te vas con un método propio para sostener lo logrado.",
    active: true,
  },
];

/**
 * Normaliza el array de pasos a la forma actual (`id`/`active`, sin el
 * viejo campo `step`), sin perder contenido guardado antes de este cambio.
 */
export function coerceStepItems(items: unknown): StepItem[] {
  if (!Array.isArray(items)) return defaultHowItWorks;
  return items.map((raw, i) => {
    const item = (raw ?? {}) as Partial<StepItem>;
    return {
      id: typeof item.id === "string" && item.id ? item.id : `step-legacy-${i}`,
      title: typeof item.title === "string" ? item.title : "",
      description: typeof item.description === "string" ? item.description : "",
      active: typeof item.active === "boolean" ? item.active : true,
    };
  });
}

export const defaultServices: Service[] = [
  {
    id: "s1",
    title: "Proceso individual 1:1",
    description:
      "<p>Un acompañamiento personalizado de 3 meses para trabajar en profundidad tu gestión emocional, confianza y amor propio.</p>",
    description_align: "left",
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
      "<p>Una sesión intensiva de 90 minutos para destrabar una situación concreta: una decisión, un conflicto, un momento de ansiedad.</p>",
    description_align: "left",
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
      "<p>Acompañamiento para empresas e instituciones: capacitaciones corporativas e intervenciones que fortalecen el liderazgo, la comunicación efectiva y el bienestar de los equipos.</p>",
    description_align: "left",
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
      "<p>Mi ebook con el método de 5 pasos que uso con mis clientes para pasar del caos emocional a la calma. Incluye ejercicios, plantillas y un plan de 7 días.</p>",
    description_align: "left",
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
      "<p>Audio de 12 minutos para soltar el ruido mental y volver al presente. Ideal para empezar o cerrar el día.</p>",
    description_align: "left",
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
      "<p>Una lista imprimible con recursos rápidos para días difíciles: qué hacer, qué evitar y a quién llamar.</p>",
    description_align: "left",
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
      "<p>Registrá tus emociones, disparadores y aprendizajes semana a semana con esta plantilla lista para imprimir.</p>",
    description_align: "left",
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
      "<p>Una práctica de respiración guiada de 6 minutos, basada en neurociencia, para usar en cualquier momento.</p>",
    description_align: "left",
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
      "<p>Un guion paso a paso para comunicar límites con calma y firmeza, sin culpa y sin discusiones eternas.</p>",
    description_align: "left",
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
      "<p>La terapia trabaja principalmente sanando el pasado y tratando cuadros clínicos; el coaching trabaja desde tu presente hacia tus objetivos. Yo trabajo con personas funcionales que quieren mejorar su gestión emocional, confianza y claridad. Si en el proceso detecto que necesitás apoyo terapéutico, te lo digo con honestidad y puedo derivarte con profesionales de confianza.</p>",
    answer_align: "left",
    active: true,
    sort_order: 1,
  },
  {
    id: "f2",
    question: "¿Cómo son las sesiones?",
    answer:
      "<p>Son encuentros online de 60 minutos por videollamada, en un espacio 100% confidencial. Combinamos conversación profunda con herramientas prácticas de coaching, inteligencia emocional y neurociencia. Entre sesiones te llevás ejercicios concretos para aplicar lo trabajado.</p>",
    answer_align: "left",
    active: true,
    sort_order: 2,
  },
  {
    id: "f3",
    question: "¿Cuánto dura un proceso?",
    answer:
      "<p>El proceso individual completo dura 3 meses, con una sesión semanal. Es el tiempo que la evidencia y mi experiencia muestran necesario para instalar nuevos hábitos emocionales. También ofrezco sesiones puntuales de claridad para temas específicos.</p>",
    answer_align: "left",
    active: true,
    sort_order: 3,
  },
  {
    id: "f4",
    question: "¿La primera llamada tiene costo?",
    answer:
      "<p>No. La llamada de claridad de 30 minutos es gratuita y sin compromiso. Sirve para conocernos, entender tu momento y ver si puedo ayudarte. Si no soy la persona indicada, te lo digo.</p>",
    answer_align: "left",
    active: true,
    sort_order: 4,
  },
  {
    id: "f5",
    question: "¿Trabajás con hombres también?",
    answer:
      "<p>Sí. Aunque gran parte de mi comunidad son mujeres, acompaño a cualquier persona comprometida con su desarrollo emocional. Las emociones no tienen género.</p>",
    answer_align: "left",
    active: true,
    sort_order: 5,
  },
  {
    id: "f6",
    question: "¿Qué pasa si necesito reprogramar una sesión?",
    answer:
      "<p>Podés reprogramar sin costo avisando con al menos 24 horas de anticipación. La vida pasa, y el proceso está diseñado para adaptarse a ella.</p>",
    answer_align: "left",
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

/** Encabezados de las secciones de la página de inicio. */
export const defaultHomeSections: HomeSections = {
  benefits: {
    eyebrow: "Lo que vas a lograr",
    title: "Un método para sentirte bien",
    titleAccent: "de verdad",
    subtitle:
      "No se trata de pensar en positivo: se trata de entender tu mente y entrenarla a tu favor.",
  },
  howItWorks: {
    eyebrow: "Cómo trabajamos",
    title: "Camino Claro,",
    titleAccent: "Paso a Paso",
    subtitle:
      "Un proceso simple y transparente, diseñado para que sepas exactamente qué esperar en cada etapa.",
  },
  services: {
    eyebrow: "Servicios",
    title: "Formas de trabajar",
    titleAccent: "juntas",
    subtitle:
      "Cada proceso está diseñado para tu momento: profundidad cuando la necesitás, claridad cuando la buscás.",
  },
  giftsTeaser: {
    eyebrow: "Regalos para vos",
    title: "Empezá hoy, con un",
    titleAccent: "regalo",
    subtitle:
      "Guías, meditaciones y plantillas gratuitas para dar el primer paso a tu ritmo.",
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Todo lo que querés",
    titleAccent: "saber",
    subtitle:
      "Si tu pregunta no está acá, escribime sin vergüenza: respondo personalmente cada mensaje.",
  },
  finalCta: {
    eyebrow: "Tu momento es ahora",
    title: "La vida que querés empieza en",
    titleAccent: "cómo te sentís",
    description:
      "Reservá tu llamada de claridad gratuita de 30 minutos. Sin compromiso, sin presión: solo una conversación honesta sobre dónde estás y hacia dónde querés ir.",
    primaryCta: { label: "Reservar mi llamada gratuita", href: "/contacto" },
    secondaryCta: {
      label: "Prefiero empezar por un regalo",
      href: "/regalos",
    },
  },
};

/** Encabezados de "Sobre mí" que no forman parte de `about`. */
export const defaultAboutSections: AboutSections = {
  storyHeading: "Mi historia",
  valuesHeader: {
    eyebrow: "Mis valores",
    title: "Cómo trabajo",
    titleAccent: "con vos",
  },
  galleryHeader: { eyebrow: "Galería", title: "Detrás de escena" },
};

export const defaultServicesPage: ServicesPageContent = {
  header: {
    eyebrow: "Servicios",
    title: "Un acompañamiento a la medida de",
    titleAccent: "tu momento",
    description:
      "Todos los procesos son online, confidenciales y combinan coaching, inteligencia emocional y neurociencia aplicada. Elegí el formato que mejor se adapte a vos.",
  },
};

export const defaultGiftsPage: GiftsPageContent = {
  header: {
    eyebrow: "Regalos",
    title: "Herramientas gratuitas, creadas",
    titleAccent: "para vos",
    description:
      "Guías, meditaciones, plantillas y checklists que uso con mis clientes, disponibles sin costo. Elegí el que tu momento necesita y descargalo.",
  },
};

export const defaultFaqPage: FaqPageContent = {
  header: {
    eyebrow: "Preguntas frecuentes",
    title: "Preguntas",
    titleAccent: "frecuentes",
    description:
      "Todo lo que necesitás saber antes de empezar tu proceso. Si algo no está acá, escribime.",
  },
};

export const defaultContactPage: ContactPageContent = {
  header: {
    eyebrow: "Contacto",
    title: "Demos el primer paso,",
    titleAccent: "juntas",
    description:
      "Reservá tu llamada de claridad gratuita o escribime lo que necesites. Leo y respondo personalmente cada mensaje, en menos de 48 horas.",
  },
  channelBlurbs: {
    whatsapp: "La vía más rápida para consultas breves.",
    email: "Para consultas más largas o propuestas.",
    instagram: "Contenido diario y mensajes directos.",
  },
  note: {
    title: "Un detalle importante",
    text: "Tu información es 100% confidencial. Nunca comparto datos y solo te escribo para responder tu consulta.",
  },
};

/** Bloque CTA de la columna derecha del footer. */
export const defaultFooterCta: FooterCta = {
  eyebrow: "¿Empezamos?",
  title: "Reservá tu llamada de claridad",
  text: "30 minutos, gratis y sin compromiso, para conocernos y ver cómo puedo acompañarte.",
  buttonLabel: "Reservar llamada",
  buttonHref: "/contacto",
};
