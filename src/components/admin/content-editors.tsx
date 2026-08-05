"use client";

import { AdminCard, Field } from "@/components/admin/ui";
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
