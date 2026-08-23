import {
  Anchor,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  CheckSquare,
  Clock,
  Cloud,
  Compass,
  Download,
  Feather,
  FileText,
  Flame,
  Flower2,
  Gem,
  Gift,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Headphones,
  Heart,
  Home,
  Key,
  Landmark,
  LayoutTemplate,
  Leaf,
  Lightbulb,
  Link2,
  Map,
  MessageCircle,
  Mic,
  Moon,
  Mountain,
  PenLine,
  PlayCircle,
  Puzzle,
  Rainbow,
  Rocket,
  Scale,
  Shield,
  ShieldCheck,
  Smile,
  Sparkle,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  Target,
  ThumbsUp,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
  Wind,
  Wand2,
  Waves,
  type LucideIcon,
} from "lucide-react";

/**
 * Mapa de iconos por nombre. Permite que el contenido editable (JSON en la
 * base de datos) elija iconos sin importar componentes.
 */
const icons: Record<string, LucideIcon> = {
  Anchor,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  CheckSquare,
  Clock,
  Cloud,
  Compass,
  Download,
  Feather,
  FileText,
  Flame,
  Flower2,
  Gem,
  Gift,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Headphones,
  Heart,
  Home,
  Key,
  Landmark,
  LayoutTemplate,
  Leaf,
  Lightbulb,
  Link2,
  Map,
  MessageCircle,
  Mic,
  Moon,
  Mountain,
  PenLine,
  PlayCircle,
  Puzzle,
  Rainbow,
  Rocket,
  Scale,
  Shield,
  ShieldCheck,
  Smile,
  Sparkle,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  Target,
  ThumbsUp,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
  Wind,
  Wand2,
  Waves,
};

/** Nombres de todos los íconos disponibles, en el mismo orden que arriba —
 * usados por el selector visual del panel (ver EntityManager, kind:"icon"). */
export const ICON_NAMES = Object.keys(icons);

export function DynamicIcon({
  name,
  size = 22,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = icons[name] ?? Sparkles;
  return <Icon size={size} className={className} aria-hidden />;
}

/**
 * Paleta de color CONTROLADA para el ícono de un servicio: una lista fija de
 * tonos ya presentes en el sistema de diseño (o del set por defecto de
 * Tailwind, que el proyecto no purga). La administradora elige un tono de
 * esta lista — nunca un valor de color libre — así que no hay forma de
 * inyectar CSS arbitrario ni un valor fuera de la paleta visual del sitio.
 * "lavender" es el tono por defecto: es el que ya usaban todos los servicios
 * antes de que existiera esta opción, así que las tarjetas existentes se ven
 * exactamente igual que antes hasta que alguien elija otro color a propósito.
 */
export const ICON_COLOR_OPTIONS = [
  { value: "lavender", label: "Lila" },
  { value: "gold", label: "Dorado" },
  { value: "emerald", label: "Verde" },
  { value: "rose", label: "Rosa" },
  { value: "sky", label: "Celeste" },
  { value: "amber", label: "Ámbar" },
  { value: "stone", label: "Gris" },
] as const;

export type IconColor = (typeof ICON_COLOR_OPTIONS)[number]["value"];

export const DEFAULT_ICON_COLOR: IconColor = "lavender";

const ICON_COLOR_CLASSES: Record<IconColor, string> = {
  lavender: "bg-lavender-100 text-lavender-500",
  gold: "bg-gold-300/30 text-gold-600",
  emerald: "bg-emerald-100 text-emerald-600",
  rose: "bg-rose-100 text-rose-600",
  sky: "bg-sky-100 text-sky-600",
  amber: "bg-amber-100 text-amber-600",
  stone: "bg-stone-100 text-stone-600",
};

/** Clases Tailwind (fondo + color de ícono) para un tono de la paleta
 * controlada. Cualquier valor fuera de la lista cae al tono por defecto. */
export function iconColorClasses(color: string | null | undefined): string {
  return ICON_COLOR_CLASSES[color as IconColor] ?? ICON_COLOR_CLASSES[DEFAULT_ICON_COLOR];
}

/** Color sólido (para el ícono en el selector visual del panel, fuera de su
 * círculo de fondo habitual) por tono de la paleta. */
const ICON_COLOR_DOT_CLASSES: Record<IconColor, string> = {
  lavender: "bg-lavender-500",
  gold: "bg-gold-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  stone: "bg-stone-500",
};

export function iconColorDotClass(color: string | null | undefined): string {
  return ICON_COLOR_DOT_CLASSES[color as IconColor] ?? ICON_COLOR_DOT_CLASSES[DEFAULT_ICON_COLOR];
}
