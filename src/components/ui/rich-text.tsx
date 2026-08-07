import {
  type Align,
  ensureBlockWrapped,
  getTextAlignmentClass,
  sanitizeRichTextForRender,
} from "@/lib/sanitize-html";
import { cn } from "@/lib/utils";

/**
 * Único componente del proyecto que renderiza contenido guardado con
 * `dangerouslySetInnerHTML`. Vuelve a sanear el HTML con una allowlist
 * propia — independiente de la usada al guardar en
 * `src/lib/admin/tables.ts` / `src/lib/admin/actions.ts` — antes de
 * mostrarlo: defensa en profundidad real (dos candados distintos, no el
 * mismo candado girado dos veces), no una formalidad.
 *
 * `align` es una propiedad del CAMPO completo (no por párrafo). La clase de
 * alineación SIEMPRE sale de `getTextAlignmentClass()` — nunca se interpola
 * el valor a mano — así un dato corrupto nunca puede colar una clase
 * arbitraria. `.hyphens-soft` es una mejora tipográfica aparte (evita "ríos"
 * de blanco en columnas angostas justificadas); no fija `text-align` por sí
 * misma, así que nunca puede pisar la alineación elegida.
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
      className={cn(
        "rich-content",
        getTextAlignmentClass(align),
        align === "justify" && "hyphens-soft",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: ensureBlockWrapped(clean) }}
    />
  );
}
