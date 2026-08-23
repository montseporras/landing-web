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
            label: "Imagen de tarjeta",
            kind: "image",
            hint: "Se usa en /regalos y en cualquier listado horizontal (opcional).",
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
              {
                value: "breve_completo",
                label: "Edición breve + edición completa",
              },
            ],
            hint: "Con «Pedir email», el contacto queda guardado en Formularios → Descargas de regalos. Con «Edición breve + edición completa», la tarjeta descarga la edición breve sin pedir nada y un enlace lleva al formulario de la edición completa.",
          },
          {
            name: "file_url",
            label: "Archivo descargable",
            kind: "file",
            hint: "En «Edición breve + edición completa» es la edición breve (descarga directa, sin pedir nada).",
            spec: IMAGE_SPECS.downloadFile,
            showWhen: (v) =>
              v.access === "directo" ||
              v.access === "email" ||
              v.access === "breve_completo",
          },
          {
            name: "url",
            label: "Enlace externo",
            kind: "text",
            placeholder: "https://…",
            showWhen: (v) => v.access === "enlace",
          },
          {
            name: "full_file_path",
            label: "Archivo de la edición completa",
            kind: "file",
            folder: "gifts",
            bucket: "gifts-full",
            hint: "Se guarda en un almacenamiento privado: nunca queda con URL pública, se entrega recién al completar el formulario.",
            spec: IMAGE_SPECS.downloadFile,
            showWhen: (v) => v.access === "breve_completo",
          },
          {
            name: "full_cta_label",
            label: "Texto del CTA hacia la edición completa",
            kind: "text",
            placeholder: "Quiero la edición completa",
            hint: "Es el texto del enlace que lleva al formulario — usalo también como CTA dentro del PDF de la edición breve.",
            showWhen: (v) => v.access === "breve_completo",
          },
          {
            name: "full_form_title",
            label: "Título del formulario",
            kind: "text",
            placeholder: "Recibí la edición completa",
            hint: "Encabezado de la página donde se piden nombre y email.",
            showWhen: (v) => v.access === "breve_completo",
          },
          {
            name: "full_form_intro",
            label: "Texto introductorio del formulario",
            kind: "textarea",
            placeholder: "Dejame tu nombre y tu email y te envío la versión completa.",
            showWhen: (v) => v.access === "breve_completo",
          },
          {
            name: "full_form_button_label",
            label: "Texto del botón del formulario",
            kind: "text",
            placeholder: "Recibir la edición completa",
            showWhen: (v) => v.access === "breve_completo",
          },
          {
            name: "full_form_success_message",
            label: "Mensaje de confirmación",
            kind: "textarea",
            placeholder: "¡Listo! Tu edición completa está lista para descargar.",
            hint: "Se muestra después de enviar el formulario, junto al botón de descarga.",
            showWhen: (v) => v.access === "breve_completo",
          },
          {
            name: "featured",
            label: "Destacar en la portada (eBook principal)",
            kind: "toggle",
            defaultValue: false,
            hint: "El regalo destacado se muestra en grande en la página de inicio. Se recomienda destacar solo uno.",
          },
          {
            name: "featured_image",
            label: "Imagen para regalo destacado (opcional)",
            kind: "image",
            hint: "Solo se usa en el bloque destacado del Home (contenedor vertical). Si no la cargás, se usa la imagen de tarjeta de arriba.",
            spec: IMAGE_SPECS.ebookCover,
            showWhen: (v) => v.featured === true,
          },
          { name: "active", label: "Visible en el sitio", kind: "toggle" },
        ]}
      />
    </>
  );
}
