"use client";

import {
  AdminCard,
  AdminHeader,
  ErrorNotice,
  Field,
  NotConfigured,
  SaveButton,
} from "@/components/admin/ui";
import { useSiteContent } from "@/components/admin/use-site-content";
import { Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultGeneral, defaultSocial } from "@/lib/content/defaults";

export default function AdminConfiguracionPage() {
  const general = useSiteContent("general", defaultGeneral);
  const social = useSiteContent("social", defaultSocial);

  if (!general.configured) {
    return (
      <>
        <AdminHeader title="Configuración" />
        <NotConfigured />
      </>
    );
  }
  if (general.loading || social.loading) {
    return (
      <>
        <AdminHeader title="Configuración" />
        <Skeleton className="h-96" />
      </>
    );
  }

  async function saveAll() {
    await Promise.all([general.save(), social.save()]);
  }

  const saving = general.saving || social.saving;
  const saved = general.saved || social.saved;
  const error = general.error ?? social.error;

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

        <div className="flex flex-col items-end gap-3">
          <ErrorNotice message={error} />
          <SaveButton saving={saving} saved={saved} />
        </div>
      </div>
    </form>
  );
}
