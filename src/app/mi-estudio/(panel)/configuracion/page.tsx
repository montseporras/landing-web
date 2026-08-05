"use client";

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
import {
  defaultFooterCta,
  defaultGeneral,
  defaultSocial,
} from "@/lib/content/defaults";

export default function AdminConfiguracionPage() {
  const general = useSiteContent("general", defaultGeneral);
  const social = useSiteContent("social", defaultSocial);
  const footer = useSiteContent("footer", defaultFooterCta);

  if (!general.configured) {
    return (
      <>
        <AdminHeader title="Configuración" />
        <NotConfigured />
      </>
    );
  }
  if (general.loading || social.loading || footer.loading) {
    return (
      <>
        <AdminHeader title="Configuración" />
        <Skeleton className="h-96" />
      </>
    );
  }

  async function saveAll() {
    await Promise.all([general.save(), social.save(), footer.save()]);
  }

  function cancelAll() {
    if (isDirty && !confirm("Tenés cambios sin guardar. ¿Descartarlos?")) {
      return;
    }
    general.setValue(general.lastSaved);
    social.setValue(social.lastSaved);
    footer.setValue(footer.lastSaved);
  }

  const isDirty = general.isDirty || social.isDirty || footer.isDirty;
  const saving = general.saving || social.saving || footer.saving;
  const saved = general.saved || social.saved || footer.saved;
  const error = general.error ?? social.error ?? footer.error;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveAll();
      }}
    >
      <AdminHeader
        title="Configuración general"
        description="Marca, redes sociales y footer del sitio."
        actions={<SaveButton saving={saving} saved={saved} />}
      />

      <div className="space-y-6">
        <ErrorNotice message={error} />

        <AdminCard title="Marca">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nombre de la marca" hint="Ej.: FS">
              <Input
                value={general.value.brandName}
                onChange={(e) =>
                  general.setValue({
                    ...general.value,
                    brandName: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Nombre de la coach">
              <Input
                value={general.value.coachName}
                onChange={(e) =>
                  general.setValue({
                    ...general.value,
                    coachName: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Tagline">
              <Input
                value={general.value.tagline}
                onChange={(e) =>
                  general.setValue({
                    ...general.value,
                    tagline: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Nombre legal (footer)">
              <Input
                value={general.value.legalName}
                onChange={(e) =>
                  general.setValue({
                    ...general.value,
                    legalName: e.target.value,
                  })
                }
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Texto del footer">
              <Textarea
                value={general.value.footerText}
                onChange={(e) =>
                  general.setValue({
                    ...general.value,
                    footerText: e.target.value,
                  })
                }
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="Redes sociales y contacto">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Instagram" hint="URL completa del perfil.">
              <Input
                value={social.value.instagram}
                onChange={(e) =>
                  social.setValue({
                    ...social.value,
                    instagram: e.target.value,
                  })
                }
                placeholder="https://instagram.com/…"
              />
            </Field>
            <Field label="WhatsApp" hint="Formato: https://wa.me/549XXXXXXXXXX">
              <Input
                value={social.value.whatsapp}
                onChange={(e) =>
                  social.setValue({ ...social.value, whatsapp: e.target.value })
                }
                placeholder="https://wa.me/…"
              />
            </Field>
            <Field label="Email de contacto">
              <Input
                type="email"
                value={social.value.email}
                onChange={(e) =>
                  social.setValue({ ...social.value, email: e.target.value })
                }
              />
            </Field>
            <Field label="LinkedIn (opcional)">
              <Input
                value={social.value.linkedin}
                onChange={(e) =>
                  social.setValue({ ...social.value, linkedin: e.target.value })
                }
              />
            </Field>
            <Field label="YouTube (opcional)">
              <Input
                value={social.value.youtube}
                onChange={(e) =>
                  social.setValue({ ...social.value, youtube: e.target.value })
                }
              />
            </Field>
            <Field label="TikTok (opcional)">
              <Input
                value={social.value.tiktok}
                onChange={(e) =>
                  social.setValue({ ...social.value, tiktok: e.target.value })
                }
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard
          title="CTA del footer"
          className="border-gold-200"
        >
          <p className="mb-4 text-sm text-muted">
            El bloque «¿Empezamos?» que aparece en la columna derecha del pie
            de página, en todas las páginas del sitio.
          </p>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Etiqueta superior">
                <Input
                  value={footer.value.eyebrow}
                  onChange={(e) =>
                    footer.setValue({ ...footer.value, eyebrow: e.target.value })
                  }
                />
              </Field>
              <Field label="Título">
                <Input
                  value={footer.value.title}
                  onChange={(e) =>
                    footer.setValue({ ...footer.value, title: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Texto">
              <Textarea
                value={footer.value.text}
                onChange={(e) =>
                  footer.setValue({ ...footer.value, text: e.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Botón — texto">
                <Input
                  value={footer.value.buttonLabel}
                  onChange={(e) =>
                    footer.setValue({
                      ...footer.value,
                      buttonLabel: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Botón — enlace">
                <Input
                  value={footer.value.buttonHref}
                  onChange={(e) =>
                    footer.setValue({
                      ...footer.value,
                      buttonHref: e.target.value,
                    })
                  }
                />
              </Field>
            </div>
          </div>
        </AdminCard>

        <div className="flex flex-col items-end gap-3">
          <ErrorNotice message={error} />
          <UnsavedNotice show={isDirty} />
          <div className="flex gap-3">
            <RestoreDefaultButton
              onClick={() => {
                general.restoreDefault("Marca y footer");
                social.restoreDefault("Redes sociales");
                footer.restoreDefault("CTA del footer");
              }}
            />
            <CancelButton onClick={cancelAll} />
            <SaveButton saving={saving} saved={saved} />
          </div>
        </div>
      </div>
    </form>
  );
}
