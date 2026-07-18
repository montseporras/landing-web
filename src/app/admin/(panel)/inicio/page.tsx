"use client";

import { MediaUpload } from "@/components/admin/media-upload";
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
import { defaultHero } from "@/lib/content/defaults";
import { IMAGE_SPECS } from "@/lib/media";

export default function AdminInicioPage() {
  const { value, setValue, save, loading, saving, saved, error, configured } =
    useSiteContent("hero", defaultHero);

  if (!configured) {
    return (
      <>
        <AdminHeader title="Página de inicio" />
        <NotConfigured />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="Página de inicio" />
        <Skeleton className="h-96" />
      </>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <AdminHeader
        title="Página de inicio"
        description="Editá los textos, la fotografía y los botones de la portada."
        actions={<SaveButton saving={saving} saved={saved} />}
      />

      <div className="space-y-6">
        <ErrorNotice message={error} />

        <AdminCard title="Textos principales">
          <div className="space-y-4">
            <Field label="Etiqueta superior (eyebrow)">
              <Input
                value={value.eyebrow}
                onChange={(e) =>
                  setValue({ ...value, eyebrow: e.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Título principal">
                <Input
                  value={value.title}
                  onChange={(e) =>
                    setValue({ ...value, title: e.target.value })
                  }
                />
              </Field>
              <Field
                label="Parte destacada del título"
                hint="Aparece en cursiva dorada."
              >
                <Input
                  value={value.titleAccent}
                  onChange={(e) =>
                    setValue({ ...value, titleAccent: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Subtítulo">
              <Textarea
                value={value.subtitle}
                onChange={(e) =>
                  setValue({ ...value, subtitle: e.target.value })
                }
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="Botones (CTAs)">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Botón principal — texto">
              <Input
                value={value.primaryCta.label}
                onChange={(e) =>
                  setValue({
                    ...value,
                    primaryCta: { ...value.primaryCta, label: e.target.value },
                  })
                }
              />
            </Field>
            <Field
              label="Botón principal — enlace"
              hint="Ej.: /regalos o /contacto"
            >
              <Input
                value={value.primaryCta.href}
                onChange={(e) =>
                  setValue({
                    ...value,
                    primaryCta: { ...value.primaryCta, href: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Botón secundario — texto">
              <Input
                value={value.secondaryCta.label}
                onChange={(e) =>
                  setValue({
                    ...value,
                    secondaryCta: {
                      ...value.secondaryCta,
                      label: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Botón secundario — enlace">
              <Input
                value={value.secondaryCta.href}
                onChange={(e) =>
                  setValue({
                    ...value,
                    secondaryCta: {
                      ...value.secondaryCta,
                      href: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="Fotografía principal">
          <MediaUpload
            value={value.image}
            onChange={(url) => setValue({ ...value, image: url })}
            folder="hero"
            spec={IMAGE_SPECS.hero}
          />
        </AdminCard>

        <AdminCard title="Insignias de confianza">
          <div className="space-y-3">
            {value.badges.map((badge, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={badge}
                  onChange={(e) => {
                    const badges = [...value.badges];
                    badges[i] = e.target.value;
                    setValue({ ...value, badges });
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setValue({
                      ...value,
                      badges: value.badges.filter((_, j) => j !== i),
                    })
                  }
                  className="rounded-full px-3 text-sm text-red-500 hover:bg-red-50"
                >
                  Quitar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setValue({ ...value, badges: [...value.badges, ""] })
              }
              className="rounded-full border border-sand-300 px-4 py-2 text-sm text-ink hover:border-gold-400"
            >
              + Agregar insignia
            </button>
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
