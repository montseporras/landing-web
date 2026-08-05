"use client";

import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MediaUpload } from "@/components/admin/media-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor-lazy";
import {
  AdminCard,
  ErrorNotice,
  Field,
  NotConfigured,
  SaveButton,
  Toggle,
} from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  adminDelete,
  adminInsert,
  adminList,
  adminUpdate,
} from "@/lib/admin/actions";
import type { Align } from "@/lib/sanitize-html";
import { LIMITS } from "@/lib/validation";

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "toggle"
  | "image"
  | "file"
  | "lines" // textarea que se guarda como lista (una línea por ítem)
  | "richtext"; // editor enriquecido (negrita, cursiva, listas, enlaces, alineación)

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  options?: { value: string; label: string }[];
  hint?: string;
  placeholder?: string;
  defaultValue?: unknown;
  /** Formato recomendado para campos image/file (medidas, peso, formatos). */
  spec?: string;
  required?: boolean;
  /** Solo para kind:"richtext" — nombre de la columna hermana de alineación. */
  alignField?: string;
}

interface Row {
  id: string;
  [key: string]: unknown;
}

/**
 * CRUD genérico para tablas de Supabase (Regalos, FAQ, …), sobre las server
 * actions protegidas del panel.
 * - Lista ordenada por sort_order con reordenamiento ▲▼.
 * - Alta, edición, borrado y activar/desactivar, con estados de carga,
 *   error amigable y reversión si el servidor rechaza el cambio.
 * - La primera vez, el servidor siembra el contenido de fábrica para que
 *   también pueda editarse/ocultarse/eliminarse desde acá.
 */
export function EntityManager({
  table,
  titleField,
  fields,
  itemName,
  hasActive = true,
  hasOrder = true,
}: {
  table: string;
  titleField: string;
  fields: FieldDef[];
  itemName: string;
  hasActive?: boolean;
  hasOrder?: boolean;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Snapshot del formulario al abrirlo: permite detectar cambios sin
  // guardar y avisar antes de cancelar o cerrar la pestaña.
  const [dirtySnapshot, setDirtySnapshot] = useState<string | null>(null);
  const isDirty = editing !== null && JSON.stringify(editing) !== dirtySnapshot;

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  function closeEditor() {
    if (isDirty && !confirm("Tenés cambios sin guardar. ¿Descartarlos?")) {
      return;
    }
    setEditing(null);
    setError(null);
    setDirtySnapshot(null);
  }

  const load = useCallback(() => {
    setListError(null);
    setRows(null);
    adminList(
      table,
      hasOrder
        ? { order: { column: "sort_order", ascending: true } }
        : undefined,
    ).then(({ data, error: err }) => {
      if (err === "not_configured") {
        setConfigured(false);
      } else if (err && err !== "no_session") {
        setListError(err);
      }
      setRows((data as Row[]) ?? []);
    });
  }, [table, hasOrder]);

  useEffect(load, [load]);

  if (!configured) return <NotConfigured />;

  if (listError) {
    return (
      <AdminCard>
        <ErrorNotice message={listError} />
        <button
          type="button"
          onClick={load}
          className="mt-4 rounded-full border border-sand-300 px-5 py-2 text-sm text-ink hover:border-lavender-400"
        >
          Reintentar
        </button>
      </AdminCard>
    );
  }

  function startNew() {
    const blank: Row = { id: "" };
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        blank[f.name] = f.defaultValue;
      } else {
        blank[f.name] =
          f.kind === "toggle"
            ? true
            : f.kind === "number"
              ? 0
              : f.kind === "lines"
                ? []
                : f.kind === "image" || f.kind === "file"
                  ? null
                  : f.kind === "select"
                    ? (f.options?.[0]?.value ?? "")
                    : "";
      }
      if (f.kind === "richtext" && f.alignField) {
        blank[f.alignField] = "left";
      }
    });
    if (hasActive) blank.active = true;
    if (hasOrder) blank.sort_order = (rows?.length ?? 0) + 1;
    setEditing(blank);
    setIsNew(true);
    setError(null);
    setDirtySnapshot(JSON.stringify(blank));
  }

  async function saveEditing() {
    if (!editing) return;

    // Validación en el navegador antes de tocar el servidor.
    for (const f of fields) {
      if (f.required && !String(editing[f.name] ?? "").trim()) {
        setError(`Completá el campo «${f.label}» antes de guardar.`);
        return;
      }
    }

    setSaving(true);
    setError(null);
    const { id, ...payload } = editing;

    const result = isNew
      ? await adminInsert(table, payload)
      : await adminUpdate(table, id, payload);

    setSaving(false);
    if (result.error || !result.data) {
      setError(result.error ?? "No se pudo guardar. Intentalo nuevamente.");
      return;
    }
    const saved = result.data as Row;
    setRows((prev) =>
      isNew
        ? [...(prev ?? []), saved]
        : (prev ?? []).map((r) => (r.id === saved.id ? saved : r)),
    );
    setEditing(null);
    setDirtySnapshot(null);
  }

  async function remove(id: string) {
    if (
      !confirm(`¿Eliminar este ${itemName}? Esta acción no se puede deshacer.`)
    )
      return;
    const previous = rows;
    setError(null);
    setRows((prev) => prev?.filter((r) => r.id !== id) ?? null);
    const { error: err } = await adminDelete(table, id);
    if (err && err !== "no_session") {
      setRows(previous); // revertir: el servidor no pudo eliminar
      setError(err);
    }
  }

  async function toggleActive(row: Row, active: boolean) {
    const previous = rows;
    setError(null);
    setRows((prev) =>
      (prev ?? []).map((r) => (r.id === row.id ? { ...r, active } : r)),
    );
    const { error: err } = await adminUpdate(table, row.id, { active });
    if (err) {
      setRows(previous);
      setError(err);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    if (!rows) return;
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const previous = rows;
    const next = [...rows];
    [next[index], next[target]] = [next[target]!, next[index]!];
    const renumbered = next.map((r, i) => ({ ...r, sort_order: i + 1 }));
    setError(null);
    setRows(renumbered);
    const results = await Promise.all(
      renumbered.map((r) =>
        adminUpdate(table, r.id, { sort_order: r.sort_order }),
      ),
    );
    if (results.some((r) => r.error)) {
      setRows(previous);
      setError("No se pudo cambiar el orden. Intentalo nuevamente.");
    }
  }

  function renderField(f: FieldDef) {
    if (!editing) return null;
    const v = editing[f.name];
    const set = (val: unknown) => setEditing({ ...editing, [f.name]: val });

    switch (f.kind) {
      case "text":
        return (
          <Input
            value={(v as string) ?? ""}
            placeholder={f.placeholder}
            onChange={(e) => set(e.target.value)}
          />
        );
      case "textarea":
        return (
          <Textarea
            value={(v as string) ?? ""}
            placeholder={f.placeholder}
            onChange={(e) => set(e.target.value)}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={(v as number) ?? 0}
            onChange={(e) => set(Number(e.target.value))}
          />
        );
      case "select":
        return (
          <select
            value={(v as string) ?? ""}
            onChange={(e) => set(e.target.value)}
            className="w-full rounded-2xl border border-sand-200 bg-white px-4 py-3 text-sm text-ink focus:border-lavender-400 focus:outline-none"
          >
            {f.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
      case "toggle":
        return (
          <Toggle
            checked={Boolean(v)}
            onChange={(checked) => set(checked)}
            label={f.label}
          />
        );
      case "image":
        return (
          <MediaUpload
            value={(v as string) ?? null}
            onChange={(url) => set(url)}
            kind="image"
            folder={table}
            spec={f.spec}
          />
        );
      case "file":
        return (
          <MediaUpload
            value={(v as string) ?? null}
            onChange={(url) => set(url)}
            kind="file"
            folder={table}
            spec={f.spec}
          />
        );
      case "lines":
        return (
          <Textarea
            className="min-h-32"
            value={Array.isArray(v) ? (v as string[]).join("\n") : ""}
            placeholder={f.placeholder ?? "Un ítem por línea"}
            onChange={(e) => set(e.target.value.split("\n"))}
            onBlur={(e) =>
              set(
                e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        );
      case "richtext": {
        const alignField = f.alignField;
        const align = (alignField ? editing[alignField] : "left") as Align;
        return (
          <RichTextEditor
            ariaLabel={f.label}
            maxLength={LIMITS.richText}
            value={{ html: (v as string) ?? "", align: align || "left" }}
            onChange={(next) => {
              setEditing({
                ...editing,
                [f.name]: next.html,
                ...(alignField ? { [alignField]: next.align } : {}),
              });
            }}
          />
        );
      }
    }
  }

  const editorForm = editing && (
    <AdminCard
      title={isNew ? `Nuevo ${itemName}` : `Editar ${itemName}`}
      className="border-gold-300"
    >
      <div className="space-y-4">
        {fields.map((f) => (
          <Field key={f.name} label={f.label} hint={f.hint}>
            {renderField(f)}
          </Field>
        ))}
        {isDirty && (
          <p className="text-xs text-gold-600">
            Tenés cambios sin guardar.
          </p>
        )}
        <ErrorNotice message={error} />
        <div className="flex gap-3">
          <SaveButton type="button" saving={saving} onClick={saveEditing} />
          <button
            type="button"
            onClick={closeEditor}
            className="h-11 rounded-full border border-sand-300 px-5 text-sm text-muted hover:border-sand-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </AdminCard>
  );

  return (
    <div className="space-y-4">
      {!editing && (
        <button
          type="button"
          onClick={startNew}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-lavender-600 px-6 text-sm font-medium text-cream transition-colors hover:bg-lavender-700"
        >
          <Plus size={16} aria-hidden /> Agregar {itemName}
        </button>
      )}

      {editorForm}

      {!editing && <ErrorNotice message={error} />}

      {rows === null ? (
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : rows.length === 0 && !editing ? (
        <AdminCard>
          <p className="py-6 text-center text-muted">
            Todavía no hay elementos. Agregá el primero.
          </p>
        </AdminCard>
      ) : (
        rows.map((row, i) => (
          <AdminCard key={row.id} className="!p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg text-ink">
                  {(row[titleField] as string) || "(Sin título)"}
                </p>
                {hasActive && (
                  <Badge tone={row.active ? "green" : "gray"} className="mt-1">
                    {row.active ? "Visible" : "Oculto"}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasOrder && (
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      aria-label="Subir"
                      className="text-muted hover:text-ink disabled:opacity-30"
                      disabled={i === 0}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      aria-label="Bajar"
                      className="text-muted hover:text-ink disabled:opacity-30"
                      disabled={i === rows.length - 1}
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                )}
                {hasActive && (
                  <Toggle
                    checked={Boolean(row.active)}
                    onChange={(checked) => toggleActive(row, checked)}
                    label="Visible en el sitio"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditing(row);
                    setIsNew(false);
                    setError(null);
                    setDirtySnapshot(JSON.stringify(row));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  aria-label="Editar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-300 text-muted hover:border-lavender-400 hover:text-gold-600"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(row.id)}
                  aria-label="Eliminar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-300 text-muted hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </AdminCard>
        ))
      )}
    </div>
  );
}
