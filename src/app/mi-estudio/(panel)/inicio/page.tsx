"use client";

import {
  OrderedListEditor,
  SectionHeaderEditor,
} from "@/components/admin/content-editors";
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
import {
  defaultBenefits,
  defaultHero,
  defaultHomeSections,
  defaultHowItWorks,
} from "@/lib/content/defaults";
import { IMAGE_SPECS } from "@/lib/media";
import type { BenefitItem, StepItem } from "@/lib/types";

/** Íconos disponibles para las tarjetas de beneficios (nombres de Lucide). */
const BENEFIT_ICON_OPTIONS = [
  { value: "HeartHandshake", label: "Acompañamiento" },
  { value: "Brain", label: "Mente / neurociencia" },
  { value: "Sparkles", label: "Destello" },
  { value: "Compass", label: "Brújula / dirección" },
  { value: "ShieldCheck", label: "Confianza / escudo" },
  { value: "Leaf", label: "Calma / hoja" },
  { value: "Lightbulb", label: "Idea / claridad" },
  { value: "Users", label: "Equipo / grupo" },
  { value: "MessageCircle", label: "Conversación" },
];

function createBenefit(): BenefitItem {
  return {
    id: crypto.randomUUID(),
    icon: "Sparkles",
    title: "",
    description: "",
    active: true,
  };
}

function createStep(): StepItem {
  return { id: crypto.randomUUID(), title: "", description: "", active: true };
}

export default function AdminInicioPage() {
  const hero = useSiteContent("hero", defaultHero);
  const sections = useSiteContent("home_sections", defaultHomeSections);
  const benefits = useSiteContent("benefits", defaultBenefits);
  const steps = useSiteContent("how_it_works", defaultHowItWorks);

  if (!hero.configured) {
    return (
      <>
        <AdminHeader title="Página de inicio" />
        <NotConfigured />
      </>
    );
  }

  if (hero.loading || sections.loading || benefits.loading || steps.loading) {
    return (
      <>
        <AdminHeader title="Página de inicio" />
        <Skeleton className="h-96" />
      </>
    );
  }

  const { value, setValue } = hero;
  const isDirty =
    hero.isDirty || sections.isDirty || benefits.isDirty || steps.isDirty;
  const saving = hero.saving || sections.saving || benefits.saving || steps.saving;
  const saved = hero.saved && sections.saved && benefits.saved && steps.saved;
  const error = hero.error ?? sections.error ?? benefits.error ?? steps.error;
  const s = sections.value;

  async function saveAll() {
    await Promise.all([hero.save(), sections.save(), benefits.save(), steps.save()]);
  }

  function cancelAll() {
    if (isDirty && !confirm("Tenés cambios sin guardar. ¿Descartarlos?")) {
      return;
    }
    hero.setValue(hero.lastSaved);
    sections.setValue(sections.lastSaved);
    benefits.setValue(benefits.lastSaved);
    steps.setValue(steps.lastSaved);
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
          onChange={(benefitsHeader) =>
            sections.setValue({ ...s, benefits: benefitsHeader })
          }
        />
        <OrderedListEditor
          title="Tarjetas de beneficios"
          hint="Cada tarjeta muestra un ícono, un título y una descripción breve."
          itemName="beneficio"
          items={benefits.value}
          onChange={benefits.setValue}
          createItem={createBenefit}
          renderExtraFields={(item, update) => (
            <Field label="Ícono">
              <select
                value={item.icon}
                onChange={(e) => update({ icon: e.target.value })}
                className="mb-3 w-full rounded-2xl border border-sand-200 bg-white px-4 py-3 text-sm text-ink focus:border-lavender-400 focus:outline-none"
              >
                {BENEFIT_ICON_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          )}
        />
        <SectionHeaderEditor
          title="Sección: Camino paso a paso"
          value={s.howItWorks}
          onChange={(howItWorksHeader) =>
            sections.setValue({ ...s, howItWorks: howItWorksHeader })
          }
        />
        <OrderedListEditor
          title="Pasos del proceso"
          hint="El número de cada paso (01, 02…) se genera solo, según el orden y los pasos activos — no hace falta escribirlo."
          itemName="paso"
          items={steps.value}
          onChange={steps.setValue}
          createItem={createStep}
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
                benefits.restoreDefault("Tarjetas de beneficios");
                steps.restoreDefault("Pasos del proceso");
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
