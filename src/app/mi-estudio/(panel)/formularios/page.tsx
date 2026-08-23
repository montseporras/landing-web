"use client";

import {
  Archive,
  CheckSquare,
  Download,
  Inbox,
  Loader2,
  Lock,
  MailCheck,
  Reply,
  Search,
  Square,
  Trash2,
  Undo2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  AdminCard,
  AdminHeader,
  ErrorNotice,
  NotConfigured,
} from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  adminDeleteAllSubmissions,
  adminDeleteSubmissionPermanently,
  adminList,
  adminUpdate,
} from "@/lib/admin/actions";
import { downloadExcel } from "@/lib/export-excel";
import { cn } from "@/lib/utils";
import type { Submission, SubmissionType } from "@/lib/types";

type TypeFilter = SubmissionType | "todos";

const typeFilters: { id: TypeFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "llamada", label: "Llamadas" },
  { id: "contacto", label: "Contacto" },
  { id: "descarga", label: "Descargas de regalos" },
];

const typeName: Record<SubmissionType, string> = {
  llamada: "Solicitud de llamada",
  contacto: "Mensaje de contacto",
  descarga: "Descarga de regalo",
};

/** Texto amigable a partir del meta técnico de cada registro. */
function detailLine(row: Submission): string | null {
  const m = (row.meta ?? {}) as Record<string, unknown>;
  if (row.type === "descarga" && m.gift_title)
    return `Regalo descargado: ${m.gift_title}`;
  if (row.type === "llamada" && m.availability)
    return `Disponibilidad: ${m.availability}`;
  if (row.type === "contacto" && m.subject) return `Asunto: ${m.subject}`;
  return null;
}

function exportExcel(rows: Submission[]) {
  const headers = [
    "Fecha",
    "Tipo",
    "Nombre",
    "Email",
    "Teléfono",
    "Mensaje",
    "Detalle",
    "Estado",
    "En bandeja",
  ];
  const data = rows.map((r) => [
    new Date(r.created_at).toLocaleString("es-ES"),
    typeName[r.type] ?? r.type,
    r.name ?? "",
    r.email,
    r.phone ?? "",
    r.message ?? "",
    detailLine(r) ?? "",
    r.status === "leido" ? "Leído" : "Nuevo",
    r.hidden ? "No (en historial)" : "Sí",
  ]);
  downloadExcel(
    "Historial",
    headers,
    data,
    `historial-formularios-${new Date().toISOString().slice(0, 10)}`,
  );
}

/** Acción destructiva pendiente de confirmar con contraseña (solo dentro de
 * Historial permanente: eliminar UN registro o eliminar TODO). */
type DestructiveTarget = { kind: "one"; row: Submission } | { kind: "all" };

export default function AdminFormulariosPage() {
  const [view, setView] = useState<"recibidos" | "historial">("recibidos");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("todos");
  const [rows, setRows] = useState<Submission[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Selección múltiple (solo Bandeja): quitar varios mensajes a la vez, sin
  // contraseña — es un soft-delete reversible, no una acción destructiva.
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkHiding, setBulkHiding] = useState(false);

  // Confirmación con contraseña, solo para acciones destructivas reales
  // (eliminar definitivamente, dentro de Historial permanente).
  const [destructive, setDestructive] = useState<DestructiveTarget | null>(
    null,
  );
  const [destructivePassword, setDestructivePassword] = useState("");
  const [destructiveWorking, setDestructiveWorking] = useState(false);
  const [destructiveError, setDestructiveError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setRows(null);
    setError(null);
    adminList("submissions", {
      order: { column: "created_at", ascending: false },
    }).then(({ data, error: err }) => {
      if (err === "not_configured") setConfigured(false);
      else if (err && err !== "no_session") setError(err);
      setRows((data as unknown as Submission[]) ?? []);
    });
  }, []);

  // La selección es solo para la Bandeja: al cambiar de vista o de filtro se
  // limpia, para no arrastrar ids que ya no están a la vista.
  useEffect(() => {
    setSelected(new Set());
  }, [view, typeFilter, query]);

  const filtered = useMemo(() => {
    if (!rows) return null;
    let list = rows;
    // Recibidos = bandeja (no ocultos); Historial = todos.
    if (view === "recibidos") list = list.filter((r) => !r.hidden);
    if (typeFilter !== "todos")
      list = list.filter((r) => r.type === typeFilter);
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) =>
      [r.name, r.email, r.phone, r.message, detailLine(r)]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q)),
    );
  }, [rows, view, typeFilter, query]);

  if (!configured) {
    return (
      <>
        <AdminHeader title="Formularios recibidos" />
        <NotConfigured />
      </>
    );
  }

  async function markRead(row: Submission) {
    setRows(
      (prev) =>
        prev?.map((r) => (r.id === row.id ? { ...r, status: "leido" } : r)) ??
        null,
    );
    await adminUpdate("submissions", row.id, { status: "leido" });
  }

  async function restore(row: Submission) {
    setRows(
      (prev) =>
        prev?.map((r) => (r.id === row.id ? { ...r, hidden: false } : r)) ??
        null,
    );
    await adminUpdate("submissions", row.id, { hidden: false });
  }

  /** Quitar de la bandeja: soft-delete reversible (sigue en el historial),
   * por eso NO pide contraseña — ni acá, ni en la acción múltiple de abajo. */
  async function hideOne(row: Submission) {
    setRows(
      (prev) =>
        prev?.map((r) => (r.id === row.id ? { ...r, hidden: true } : r)) ??
        null,
    );
    await adminUpdate("submissions", row.id, { hidden: true });
  }

  function toggleSelected(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAllVisible() {
    if (!filtered) return;
    const allSelected = filtered.every((r) => selected.has(r.id));
    setSelected(allSelected ? new Set() : new Set(filtered.map((r) => r.id)));
  }

  async function bulkHide() {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    setBulkHiding(true);
    setRows(
      (prev) =>
        prev?.map((r) => (ids.includes(r.id) ? { ...r, hidden: true } : r)) ??
        null,
    );
    await Promise.all(
      ids.map((id) => adminUpdate("submissions", id, { hidden: true })),
    );
    setSelected(new Set());
    setBulkHiding(false);
  }

  function closeDestructive() {
    if (destructiveWorking) return;
    setDestructive(null);
    setDestructivePassword("");
    setDestructiveError(null);
  }

  async function confirmDestructive() {
    if (!destructive) return;
    setDestructiveWorking(true);
    setDestructiveError(null);

    if (destructive.kind === "one") {
      const { error: err } = await adminDeleteSubmissionPermanently(
        destructive.row.id,
        destructivePassword,
      );
      setDestructiveWorking(false);
      if (err) {
        setDestructiveError(err);
        return;
      }
      setRows(
        (prev) => prev?.filter((r) => r.id !== destructive.row.id) ?? null,
      );
    } else {
      const { error: err } = await adminDeleteAllSubmissions(
        destructivePassword,
      );
      setDestructiveWorking(false);
      if (err) {
        setDestructiveError(err);
        return;
      }
      setRows([]);
    }
    setDestructive(null);
    setDestructivePassword("");
  }

  function replyHref(row: Submission): string {
    const subject = encodeURIComponent(
      row.type === "llamada"
        ? "Tu llamada de claridad — Francis Salazar"
        : "Re: tu mensaje — Francis Salazar",
    );
    return `mailto:${row.email}?subject=${subject}`;
  }

  const allVisibleSelected =
    view === "recibidos" &&
    !!filtered &&
    filtered.length > 0 &&
    filtered.every((r) => selected.has(r.id));

  return (
    <>
      <AdminHeader
        title="Formularios recibidos"
        description="Los datos de cada persona que te escribe o descarga un regalo. Nada se borra de forma definitiva desde la bandeja: todo queda guardado en el historial permanente."
        actions={
          view === "historial" ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => filtered && exportExcel(filtered)}
                disabled={!filtered || filtered.length === 0}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-sand-300 px-5 text-sm text-ink transition-colors hover:border-lavender-400 disabled:opacity-50"
              >
                <Download size={15} aria-hidden /> Exportar a Excel
              </button>
              <button
                type="button"
                onClick={() => setDestructive({ kind: "all" })}
                disabled={!rows || rows.length === 0}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-red-300 px-5 text-sm text-red-600 transition-colors hover:border-red-400 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={15} aria-hidden /> Eliminar todo el historial
              </button>
            </div>
          ) : undefined
        }
      />

      {/* Vista principal: bandeja vs historial */}
      <div
        role="tablist"
        aria-label="Vista"
        className="mb-5 inline-flex gap-1 rounded-full bg-sand-100 p-1"
      >
        {(
          [
            { id: "recibidos", label: "Bandeja", icon: Inbox },
            { id: "historial", label: "Historial permanente", icon: Archive },
          ] as const
        ).map((v) => (
          <button
            key={v.id}
            role="tab"
            type="button"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all",
              view === v.id
                ? "bg-white text-ink shadow-soft"
                : "text-muted hover:text-ink",
            )}
          >
            <v.icon size={15} aria-hidden />
            {v.label}
          </button>
        ))}
      </div>

      {view === "historial" && (
        <p className="mb-5 flex items-start gap-2 rounded-2xl bg-lavender-50 px-4 py-3 text-sm text-muted">
          <Archive size={16} className="mt-0.5 flex-none text-lavender-500" />
          Este es el respaldo completo. Incluye también los registros que
          quitaste de la bandeja. Podés exportarlo a Excel, eliminar un
          registro puntual o eliminar todo el historial — estas dos últimas
          acciones son definitivas y piden tu contraseña.
        </p>
      )}

      {/* Filtro por tipo */}
      <div
        role="tablist"
        aria-label="Tipo de formulario"
        className="mb-4 flex flex-wrap gap-2"
      >
        {typeFilters.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={typeFilter === t.id}
            onClick={() => setTypeFilter(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-all",
              typeFilter === t.id
                ? "border-lavender-600 bg-lavender-600 text-white"
                : "border-sand-200 bg-white text-muted hover:border-lavender-400 hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="mb-6 flex w-full max-w-md items-center gap-3 rounded-full border border-sand-200 bg-white px-5 py-3 transition-colors focus-within:border-lavender-400">
        <Search size={17} className="flex-none text-muted" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, email o mensaje…"
          aria-label="Buscar en los formularios"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
        />
      </div>

      <ErrorNotice message={error} className="mb-4" />

      {/* Selección múltiple: solo en Bandeja */}
      {view === "recibidos" && filtered && filtered.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggleSelectAllVisible}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
          >
            {allVisibleSelected ? (
              <CheckSquare size={17} className="text-lavender-600" />
            ) : (
              <Square size={17} />
            )}
            Seleccionar todos ({filtered.length})
          </button>
          {selected.size > 0 && (
            <button
              type="button"
              onClick={bulkHide}
              disabled={bulkHiding}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-lavender-600 px-4 text-xs font-medium text-white transition-colors hover:bg-lavender-700 disabled:opacity-60"
            >
              {bulkHiding ? (
                <Loader2 size={13} className="animate-spin" aria-hidden />
              ) : (
                <Archive size={13} aria-hidden />
              )}
              Quitar {selected.size} de la bandeja
            </button>
          )}
        </div>
      )}

      {filtered === null ? (
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : filtered.length === 0 ? (
        <AdminCard>
          <p className="py-8 text-center text-muted">
            {query
              ? "No encontramos resultados para tu búsqueda."
              : view === "historial"
                ? "El historial todavía está vacío."
                : "Todavía no hay mensajes en la bandeja. ¡Van a aparecer acá!"}
          </p>
        </AdminCard>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted">
            {filtered.length} {filtered.length === 1 ? "registro" : "registros"}
          </p>
          {filtered.map((row) => {
            const detail = detailLine(row);
            const unread = (row.status ?? "nuevo") === "nuevo";
            return (
              <AdminCard key={row.id} className="!p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    {view === "recibidos" && (
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={(e) =>
                          toggleSelected(row.id, e.target.checked)
                        }
                        aria-label={`Seleccionar mensaje de ${row.name || row.email}`}
                        className="mt-1.5 h-4 w-4 flex-none rounded border-sand-300 text-lavender-600 focus:ring-lavender-400"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted">
                          {new Date(row.created_at).toLocaleString("es-ES")}
                        </span>
                        <Badge tone="lavender">{typeName[row.type]}</Badge>
                        {view === "recibidos" && unread && (
                          <Badge tone="gold">Nuevo</Badge>
                        )}
                        {view === "historial" && row.hidden && (
                          <Badge tone="gray">Quitado de la bandeja</Badge>
                        )}
                      </div>
                      <p className="mt-1.5 font-medium text-ink">
                        {row.name || "Sin nombre"}{" "}
                        <a
                          href={`mailto:${row.email}`}
                          className="font-normal text-gold-600 hover:underline"
                        >
                          {row.email}
                        </a>
                      </p>
                      {row.phone && (
                        <p className="mt-0.5 text-sm text-muted">
                          Teléfono: {row.phone}
                        </p>
                      )}
                      {detail && (
                        <p className="mt-1 text-sm font-medium text-lavender-500">
                          {detail}
                        </p>
                      )}
                      {row.message && (
                        <p className="mt-2 whitespace-pre-line text-pretty rounded-2xl bg-sand-50 px-4 py-3 text-sm text-ink">
                          {row.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {view === "recibidos" && (
                    <div className="flex flex-none items-center gap-2">
                      {unread && (
                        <button
                          type="button"
                          onClick={() => markRead(row)}
                          aria-label="Marcar como leído"
                          title="Marcar como leído"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-300 text-muted hover:border-emerald-300 hover:text-emerald-600"
                        >
                          <MailCheck size={14} />
                        </button>
                      )}
                      <a
                        href={replyHref(row)}
                        aria-label="Responder por email"
                        title="Responder por email"
                        onClick={() => unread && markRead(row)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-300 text-muted hover:border-lavender-400 hover:text-gold-600"
                      >
                        <Reply size={14} />
                      </a>
                      <button
                        type="button"
                        onClick={() => hideOne(row)}
                        aria-label="Quitar de la bandeja"
                        title="Quitar de la bandeja"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-300 text-muted hover:border-red-300 hover:text-red-600"
                      >
                        <Archive size={14} />
                      </button>
                    </div>
                  )}

                  {view === "historial" && (
                    <div className="flex flex-none items-center gap-2">
                      {row.hidden && (
                        <button
                          type="button"
                          onClick={() => restore(row)}
                          className="inline-flex items-center gap-2 rounded-full border border-sand-300 px-4 py-2 text-xs text-muted hover:border-lavender-400 hover:text-ink"
                        >
                          <Undo2 size={13} /> Volver a la bandeja
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDestructive({ kind: "one", row })}
                        aria-label="Eliminar definitivamente"
                        title="Eliminar definitivamente"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-300 text-muted hover:border-red-300 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      {/* Modal de confirmación con contraseña: solo acciones destructivas
          reales (eliminar uno o eliminar todo el historial). */}
      {destructive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={closeDestructive}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="destructive-title"
            className="relative w-full max-w-md rounded-4xl border border-red-200 bg-white p-7 shadow-lifted"
          >
            <h2
              id="destructive-title"
              className="flex items-center gap-2 font-display text-xl text-ink"
            >
              <Lock size={18} className="text-red-600" aria-hidden />
              {destructive.kind === "all"
                ? "Eliminar todo el historial"
                : "Eliminar definitivamente"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {destructive.kind === "all" ? (
                <>
                  Esta acción es{" "}
                  <strong className="text-red-600">
                    permanente e irreversible
                  </strong>
                  : se van a eliminar TODOS los registros del historial
                  (incluida la bandeja). No se puede deshacer. Para confirmar,
                  ingresá tu contraseña de administración.
                </>
              ) : (
                <>
                  Este registro se va a eliminar de la base de datos y{" "}
                  <strong className="text-red-600">
                    no se puede recuperar
                  </strong>{" "}
                  (a diferencia de "quitar de la bandeja", que es reversible).
                  Para confirmar, ingresá tu contraseña de administración.
                </>
              )}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                confirmDestructive();
              }}
              className="mt-5 space-y-3"
            >
              <Input
                type="password"
                value={destructivePassword}
                onChange={(e) => setDestructivePassword(e.target.value)}
                placeholder="Tu contraseña"
                aria-label="Contraseña de administración"
                autoFocus
              />
              <ErrorNotice message={destructiveError} />
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeDestructive}
                  disabled={destructiveWorking}
                  className="h-11 rounded-full border border-sand-300 px-5 text-sm text-muted hover:border-sand-400 disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={destructiveWorking || !destructivePassword}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-red-600 px-6 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                >
                  {destructiveWorking && (
                    <Loader2 size={15} className="animate-spin" aria-hidden />
                  )}
                  {destructiveWorking
                    ? "Eliminando…"
                    : destructive.kind === "all"
                      ? "Eliminar todo"
                      : "Eliminar definitivamente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
