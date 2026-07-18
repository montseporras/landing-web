import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Retrato con placeholder elegante.
 * Si no hay imagen configurada, muestra un monograma sobre un degradé suave;
 * al subir una foto desde el panel, se reemplaza automáticamente.
 */
export function Portrait({
  src,
  alt,
  monogram = "FS",
  className,
  sizes = "(max-width: 768px) 100vw, 40vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  monogram?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-4xl bg-gradient-to-br from-sand-100 via-lavender-100 to-sand-200",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Formas orgánicas decorativas */}
          <div
            aria-hidden
            className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-lavender-200/50 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-gold-300/30 blur-3xl"
          />
          <span className="relative font-display text-7xl font-semibold tracking-tight text-ink/20">
            {monogram}
          </span>
        </div>
      )}
    </div>
  );
}
