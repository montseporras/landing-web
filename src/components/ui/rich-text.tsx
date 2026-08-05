import {
  type Align,
  ensureBlockWrapped,
  sanitizeRichTextForRender,
} from "@/lib/sanitize-html";
import { cn } from "@/lib/utils";

const ALIGN_CLASS: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify-soft",
};

/**
 * Único componente del proyecto que renderiza contenido guardado con
 * `dangerouslySetInnerHTML`. Vuelve a sanear el HTML con una allowlist
 * propia — independiente de la usada al guardar en
 * `src/lib/admin/tables.ts` / `src/lib/admin/actions.ts` — antes de
 * mostrarlo: defensa en profundidad real (dos candados distintos, no el
 * mismo candado girado dos veces), no una formalidad.
 *
 * `align` es una propiedad del CAMPO completo (no por párrafo): reutiliza
 * `.text-justify-soft` (`src/app/globals.css`) para "justificado".
 */
export function RichTextView({
  html,
  align = "left",
  className,
}: {
  html: string;
  align?: Align;
  className?: string;
}) {
  const clean = sanitizeRichTextForRender(html);
  if (!clean) return null;
  return (
    <div
      className={cn("rich-content", ALIGN_CLASS[align], className)}
      dangerouslySetInnerHTML={{ __html: ensureBlockWrapped(clean) }}
    />
  );
}
