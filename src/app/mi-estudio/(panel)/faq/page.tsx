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
import { defaultFaqPage } from "@/lib/content/defaults";

export default function AdminFaqPage() {
  const page = useSiteContent("faq_page", defaultFaqPage);

  return (
    <>
      <AdminHeader
        title="Preguntas frecuentes"
        description="Encabezado de la página y las preguntas del acordeón que se muestran en el sitio."
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
              onClick={() => page.restoreDefault("Encabezado de FAQ")}
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
        table="faqs"
        itemName="pregunta"
        titleField="question"
        fields={[
          { name: "question", label: "Pregunta", kind: "text", required: true },
          {
            name: "answer",
            label: "Respuesta",
            kind: "richtext",
            alignField: "answer_align",
            required: true,
          },
          { name: "active", label: "Visible en el sitio", kind: "toggle" },
        ]}
      />
    </>
  );
}
