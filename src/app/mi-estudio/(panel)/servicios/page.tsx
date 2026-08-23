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
import { ICON_COLOR_OPTIONS, ICON_NAMES } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultServicesPage } from "@/lib/content/defaults";
import { IMAGE_SPECS } from "@/lib/media";

/** Íconos disponibles para las tarjetas de servicios (todos los de la
 * librería ya usada en el proyecto — lucide-react, vía src/components/ui/icon.tsx). */
const ICON_OPTIONS = ICON_NAMES.map((name) => ({ value: name, label: name }));

export default function AdminServiciosPage() {
  const page = useSiteContent("services_page", defaultServicesPage);

  return (
    <>
      <AdminHeader
        title="Servicios"
        description="Encabezado de la página y el listado de servicios que se muestran en el sitio."
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
              onClick={() => page.restoreDefault("Encabezado de Servicios")}
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
        table="services"
        itemName="servicio"
        titleField="title"
        fields={[
          { name: "title", label: "Título", kind: "text", required: true },
          {
            name: "description",
            label: "Descripción",
            kind: "richtext",
            alignField: "description_align",
            required: true,
          },
          {
            name: "features",
            label: "Qué incluye",
            kind: "lines",
            hint: "Una característica por línea. Aparecen como lista con tilde.",
            placeholder:
              "12 sesiones online de 60 minutos\nPlan 100% personalizado\nAcompañamiento por WhatsApp",
          },
          {
            name: "price_label",
            label: "Precio (opcional)",
            kind: "text",
            placeholder: "Ej.: Desde $30.000 · Consultá",
            hint: "Dejalo vacío si no querés mostrar precio.",
          },
          {
            name: "cta_label",
            label: "Texto del botón",
            kind: "text",
            placeholder: "Solicitar conversación inicial de claridad",
          },
          {
            name: "icon",
            label: "Ícono",
            kind: "icon",
            options: ICON_OPTIONS,
            hint: "Se muestra arriba de cada tarjeta (salvo que cargues una imagen).",
          },
          {
            name: "icon_color",
            label: "Color del ícono",
            kind: "iconColor",
            options: [...ICON_COLOR_OPTIONS],
            hint: "Paleta fija del sitio — no admite colores libres.",
          },
          {
            name: "image",
            label: "Imagen (opcional)",
            kind: "image",
            hint: "Si la cargás, reemplaza al ícono en la tarjeta.",
            spec: IMAGE_SPECS.giftCover,
          },
          {
            name: "highlighted",
            label: "Destacar (borde dorado + «Más elegido»)",
            kind: "toggle",
            defaultValue: false,
          },
          { name: "active", label: "Visible en el sitio", kind: "toggle" },
        ]}
      />
    </>
  );
}
