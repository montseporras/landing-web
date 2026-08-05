import sanitizeHtmlLib from "sanitize-html";
import { isSafeUrl } from "@/lib/validation";

/**
 * Saneamiento de texto enriquecido (paneles → sitio público).
 *
 * Defensa en profundidad en dos capas independientes, cada una con su propia
 * allowlist definida a mano (no comparten configuración): así un error en el
 * allowlist de guardado no desactiva también la de render — son dos candados
 * distintos, no el mismo candado girado dos veces.
 *
 * 1. `sanitizeRichTextHtml`   — al guardar (server actions del panel).
 * 2. `sanitizeRichTextForRender` — al renderizar (componente `<RichText>`),
 *    vuelve a limpiar por si algún dato llegó a la base sin pasar por (1).
 */

export type Align = "left" | "center" | "right" | "justify";
export const ALIGN_VALUES: readonly Align[] = [
  "left",
  "center",
  "right",
  "justify",
];
export const DEFAULT_ALIGN: Align = "left";

export interface RichText {
  html: string;
  align: Align;
}

/**
 * Firmas de ataque conocidas. Si aparecen en la entrada CRUDA (antes de
 * sanear), se rechaza el guardado con un mensaje amigable en vez de limpiar
 * en silencio: evita pérdida silenciosa de contenido legítimo (p. ej. ruido
 * de formato al pegar desde Word, que sí se limpia sin rechazo) y deja
 * rastro en el log de intentos reales de inyección.
 */
const DANGEROUS_PATTERN =
  /<\s*script|<\s*iframe|<\s*object|<\s*embed|<\s*form|javascript:|vbscript:|data:text\/html|on[a-z]+\s*=/i;

export function containsDangerousMarkup(raw: unknown): boolean {
  return DANGEROUS_PATTERN.test(String(raw ?? ""));
}

function isSafeRichTextHref(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (/^mailto:/i.test(trimmed)) {
    return /^mailto:[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(trimmed);
  }
  return isSafeUrl(trimmed);
}

/** Reescribe enlaces: descarta href inseguros, fuerza noopener/noreferrer en externos. */
function transformLink(
  _tagName: string,
  attribs: Record<string, string>,
): sanitizeHtmlLib.Tag {
  const href = (attribs.href ?? "").trim();
  if (!isSafeRichTextHref(href)) {
    return { tagName: "span", attribs: {} };
  }
  const external = /^https?:/i.test(href);
  return {
    tagName: "a",
    attribs: external
      ? { href, target: "_blank", rel: "noopener noreferrer" }
      : { href },
  };
}

/** Sanitizador de escritura: se usa antes de persistir en Supabase. */
export function sanitizeRichTextHtml(raw: unknown): string {
  const clean = sanitizeHtmlLib(String(raw ?? ""), {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li", "a"],
    allowedAttributes: { a: ["href"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    transformTags: { a: transformLink },
  });
  return clean.trim();
}

/**
 * Sanitizador de RENDER: allowlist propia, definida por separado de la de
 * escritura a propósito (defensa en profundidad real, no la misma función
 * llamada dos veces). Es la única función del proyecto que debe alimentar un
 * `dangerouslySetInnerHTML` (a través de `src/components/ui/rich-text.tsx`).
 */
export function sanitizeRichTextForRender(html: unknown): string {
  const clean = sanitizeHtmlLib(String(html ?? ""), {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li", "a"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
  });
  return clean.trim();
}

export function isValidAlign(value: unknown): value is Align {
  return (
    typeof value === "string" &&
    (ALIGN_VALUES as readonly string[]).includes(value)
  );
}

/** Envuelve texto sin etiqueta de bloque en un `<p>` (nunca dejar texto suelto). */
export function ensureBlockWrapped(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return "";
  return /^<(p|ul|ol)[ >]/i.test(trimmed) ? trimmed : `<p>${trimmed}</p>`;
}

/** RichText vacío, útil como valor por defecto. */
export function emptyRichText(align: Align = DEFAULT_ALIGN): RichText {
  return { html: "", align };
}

/**
 * Convierte un valor legado (texto plano, guardado antes de que este campo
 * existiera como texto enriquecido) en `RichText`, escapando entidades para
 * que un `&`/`<`/`>` suelto en el texto viejo no se interprete como HTML.
 */
function legacyTextToRichText(value: string, align: Align): RichText {
  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();
  return { html: escaped ? `<p>${escaped}</p>` : "", align };
}

/**
 * Normaliza un valor de `site_content` a `RichText`, sin importar si viene
 * de una fila guardada ANTES de este CMS (texto plano) o después (objeto
 * `{ html, align }`). Se usa en la capa de lectura (`src/lib/content/
 * queries.ts`) para que datos existentes nunca se pierdan ni rompan el
 * render al activar texto enriquecido en un campo que antes era simple.
 */
export function coerceRichText(value: unknown, fallback: RichText): RichText {
  if (typeof value === "string") {
    return legacyTextToRichText(value, fallback.align);
  }
  if (value && typeof value === "object" && "html" in value) {
    const v = value as Partial<RichText>;
    return {
      html: typeof v.html === "string" ? v.html : fallback.html,
      align: isValidAlign(v.align) ? v.align : fallback.align,
    };
  }
  return fallback;
}
