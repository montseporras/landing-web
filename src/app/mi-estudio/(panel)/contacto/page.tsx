"use client";

import { PageHeaderEditor } from "@/components/admin/content-editors";
import {
  AdminCard,
  AdminHeader,
  CancelButton,
  ErrorNotice,
  Field,
  NotConfigured,
  RestoreDefaultButton,
  SaveButton,
  UnsavedNotice,
} from "@/components/admin/ui";
import { useSiteContent } from "@/components/admin/use-site-content";
import { Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultContactPage } from "@/lib/content/defaults";

export default function AdminContactoPage() {
  const page = useSiteContent("contact_page", defaultContactPage);

  if (!page.configured) {
    return (
      <>
        <AdminHeader title="Contacto" />
        <NotConfigured />
      </>
    );
  }
  if (page.loading) {
    return (
      <>
        <AdminHeader title="Contacto" />
        <Skeleton className="h-96" />
      </>
    );
  }

  const { value, setValue } = page;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        page.save();
      }}
    >
      <AdminHeader
        title="Contacto"
        description="Encabezado, textos explicativos y nota de confidencialidad de la página de contacto."
        actions={<SaveButton saving={page.saving} saved={page.saved} />}
      />

      <div className="space-y-6">
        <ErrorNotice message={page.error} />

        <PageHeaderEditor
          value={value.header}
          onChange={(header) => setValue({ ...value, header })}
        />

        <AdminCard
          title="Textos de los canales de contacto"
          className="border-gold-200"
        >
          <p className="mb-4 text-sm text-muted">
            El enlace de cada canal (WhatsApp, email, Instagram) se
            configura en Panel → Ajustes → Redes sociales; acá solo se edita
            la frase breve que acompaña a cada uno.
          </p>
          <div className="space-y-4">
            <Field label="WhatsApp">
              <Input
                value={value.channelBlurbs.whatsapp}
                onChange={(e) =>
                  setValue({
                    ...value,
                    channelBlurbs: {
                      ...value.channelBlurbs,
                      whatsapp: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Email">
              <Input
                value={value.channelBlurbs.email}
                onChange={(e) =>
                  setValue({
                    ...value,
                    channelBlurbs: {
                      ...value.channelBlurbs,
                      email: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Instagram">
              <Input
                value={value.channelBlurbs.instagram}
                onChange={(e) =>
                  setValue({
                    ...value,
                    channelBlurbs: {
                      ...value.channelBlurbs,
                      instagram: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="Nota de confidencialidad">
          <div className="space-y-4">
            <Field label="Título">
              <Input
                value={value.note.title}
                onChange={(e) =>
                  setValue({
                    ...value,
                    note: { ...value.note, title: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Texto">
              <Textarea
                value={value.note.text}
                onChange={(e) =>
                  setValue({
                    ...value,
                    note: { ...value.note, text: e.target.value },
                  })
                }
              />
            </Field>
          </div>
        </AdminCard>

        <div className="flex flex-col items-end gap-3">
          <ErrorNotice message={page.error} />
          <UnsavedNotice show={page.isDirty} />
          <div className="flex gap-3">
            <RestoreDefaultButton
              onClick={() => page.restoreDefault("Contacto")}
            />
            <CancelButton onClick={page.cancel} />
            <SaveButton saving={page.saving} saved={page.saved} />
          </div>
        </div>
      </div>
    </form>
  );
}
