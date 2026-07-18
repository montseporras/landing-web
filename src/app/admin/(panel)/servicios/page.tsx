"use client";

import { EntityManager } from "@/components/admin/entity-manager";
import { AdminHeader } from "@/components/admin/ui";
import { IMAGE_SPECS } from "@/lib/media";

/** Íconos disponibles para las tarjetas de servicios (nombres de Lucide). */
const ICON_OPTIONS = [
  { value: "UserRound", label: "Persona" },
  { value: "Users", label: "Equipo / grupo" },
  { value: "Lightbulb", label: "Idea / claridad" },
  { value: "HeartHandshake", label: "Acompañamiento" },
  { value: "Sparkles", label: "Destello" },
  { value: "Brain", label: "Mente / neurociencia" },
  { value: "Compass", label: "Brújula / dirección" },
  { value: "Leaf", label: "Calma / hoja" },
  { value: "ShieldCheck", label: "Confianza / escudo" },
  { value: "MessageCircle", label: "Conversación" },
];

export default function AdminServiciosPage() {
  return (
    <>
      <AdminHeader
        title="Servicios"
        description="Creá, editá, ordená y activá o desactivá los servicios que se muestran en el sitio. Los servicios de fábrica también aparecen acá y podés modificarlos por completo."
      />
      <EntityManager
        table="services"
        itemName="servicio"
        titleField="title"
        fields={[
          { name: "title", label: "Título", kind: "text", required: true },
          {
            name: "description",
            label: "Descripción",
            kind: "textarea",
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
            placeholder: "Reservar llamada de claridad",
          },
          {
            name: "icon",
            label: "Ícono",
            kind: "select",
            options: ICON_OPTIONS,
            hint: "Se muestra arriba de cada tarjeta.",
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
