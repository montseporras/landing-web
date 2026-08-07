"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { AdminCard, Field, Toggle } from "@/components/admin/ui";
import { Input, Textarea } from "@/components/ui/input";
import type { PageHeaderContent, SectionHeader } from "@/lib/types";

/**
 * Editores reutilizables para los encabezados de sección/página que hoy
 * viven en `site_content` (home_sections, services_page, gifts_page,
 * faq_page, contact_page…). Evitan repetir el mismo formulario de
 * eyebrow/título/acento/bajada en cada página del panel.
 */

export function SectionHeaderEditor({
  title,
  hint,
  value,
  onChange,
}: {
  title: string;
  hint?: string;
  value: SectionHeader;
  onChange: (v: SectionHeader) => void;
}) {
  return (
    <AdminCard title={title}>
      <div className="space-y-4">
        {hint && <p className="text-sm text-muted">{hint}</p>}
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Etiqueta superior (eyebrow)">
            <Input
              value={value.eyebrow}
              onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Título">
            <Input
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
            />
          </Field>
          <Field label="Parte destacada" hint="Aparece en cursiva dorada.">
            <Input
              value={value.titleAccent}
              onChange={(e) =>
                onChange({ ...value, titleAccent: e.target.value })
              }
            />
          </Field>
        </div>
        <Field label="Bajada">
          <Textarea
            value={value.subtitle}
            onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
          />
        </Field>
      </div>
    </AdminCard>
  );
}

export function PageHeaderEditor({
  title = "Encabezado de la página",
  value,
  onChange,
}: {
  title?: string;
  value: PageHeaderContent;
  onChange: (v: PageHeaderContent) => void;
}) {
  return (
    <AdminCard title={title}>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Etiqueta superior (eyebrow)">
            <Input
              value={value.eyebrow}
              onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Título">
            <Input
              value={value.title}
              onChange={(e) => onChange({ ...value, title: e.target.value })}
            />
          </Field>
          <Field label="Parte destacada" hint="Aparece en cursiva dorada.">
            <Input
              value={value.titleAccent}
              onChange={(e) =>
                onChange({ ...value, titleAccent: e.target.value })
              }
            />
          </Field>
        </div>
        <Field label="Bajada / descripción">
          <Textarea
            value={value.description}
            onChange={(e) =>
              onChange({ ...value, description: e.target.value })
            }
          />
        </Field>
      </div>
    </AdminCard>
  );
}

interface OrderedItem {
  id: string;
  title: string;
  description: string;
  active: boolean;
}

/**
 * Editor de una lista ordenada de tarjetas simples (beneficios, pasos…)
 * guardada como array en `site_content` — no una tabla de Supabase. Permite
 * reordenar (▲▼), activar/desactivar, crear, eliminar y editar título y
 * descripción; `renderExtraFields` agrega campos propios de cada tipo de
 * tarjeta (ej.: el ícono de un beneficio).
 */
export function OrderedListEditor<T extends OrderedItem>({
  title,
  hint,
  itemName,
  items,
  onChange,
  createItem,
  renderExtraFields,
}: {
  title: string;
  hint?: string;
  itemName: string;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderExtraFields?: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  }

  function update(index: number, patch: Partial<T>) {
    const next = [...items];
    next[index] = { ...next[index]!, ...patch };
    onChange(next);
  }

  function remove(index: number) {
    if (!confirm(`¿Eliminar este ${itemName}? Esta acción no se puede deshacer.`)) {
      return;
    }
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <AdminCard title={title}>
      <div className="space-y-4">
        {hint && <p className="text-sm text-muted">{hint}</p>}
        {items.length === 0 && (
          <p className="text-sm text-muted">
            Todavía no hay {itemName}s. Agregá el primero.
          </p>
        )}
        {items.map((item, i) => (
          <div key={item.id} className="rounded-2xl border border-sand-200 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  aria-label="Subir"
                  disabled={i === 0}
                  className="text-muted hover:text-ink disabled:opacity-30"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  aria-label="Bajar"
                  disabled={i === items.length - 1}
                  className="text-muted hover:text-ink disabled:opacity-30"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Toggle
                  checked={item.active}
                  onChange={(active) => update(i, { active } as Partial<T>)}
                  label="Visible en el sitio"
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Eliminar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-300 text-muted hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {renderExtraFields?.(item, (patch) => update(i, patch))}
            <div className="grid gap-3">
              <Field label="Título">
                <Input
                  value={item.title}
                  onChange={(e) => update(i, { title: e.target.value } as Partial<T>)}
                />
              </Field>
              <Field label="Descripción">
                <Textarea
                  value={item.description}
                  onChange={(e) =>
                    update(i, { description: e.target.value } as Partial<T>)
                  }
                />
              </Field>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, createItem()])}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-sand-300 px-5 text-sm text-ink hover:border-gold-400"
        >
          <Plus size={16} aria-hidden /> Agregar {itemName}
        </button>
      </div>
    </AdminCard>
  );
}
