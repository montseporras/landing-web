"use client";

import { EntityManager } from "@/components/admin/entity-manager";
import { AdminHeader } from "@/components/admin/ui";
import { IMAGE_SPECS } from "@/lib/media";

export default function AdminRegalosPage() {
  return (
    <>
      <AdminHeader
        title="Regalos"
        description="Creá, editá y ordená los recursos descargables. Los regalos que vienen de fábrica también aparecen acá y podés modificarlos o eliminarlos."
      />
      <EntityManager
        table="gifts"
        itemName="regalo"
        titleField="title"
        fields={[
          { name: "title", label: "Título", kind: "text", required: true },
          { name: "description", label: "Descripción", kind: "textarea" },
          {
            name: "category",
            label: "Tipo de recurso",
            kind: "text",
            placeholder: "Ebook, Guía, Meditación, Curso, Workbook…",
            hint: "Escribí el tipo que quieras: no hay una lista fija. Se usa para las etiquetas y los filtros.",
            defaultValue: "Ebook",
          },
          {
            name: "image",
            label: "Portada",
            kind: "image",
            hint: "Imagen de la tarjeta del regalo (opcional).",
            spec: IMAGE_SPECS.giftCover,
          },
          {
            name: "access",
            label: "¿Cómo accede la persona?",
            kind: "select",
            options: [
              { value: "directo", label: "Descarga directa (clic y descarga)" },
              {
                value: "email",
                label: "Pedir email antes de entregar el archivo",
              },
              {
                value: "enlace",
                label: "Redirigir a un enlace externo (Drive, YouTube…)",
              },
            ],
            hint: "Con «Pedir email», el contacto queda guardado en Formularios → Descargas de regalos.",
          },
          {
            name: "file_url",
            label: "Archivo descargable",
            kind: "file",
            hint: "Para los modos «Descarga directa» y «Pedir email».",
            spec: IMAGE_SPECS.downloadFile,
          },
          {
            name: "url",
            label: "Enlace externo",
            kind: "text",
            placeholder: "https://…",
            hint: "Solo para el modo «Redirigir a un enlace externo».",
          },
          {
            name: "featured",
            label: "Destacar en la portada (eBook principal)",
            kind: "toggle",
            defaultValue: false,
            hint: "El regalo destacado se muestra en grande en la página de inicio. Se recomienda destacar solo uno.",
          },
          { name: "active", label: "Visible en el sitio", kind: "toggle" },
        ]}
      />
    </>
  );
}
