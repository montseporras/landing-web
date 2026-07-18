"use client";

import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Encabezado de cada pantalla del panel. */
export function AdminHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-ink">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}

/** Tarjeta contenedora del panel. */
export function AdminCard({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-sand-200 bg-white p-6 shadow-soft md:p-8",
        className,
      )}
    >
      {title && <h2 className="mb-5 font-display text-xl text-ink">{title}</h2>}
      {children}
    </section>
  );
}

/** Botón de guardado con estados de carga y éxito. */
export function SaveButton({
  saving,
  saved,
  label = "Guardar cambios",
  onClick,
  type = "submit",
}: {
  saving: boolean;
  saved?: boolean;
  label?: string;
  onClick?: () => void;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={saving}
      className="inline-flex h-11 items-center gap-2 rounded-full bg-lavender-600 px-6 text-sm font-medium text-cream transition-all hover:bg-lavender-700 disabled:opacity-60"
    >
      {saving ? (
        <Loader2 size={15} className="animate-spin" aria-hidden />
      ) : saved ? (
        <Check size={15} aria-hidden />
      ) : null}
      {saving ? "Guardando…" : saved ? "Guardado" : label}
    </button>
  );
}

/** Interruptor accesible activado/desactivado. */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 flex-none rounded-full transition-colors duration-300",
        checked ? "bg-emerald-500" : "bg-sand-300",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300",
          checked ? "left-[1.375rem]" : "left-0.5",
        )}
      />
    </button>
  );
}

/** Mensaje de error amigable, con rol de alerta para lectores de pantalla. */
export function ErrorNotice({
  message,
  className,
}: {
  message: string | null;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700",
        className,
      )}
    >
      <AlertTriangle size={16} className="mt-0.5 flex-none" aria-hidden />
      {message}
    </p>
  );
}

/** Aviso cuando el backend no está configurado. */
export function NotConfigured() {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
      <p className="flex items-center gap-2 font-medium text-amber-800">
        <AlertTriangle size={18} aria-hidden /> El backend no está configurado
      </p>
      <p className="mt-3 text-sm leading-relaxed text-amber-800/80">
        Para usar el panel necesitás completar las variables de entorno:
      </p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-amber-800/80">
        <li>
          Creá un proyecto gratuito en supabase.com y ejecutá{" "}
          <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code>
        </li>
        <li>
          En <code className="rounded bg-amber-100 px-1">.env.local</code>{" "}
          completá{" "}
          <code className="rounded bg-amber-100 px-1">
            NEXT_PUBLIC_SUPABASE_URL
          </code>
          ,{" "}
          <code className="rounded bg-amber-100 px-1">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          y{" "}
          <code className="rounded bg-amber-100 px-1">
            SUPABASE_SERVICE_ROLE_KEY
          </code>
        </li>
        <li>
          Definí{" "}
          <code className="rounded bg-amber-100 px-1">ADMIN_USERNAME</code> y{" "}
          <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code> para
          el login
        </li>
        <li>Reiniciá el servidor y recargá esta página</li>
      </ol>
      <p className="mt-3 text-sm text-amber-800/80">
        La guía completa está en el <strong>README.md</strong> del proyecto.
      </p>
    </div>
  );
}

/** Campo con etiqueta para formularios del panel. */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
