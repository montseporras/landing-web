import { Reveal } from "@/components/motion/reveal";

/** Encabezado editorial compartido por las páginas interiores. */
export function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  /** Contenido adicional (ej.: un párrafo de texto enriquecido) en vez de
   * `description`, en la misma posición visual. */
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pb-16 pt-40 md:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-24 h-96 w-96 rounded-full bg-lavender-100/60 blur-3xl" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-sand-100 blur-3xl" />
      </div>
      <div className="container-content relative">
        <Reveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="text-display-xl max-w-3xl text-balance text-ink">
            {title}{" "}
            {accent && (
              <em className="font-light italic text-gold-600">{accent}</em>
            )}
          </h1>
          {description && (
            <p className="prose-fs mt-6 max-w-2xl text-lg">{description}</p>
          )}
          {children}
        </Reveal>
      </div>
    </header>
  );
}
