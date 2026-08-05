"use client";

import { PageHeaderEditor } from "@/components/admin/content-editors";
import { EntityManager } from "@/components/admin/entity-manager";
import {
  AdminHeader,
  CancelButton,
  ErrorNotice,
  NotConfigured,
  RestoreDefaultButton,
  SaveButton,
  UnsavedNotice,
} from "@/components/admin/ui";
import { useSiteContent } from "@/components/admin/use-site-content";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultGiftsPage } from "@/lib/content/defaults";
import { IMAGE_SPECS } from "@/lib/media";

export default function AdminRegalosPage() {
  const page = useSiteContent("gifts_page", defaultGiftsPage);

  return (
    <>
      <AdminHeader
        title="Regalos"
        description="Encabezado de la página y los recursos descargables que se muestran en el sitio."
      />

      {page.configured && !page.loading ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            page.save();
          }}
          className="mb-8 space-y-4"
        >
          <ErrorNotice message={page.error} />
          <PageHeaderEditor
            value={page.value.header}
            onChange={(header) => page.setValue({ ...page.value, header })}
          />
          <UnsavedNotice show={page.isDirty} />
          <div className="flex justify-end gap-3">
            <RestoreDefaultButton
              onClick={() => page.restoreDefault("Encabezado de Regalos")}
            />
            <CancelButton onClick={page.cancel} />
            <SaveButton saving={page.saving} saved={page.saved} />
          </div>
        </form>
      ) : page.loading ? (
        <Skeleton className="mb-8 h-48" />
      ) : (
        <div className="mb-8">
          <NotConfigured />
        </div>
      )}

      <EntityManager
        table="gifts"
        itemName="regalo"
        titleField="title"
        fields={[
          { name: "title", label: "Título", kind: "text", required: true },
          {
            name: "description",
            label: "Descripción",
            kind: "richtext",
            alignField: "description_align",
          },
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
