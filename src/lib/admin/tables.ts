import {
  ALIGN_VALUES,
  containsDangerousMarkup,
  DEFAULT_ALIGN,
  sanitizeRichTextHtml,
} from "@/lib/sanitize-html";
import { cleanText, isSafeUrl, LIMITS } from "@/lib/validation";

/**
 * Allowlist de tablas y columnas del panel.
 *
 * Las server actions genéricas (adminInsert/adminUpdate) solo aceptan tablas
 * y columnas listadas acá, y cada valor pasa por su sanitizador. Así ningún
 * payload manipulado desde el navegador puede tocar columnas o tablas ajenas.
 */

type Sanitizer = (value: unknown) => unknown | undefined;

const asBool: Sanitizer = (v) => Boolean(v);
const asInt: Sanitizer = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(100000, Math.round(n))) : 0;
};
const asText =
  (max: number, { required = false } = {}): Sanitizer =>
  (v) => {
    const s = cleanText(v, max);
    if (required && !s) return undefined; // undefined ⇒ payload inválido
    return s;
  };
const asNullableText =
  (max: number): Sanitizer =>
  (v) => {
    const s = cleanText(v, max);
    return s || null;
  };
const asNullableUrl: Sanitizer = (v) => {
  const s = cleanText(v, LIMITS.url);
  if (!s) return null;
  return isSafeUrl(s) ? s : undefined;
};
/** Array de líneas (una por ítem): limpia cada línea y descarta vacías. */
const asLines: Sanitizer = (v) => {
  const arr = Array.isArray(v) ? v : typeof v === "string" ? v.split("\n") : [];
  return arr
    .map((line) => cleanText(line, 200))
    .filter(Boolean)
    .slice(0, 20);
};

/**
 * Texto enriquecido (negrita, cursiva, listas, enlaces): se sanea con una
 * allowlist estricta antes de guardar (`src/lib/sanitize-html.ts`). Si el
 * texto crudo contiene una firma de ataque conocida (`<script>`,
 * `javascript:`, atributos `on*`, iframes…) el guardado se RECHAZA en vez de
 * limpiarse en silencio — evita pérdida silenciosa de contenido legítimo y
 * deja rastro de intentos reales de inyección. Un texto demasiado largo
 * también se rechaza.
 */
const asRichText =
  (maxLen: number): Sanitizer =>
  (v) => {
    const raw = typeof v === "string" ? v : "";
    if (containsDangerousMarkup(raw)) return undefined;
    const clean = sanitizeRichTextHtml(raw);
    if (clean.length > maxLen) return undefined;
    return clean;
  };

/** Alineación de un campo de texto enriquecido. */
const asAlign: Sanitizer = (v) =>
  typeof v === "string" && (ALIGN_VALUES as readonly string[]).includes(v)
    ? v
    : DEFAULT_ALIGN;

const GIFT_ACCESS = new Set(["directo", "email", "enlace"]);
const SUBMISSION_STATUS = new Set(["nuevo", "leido", "archivado"]);

const TABLES: Record<string, Record<string, Sanitizer>> = {
  gifts: {
    title: asText(LIMITS.title, { required: true }),
    description: asRichText(LIMITS.richText),
    description_align: asAlign,
    category: (v) => cleanText(v, 60) || "Ebook",
    image: asNullableUrl,
    file_url: asNullableUrl,
    url: asNullableUrl,
    access: (v) => (GIFT_ACCESS.has(String(v)) ? String(v) : "directo"),
    featured: asBool,
    active: asBool,
    sort_order: asInt,
  },
  faqs: {
    question: asText(LIMITS.title, { required: true }),
    answer: asRichText(LIMITS.richText),
    answer_align: asAlign,
    active: asBool,
    sort_order: asInt,
  },
  services: {
    title: asText(LIMITS.title, { required: true }),
    description: asRichText(LIMITS.richText),
    description_align: asAlign,
    features: asLines,
    price_label: asNullableText(60),
    cta_label: (v) => cleanText(v, 80) || "Reservar llamada",
    icon: (v) => cleanText(v, 40) || "Sparkles",
    image: asNullableUrl,
    highlighted: asBool,
    active: asBool,
    sort_order: asInt,
  },
  // De los formularios recibidos, la admin solo puede cambiar el estado o
  // quitarlos de la bandeja (soft-delete); jamás borrarlos de la base.
  submissions: {
    status: (v) => (SUBMISSION_STATUS.has(String(v)) ? String(v) : "nuevo"),
    hidden: asBool,
  },
};

export const ALLOWED_TABLES = new Set(Object.keys(TABLES));

/** Claves permitidas de site_content (contenido editable por secciones). */
export const ALLOWED_CONTENT_KEYS = new Set([
  "hero",
  "about",
  "social",
  "seo",
  "general",
  "benefits",
  "how_it_works",
  "home_sections",
  "about_sections",
  "services_page",
  "gifts_page",
  "faq_page",
  "contact_page",
  "footer",
  "seeded:gifts",
  "seeded:faqs",
  "seeded:services",
]);

/**
 * Rutas (dentro del JSON de cada clave) que contienen texto enriquecido y
 * deben pasar por `sanitizeRichTextHtml`/`containsDangerousMarkup` — el
 * resto de los strings de `site_content` solo se recortan (`cleanText`) pero
 * se guardan como texto plano. Ver `adminUpsertContent`
 * (`src/lib/admin/actions.ts`).
 *
 * Apunta al sub-campo `.html` de cada `RichText` (no al objeto completo):
 * el valor en esa ruta es el string HTML que hay que sanear estrictamente;
 * `.align` es solo una de 4 palabras fijas y se limpia como texto simple.
 */
export const RICH_FIELD_PATHS: Record<string, string[][]> = {
  about: [["bio", "html"], ["story", "html"], ["mission", "html"]],
};

export interface SanitizeResult {
  payload: Record<string, unknown> | null;
  error: string | null;
}

/**
 * Filtra y sanitiza un payload contra la allowlist de su tabla.
 * Devuelve error amigable si la tabla no existe o un campo requerido quedó vacío.
 */
export function sanitizePayload(
  table: string,
  raw: Record<string, unknown>,
): SanitizeResult {
  const columns = TABLES[table];
  if (!columns) return { payload: null, error: "Operación no permitida." };

  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    const sanitize = columns[key];
    if (!sanitize) continue; // columna no listada: se ignora
    const clean = sanitize(value);
    if (clean === undefined) {
      return {
        payload: null,
        error:
          key === "title" || key === "question"
            ? "Completá el título antes de guardar."
            : key === "description" || key === "answer"
              ? "El texto contiene una etiqueta o formato no permitido, o es demasiado largo. Revisalo e intentá de nuevo."
              : "Revisá los datos ingresados: hay un valor inválido.",
      };
    }
    payload[key] = clean;
  }

  if (Object.keys(payload).length === 0) {
    return { payload: null, error: "No hay cambios para guardar." };
  }
  return { payload, error: null };
}

const CONTENT_STRING_MAX = 20000;
const FRIENDLY_CONTENT_ERROR =
  "El contenido tiene una etiqueta o formato no permitido, o un texto demasiado largo. Revisalo e intentá de nuevo.";

function isRichPath(paths: string[][], path: string[]): boolean {
  return paths.some(
    (p) => p.length === path.length && p.every((seg, i) => seg === path[i]),
  );
}

/**
 * Sanea recursivamente TODOS los strings de un valor JSON de `site_content`
 * antes de guardar: recorta caracteres de control en cualquier campo, y
 * aplica el saneamiento estricto de texto enriquecido (o rechaza el
 * guardado si detecta una firma de ataque) en las rutas listadas en
 * `RICH_FIELD_PATHS` para esa clave. Sin esto, `adminUpsertContent` no
 * sanitizaba ningún string — era seguro solo porque hasta ahora todo el
 * contenido se renderizaba como texto plano.
 */
function sanitizeContentNode(
  value: unknown,
  richPaths: string[][],
  path: string[],
): { value: unknown; rejected: boolean } {
  if (typeof value === "string") {
    if (isRichPath(richPaths, path)) {
      if (containsDangerousMarkup(value)) return { value: null, rejected: true };
      const clean = sanitizeRichTextHtml(value);
      if (clean.length > LIMITS.richText) return { value: null, rejected: true };
      return { value: clean, rejected: false };
    }
    return { value: cleanText(value, CONTENT_STRING_MAX), rejected: false };
  }
  if (Array.isArray(value)) {
    const out: unknown[] = [];
    for (let i = 0; i < value.length; i++) {
      const r = sanitizeContentNode(value[i], richPaths, [...path, String(i)]);
      if (r.rejected) return { value: null, rejected: true };
      out.push(r.value);
    }
    return { value: out, rejected: false };
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const r = sanitizeContentNode(v, richPaths, [...path, k]);
      if (r.rejected) return { value: null, rejected: true };
      out[k] = r.value;
    }
    return { value: out, rejected: false };
  }
  return { value, rejected: false }; // number, boolean, null
}

export interface SanitizeContentResult {
  value: unknown;
  error: string | null;
}

/** Punto de entrada usado por `adminUpsertContent` para sanear una clave de `site_content`. */
export function sanitizeContentPayload(
  key: string,
  value: unknown,
): SanitizeContentResult {
  const richPaths = RICH_FIELD_PATHS[key] ?? [];
  const { value: clean, rejected } = sanitizeContentNode(value, richPaths, []);
  if (rejected) return { value: null, error: FRIENDLY_CONTENT_ERROR };
  return { value: clean, error: null };
}
