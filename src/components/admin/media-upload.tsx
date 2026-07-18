"use client";

import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { adminUploadFile } from "@/lib/admin/actions";
import { validateUpload } from "@/lib/media";

/**
 * Subida de archivos al bucket `media`, a través de la server action
 * protegida del panel (la service key nunca llega al navegador).
 *
 * - Valida tipo y peso en el navegador (feedback inmediato) y de nuevo en
 *   el servidor (seguridad real).
 * - Muestra vista previa, estado de carga, y botones de reemplazar/quitar.
 * - `spec` muestra el formato recomendado (medidas, proporción, peso).
 * - Con `multiple` + `onAddMany` permite subir varias imágenes de una vez
 *   (usado por la galería de «Sobre mí»).
 */
export function MediaUpload({
  value,
  onChange,
  onAddMany,
  kind = "image",
  label,
  folder = "images",
  spec,
  multiple = false,
}: {
  value: string | null;
  onChange?: (url: string | null) => void;
  /** Recibe todas las URLs subidas juntas (modo `multiple`). */
  onAddMany?: (urls: string[]) => void;
  kind?: "image" | "file";
  label?: string;
  folder?: string;
  /** Formato recomendado, ej.: "1280×720 px · JPG/PNG/WebP · máx. 8 MB". */
  spec?: string;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isImage = kind === "image";
  const accept = isImage
    ? "image/jpeg,image/png,image/webp,image/avif,image/gif"
    : "image/*,application/pdf,audio/*,video/*,.zip,.epub,.doc,.docx,.ppt,.pptx,.xls,.xlsx";
  const buttonLabel = label ?? (isImage ? "Subir imagen" : "Subir archivo");

  async function uploadOne(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);
    formData.set("kind", kind);
    const { data, error: uploadError } = await adminUploadFile(formData);
    if (uploadError || !data) {
      setError(
        uploadError === "not_configured"
          ? "El backend no está configurado (revisá las variables de entorno)."
          : (uploadError ?? "No se pudo subir el archivo. Intentalo de nuevo."),
      );
      return null;
    }
    return data;
  }

  async function handleFiles(files: File[]) {
    setError(null);

    // Validación inmediata en el navegador (tipo + peso).
    for (const file of files) {
      const invalid = validateUpload(file, kind);
      if (invalid) {
        setError(`${files.length > 1 ? `«${file.name}»: ` : ""}${invalid}`);
        return;
      }
    }

    setUploading(true);
    const uploaded: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files.length > 1)
        setProgress(`Subiendo ${i + 1} de ${files.length}…`);
      const url = await uploadOne(files[i]!);
      if (!url) break; // el error ya quedó visible
      uploaded.push(url);
    }
    setUploading(false);
    setProgress(null);

    if (uploaded.length === 0) return;
    if (multiple && onAddMany) onAddMany(uploaded);
    else onChange?.(uploaded[0]!);
  }

  return (
    <div>
      {value && isImage && (
        <div className="relative mb-3 h-40 w-full max-w-xs overflow-hidden rounded-2xl border border-sand-200 bg-sand-50">
          <Image
            src={value}
            alt="Vista previa"
            fill
            className="object-cover"
            sizes="320px"
          />
        </div>
      )}
      {value && !isImage && (
        <p className="mb-3 truncate rounded-2xl bg-sand-50 px-4 py-2.5 text-xs text-muted">
          {value}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-sand-300 bg-white px-5 text-sm text-ink transition-colors hover:border-gold-400 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 size={15} className="animate-spin" aria-hidden />
          ) : isImage ? (
            <ImageIcon size={15} aria-hidden />
          ) : (
            <Upload size={15} aria-hidden />
          )}
          {uploading
            ? (progress ?? "Subiendo…")
            : value && !multiple
              ? "Reemplazar"
              : buttonLabel}
        </button>
        {value && !multiple && (
          <button
            type="button"
            onClick={() => onChange?.(null)}
            aria-label="Quitar archivo"
            title="Quitar archivo"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand-300 text-muted transition-colors hover:border-red-300 hover:text-red-600"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) handleFiles(files);
          e.target.value = "";
        }}
      />

      {spec && <p className="mt-2 text-xs text-muted">{spec}</p>}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
