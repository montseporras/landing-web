"use client";

import { EntityManager } from "@/components/admin/entity-manager";
import { AdminHeader } from "@/components/admin/ui";

export default function AdminFaqPage() {
  return (
    <>
      <AdminHeader
        title="Preguntas frecuentes"
        description="Creá, editá, ordená y eliminá las preguntas del acordeón. Las preguntas que vienen de fábrica también aparecen acá y podés modificarlas, ocultarlas o eliminarlas."
      />
      <EntityManager
        table="faqs"
        itemName="pregunta"
        titleField="question"
        fields={[
          { name: "question", label: "Pregunta", kind: "text", required: true },
          {
            name: "answer",
            label: "Respuesta",
            kind: "textarea",
            required: true,
          },
          { name: "active", label: "Visible en el sitio", kind: "toggle" },
        ]}
      />
    </>
  );
}
