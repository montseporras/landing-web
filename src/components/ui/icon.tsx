import {
  Brain,
  BookOpen,
  CheckSquare,
  Compass,
  Download,
  FileText,
  HeartHandshake,
  Headphones,
  Leaf,
  LayoutTemplate,
  Lightbulb,
  Link2,
  PenLine,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Wind,
  type LucideIcon,
} from "lucide-react";

/**
 * Mapa de iconos por nombre. Permite que el contenido editable (JSON en la
 * base de datos) elija iconos sin importar componentes.
 */
const icons: Record<string, LucideIcon> = {
  Brain,
  BookOpen,
  CheckSquare,
  Compass,
  Download,
  FileText,
  HeartHandshake,
  Headphones,
  Leaf,
  LayoutTemplate,
  Lightbulb,
  Link2,
  PenLine,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Wind,
};

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
