import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "lila" | "secondary" | "ghost" | "gold" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-all duration-300 focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-lavender-500 " +
  "disabled:pointer-events-none disabled:opacity-50";

// Botón principal: lila sólido (identidad de marca), con leve elevación al
// pasar el mouse. "primary" y "lila" comparten estilo — se mantienen los dos
// nombres por claridad semántica en cada punto de uso.
const lilaSolid =
  "bg-lavender-600 text-white shadow-lila hover:bg-lavender-700 hover:shadow-lifted hover:-translate-y-0.5 active:translate-y-0";

const variants: Record<Variant, string> = {
  primary: lilaSolid,
  lila: lilaSolid,
  gold: "bg-gold-500 text-white hover:bg-gold-600 hover:shadow-gold hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "border border-sand-300 bg-white/60 text-ink backdrop-blur hover:border-lavender-400 hover:bg-white hover:shadow-soft",
  ghost: "text-ink hover:bg-lavender-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", href, children, ...props },
    ref,
  ) => {
    const classes = cn(base, variants[variant], sizes[size], className);
    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
