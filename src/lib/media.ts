/**
 * Reglas compartidas para archivos subidos desde el panel.
 *
 * Se validan DOS veces: en el navegador (feedback inmediato) y en la server
 * action (seguridad real). Los SVG quedan excluidos porque pueden contener
 * scripts (XSS almacenado).
 */

export const MAX_IMAGE_MB = 8;
export const MAX_FILE_MB = 25;

export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif", "gif"];

export const FILE_EXTENSIONS = [
  ...IMAGE_EXTENSIONS,
  "pdf",
  "mp3",
  "m4a",
  "wav",
  "ogg",
  "mp4",
  "webm",
  "zip",
  "epub",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
];

export function fileExtension(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

/**
 * Valida extensión y tamaño. Devuelve un mensaje de error amigable o null.
 * `kind` decide la lista de extensiones y el peso máximo permitido.
 */
export function validateUpload(
  file: { name: string; size: number },
  kind: "image" | "file",
): string | null {
  const allowed = kind === "image" ? IMAGE_EXTENSIONS : FILE_EXTENSIONS;
  const maxMb = kind === "image" ? MAX_IMAGE_MB : MAX_FILE_MB;

  const ext = fileExtension(file.name);
  if (!allowed.includes(ext)) {
    return kind === "image"
      ? `Formato no permitido. Usá JPG, PNG o WebP.`
      : `Formato no permitido (.${ext || "?"}). Formatos aceptados: PDF, audio, video, imágenes, ZIP u Office.`;
  }
  if (file.size > maxMb * 1024 * 1024) {
    return `El archivo pesa más de ${maxMb} MB. Comprimilo e intentá de nuevo.`;
  }
  if (file.size === 0) {
    return "El archivo está vacío.";
  }
  return null;
}

/** Especificaciones recomendadas por tipo de imagen, para mostrar en el panel. */
export const IMAGE_SPECS = {
  hero: `Recomendado: 1000×1150 px (vertical 7:8) · JPG, PNG o WebP · máx. ${MAX_IMAGE_MB} MB`,
  aboutPhoto: `Recomendado: 800×1000 px (vertical 4:5) · JPG, PNG o WebP · máx. ${MAX_IMAGE_MB} MB`,
  gallery: `Recomendado: 800×800 px (cuadrada) · JPG, PNG o WebP · máx. ${MAX_IMAGE_MB} MB`,
  giftCover: `Recomendado: 1280×720 px (horizontal 16:9) · JPG, PNG o WebP · máx. ${MAX_IMAGE_MB} MB`,
  downloadFile: `PDF, audio, video, ZIP u Office · máx. ${MAX_FILE_MB} MB`,
} as const;
