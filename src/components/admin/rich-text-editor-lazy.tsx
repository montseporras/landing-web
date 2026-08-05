"use client";

import dynamic from "next/dynamic";

/**
 * Punto de importación único del editor enriquecido: usa `next/dynamic`
 * con `ssr: false` para que TipTap se cargue solo en el navegador y quede
 * en su propio chunk, nunca en el HTML servido ni en el bundle del sitio
 * público (que jamás importa este archivo).
 */
export const RichTextEditor = dynamic(
  () =>
    import("@/components/admin/rich-text-editor").then(
      (mod) => mod.RichTextEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="h-48 animate-pulse rounded-2xl border border-sand-200 bg-sand-50"
      />
    ),
  },
);
