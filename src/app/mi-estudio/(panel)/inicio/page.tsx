"use client";

import { SectionHeaderEditor } from "@/components/admin/content-editors";
import { MediaUpload } from "@/components/admin/media-upload";
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
import { defaultHero, defaultHomeSections } from "@/lib/content/defaults";
import { IMAGE_SPECS } from "@/lib/media";

export default function AdminInicioPage() {
  const hero = useSiteContent("hero", defaultHero);
  const sections = useSiteContent("home_sections", defaultHomeSections);

  if (!hero.configured) {
    return (
      <>
        <AdminHeader title="Página de inicio" />
        <NotConfigured />
      </>
    );
  }

  if (hero.loading || sections.loading) {
    return (
      <>
        <AdminHeader title="Página de inicio" />
        <Skeleton className="h-96" />
      </>
    );
  }

  const { value, setValue } = hero;
  const isDirty = hero.isDirty || sections.isDirty;
  const saving = hero.saving || sections.saving;
  const saved = hero.saved && sections.saved;
  const error = hero.error ?? sections.error;
  const s = sections.value;

  async function saveAll() {
    await Promise.all([hero.save(), sections.save()]);
  }

  function cancelAll() {
    if (isDirty && !confirm("Tenés cambios sin guardar. ¿Descartarlos?")) {
      return;
    }
    hero.setValue(hero.lastSaved);
    sections.setValue(sections.lastSaved);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveAll();
      }}
    >
      <AdminHeader
        title="Página de inicio"
        description="Editá los textos, la fotografía y los encabezados de cada sección de la portada."
        actions={<SaveButton saving={saving} saved={saved} />}
      />

      <div className="space-y-6">
        <ErrorNotice message={error} />

        <AdminCard title="Textos principales (hero)">
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

        <SectionHeaderEditor
          title="Sección: Beneficios"
          value={s.benefits}
          onChange={(benefits) =>
            sections.setValue({ ...s, benefits })
          }
        />
        <SectionHeaderEditor
          title="Sección: Camino paso a paso"
          value={s.howItWorks}
          onChange={(howItWorks) =>
            sections.setValue({ ...s, howItWorks })
          }
        />
        <SectionHeaderEditor
          title="Sección: Servicios"
          hint="Los servicios en sí se gestionan en Panel → Servicios."
          value={s.services}
          onChange={(services) => sections.setValue({ ...s, services })}
        />
        <SectionHeaderEditor
          title="Sección: Regalos"
          hint="Los regalos en sí se gestionan en Panel → Regalos."
          value={s.giftsTeaser}
          onChange={(giftsTeaser) =>
            sections.setValue({ ...s, giftsTeaser })
          }
        />
        <SectionHeaderEditor
          title="Sección: Preguntas frecuentes"
          hint="Las preguntas en sí se gestionan en Panel → Preguntas frecuentes."
          value={s.faq}
          onChange={(faq) => sections.setValue({ ...s, faq })}
        />

        <AdminCard title="CTA final">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Etiqueta superior">
                <Input
                  value={s.finalCta.eyebrow}
                  onChange={(e) =>
                    sections.setValue({
                      ...s,
                      finalCta: { ...s.finalCta, eyebrow: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Título">
                <Input
                  value={s.finalCta.title}
                  onChange={(e) =>
                    sections.setValue({
                      ...s,
                      finalCta: { ...s.finalCta, title: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Parte destacada">
                <Input
                  value={s.finalCta.titleAccent}
                  onChange={(e) =>
                    sections.setValue({
                      ...s,
                      finalCta: {
                        ...s.finalCta,
                        titleAccent: e.target.value,
                      },
                    })
                  }
                />
              </Field>
            </div>
            <Field label="Descripción">
              <Textarea
                value={s.finalCta.description}
                onChange={(e) =>
                  sections.setValue({
                    ...s,
                    finalCta: { ...s.finalCta, description: e.target.value },
                  })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Botón principal — texto">
                <Input
                  value={s.finalCta.primaryCta.label}
                  onChange={(e) =>
                    sections.setValue({
                      ...s,
                      finalCta: {
                        ...s.finalCta,
                        primaryCta: {
                          ...s.finalCta.primaryCta,
                          label: e.target.value,
                        },
                      },
                    })
                  }
                />
              </Field>
              <Field label="Botón principal — enlace">
                <Input
                  value={s.finalCta.primaryCta.href}
                  onChange={(e) =>
                    sections.setValue({
                      ...s,
                      finalCta: {
                        ...s.finalCta,
                        primaryCta: {
                          ...s.finalCta.primaryCta,
                          href: e.target.value,
                        },
                      },
                    })
                  }
                />
              </Field>
              <Field label="Botón secundario — texto">
                <Input
                  value={s.finalCta.secondaryCta.label}
                  onChange={(e) =>
                    sections.setValue({
                      ...s,
                      finalCta: {
                        ...s.finalCta,
                        secondaryCta: {
                          ...s.finalCta.secondaryCta,
                          label: e.target.value,
                        },
                      },
                    })
                  }
                />
              </Field>
              <Field label="Botón secundario — enlace">
                <Input
                  value={s.finalCta.secondaryCta.href}
                  onChange={(e) =>
                    sections.setValue({
                      ...s,
                      finalCta: {
                        ...s.finalCta,
                        secondaryCta: {
                          ...s.finalCta.secondaryCta,
                          href: e.target.value,
                        },
                      },
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
                hero.restoreDefault("Página de inicio");
                sections.restoreDefault("Secciones de inicio");
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
