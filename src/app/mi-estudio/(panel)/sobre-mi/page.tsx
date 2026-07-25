"use client";

import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Image from "next/image";
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
import { defaultAbout } from "@/lib/content/defaults";
import { IMAGE_SPECS } from "@/lib/media";

export default function AdminSobreMiPage() {
  const { value, setValue, save, loading, saving, saved, error, configured } =
    useSiteContent("about", defaultAbout);

  if (!configured) {
    return (
      <>
        <AdminHeader title="Sobre mí" />
        <NotConfigured />
      </>
    );
  }
  if (loading) {
    return (
      <>
        <AdminHeader title="Sobre mí" />
        <Skeleton className="h-96" />
      </>
    );
  }

  const gallery = value.gallery ?? [];

  function moveGalleryImage(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= gallery.length) return;
    const next = [...gallery];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setValue({ ...value, gallery: next });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <AdminHeader
        title="Sobre mí"
        description="Tu historia, tus fotos, tus valores y tus estadísticas."
        actions={<SaveButton saving={saving} saved={saved} />}
      />

      <div className="space-y-6">
        <ErrorNotice message={error} />

        <AdminCard title="Textos">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Etiqueta superior">
                <Input
                  value={value.eyebrow}
                  onChange={(e) =>
                    setValue({ ...value, eyebrow: e.target.value })
                  }
                />
              </Field>
              <Field label="Título">
                <Input
                  value={value.title}
                  onChange={(e) =>
                    setValue({ ...value, title: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field
              label="Biografía corta"
              hint="Se muestra en el inicio y arriba de la página Sobre mí."
            >
              <Textarea
                value={value.bio}
                onChange={(e) => setValue({ ...value, bio: e.target.value })}
              />
            </Field>
            <Field label="Mi historia" hint="Podés separar párrafos con Enter.">
              <Textarea
                className="min-h-40"
                value={value.story}
                onChange={(e) => setValue({ ...value, story: e.target.value })}
              />
            </Field>
            <Field label="Misión">
              <Textarea
                value={value.mission}
                onChange={(e) =>
                  setValue({ ...value, mission: e.target.value })
                }
              />
            </Field>
            <Field
              label="Video de presentación (opcional)"
              hint="URL de YouTube en formato embed. Ej.: https://www.youtube.com/embed/XXXX"
            >
              <Input
                value={value.videoUrl ?? ""}
                onChange={(e) =>
                  setValue({ ...value, videoUrl: e.target.value || null })
                }
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="Fotografía principal">
          <MediaUpload
            value={value.photo}
            onChange={(url) => setValue({ ...value, photo: url })}
            folder="about"
            spec={IMAGE_SPECS.aboutPhoto}
          />
        </AdminCard>

        <AdminCard title="Galería de imágenes">
          <p className="mb-4 text-sm text-muted">
            Estas fotos aparecen en la sección «Detrás de escena» de la página
            Sobre mí. Podés subir varias a la vez, reordenarlas con las flechas
            y quitar las que quieras.
          </p>
          {gallery.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((src, i) => (
                <div
                  key={src + i}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-sand-200 bg-sand-50"
                >
                  <Image
                    src={src}
                    alt={`Imagen ${i + 1} de la galería`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-2 bottom-2 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        aria-label={`Mover imagen ${i + 1} hacia atrás`}
                        onClick={() => moveGalleryImage(i, -1)}
                        disabled={i === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft disabled:opacity-40"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Mover imagen ${i + 1} hacia adelante`}
                        onClick={() => moveGalleryImage(i, 1)}
                        disabled={i === gallery.length - 1}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft disabled:opacity-40"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      aria-label={`Quitar imagen ${i + 1}`}
                      onClick={() =>
                        setValue({
                          ...value,
                          gallery: gallery.filter((_, j) => j !== i),
                        })
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-soft"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[0.65rem] font-medium text-muted">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
          <MediaUpload
            value={null}
            multiple
            onAddMany={(urls) =>
              setValue({ ...value, gallery: [...gallery, ...urls] })
            }
            label="Agregar imágenes a la galería"
            folder="gallery"
            spec={IMAGE_SPECS.gallery}
          />
          <p className="mt-2 text-xs text-muted">
            Acordate de tocar «Guardar cambios» después de modificar la galería.
          </p>
        </AdminCard>

        <AdminCard title="Estadísticas">
          <p className="mb-4 text-sm text-muted">
            Estos números aparecen animados en el inicio y en Sobre mí. El
            «sufijo» es lo que va después del número (+, %, etc.).
          </p>
          <div className="space-y-4">
            {value.stats.map((s, i) => (
              <div
                key={i}
                className="grid gap-3 rounded-2xl border border-sand-200 p-4 md:grid-cols-[130px_90px_1fr_auto] md:items-center md:border-0 md:p-0"
              >
                <Input
                  type="number"
                  aria-label={`Número de la estadística ${i + 1}`}
                  value={s.value}
                  onChange={(e) => {
                    const stats = [...value.stats];
                    stats[i] = { ...s, value: Number(e.target.value) };
                    setValue({ ...value, stats });
                  }}
                />
                <Input
                  placeholder="Sufijo"
                  aria-label={`Sufijo de la estadística ${i + 1}`}
                  value={s.suffix}
                  onChange={(e) => {
                    const stats = [...value.stats];
                    stats[i] = { ...s, suffix: e.target.value };
                    setValue({ ...value, stats });
                  }}
                />
                <Input
                  placeholder="Etiqueta (ej.: Personas acompañadas)"
                  aria-label={`Etiqueta de la estadística ${i + 1}`}
                  value={s.label}
                  onChange={(e) => {
                    const stats = [...value.stats];
                    stats[i] = { ...s, label: e.target.value };
                    setValue({ ...value, stats });
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setValue({
                      ...value,
                      stats: value.stats.filter((_, j) => j !== i),
                    })
                  }
                  className="justify-self-start rounded-full px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 md:justify-self-auto"
                >
                  Quitar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setValue({
                  ...value,
                  stats: [...value.stats, { value: 0, suffix: "", label: "" }],
                })
              }
              className="rounded-full border border-sand-300 px-4 py-2 text-sm hover:border-gold-400"
            >
              + Agregar estadística
            </button>
          </div>
        </AdminCard>

        <AdminCard title="Valores">
          <div className="space-y-4">
            {value.values.map((v, i) => (
              <div key={i} className="rounded-2xl border border-sand-200 p-4">
                <div className="grid gap-3">
                  <Input
                    placeholder="Título del valor"
                    aria-label={`Título del valor ${i + 1}`}
                    value={v.title}
                    onChange={(e) => {
                      const values = [...value.values];
                      values[i] = { ...v, title: e.target.value };
                      setValue({ ...value, values });
                    }}
                  />
                  <Textarea
                    placeholder="Descripción"
                    aria-label={`Descripción del valor ${i + 1}`}
                    className="min-h-20"
                    value={v.description}
                    onChange={(e) => {
                      const values = [...value.values];
                      values[i] = { ...v, description: e.target.value };
                      setValue({ ...value, values });
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setValue({
                      ...value,
                      values: value.values.filter((_, j) => j !== i),
                    })
                  }
                  className="mt-3 text-sm text-red-500 hover:underline"
                >
                  Eliminar valor
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setValue({
                  ...value,
                  values: [...value.values, { title: "", description: "" }],
                })
              }
              className="rounded-full border border-sand-300 px-4 py-2 text-sm hover:border-gold-400"
            >
              + Agregar valor
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
