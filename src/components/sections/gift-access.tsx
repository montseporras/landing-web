"use client";

import { ArrowUpRight, Check, Download, Mail } from "lucide-react";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Honeypot } from "@/components/ui/honeypot";
import { Input } from "@/components/ui/input";
import { submitGiftLead } from "@/lib/actions";
import type { Gift } from "@/lib/types";

/**
 * Acción de acceso a un regalo según su modo configurado por la admin:
 * - "directo": descarga inmediata del archivo.
 * - "email":   pide nombre (opcional) + email antes de entregar.
 * - "enlace":  redirige a un enlace externo (Drive, YouTube, Canva…).
 *
 * Componente compartido por la grilla de regalos y el regalo destacado de la
 * portada, para no duplicar lógica.
 */

function LeadSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-lavender-600 text-sm font-medium text-white transition-all duration-300 hover:bg-lavender-700 hover:shadow-lila disabled:opacity-60"
    >
      <Download size={15} aria-hidden />
      {pending ? "Un segundo…" : "Recibir mi regalo"}
    </button>
  );
}

/** Formulario de email previo a la descarga (modo "email"). */
function EmailGate({ gift, onDone }: { gift: Gift; onDone?: () => void }) {
  const [state, action] = useFormState(submitGiftLead, {
    ok: false,
    message: "",
    fileUrl: null,
  });

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-emerald-50 p-4 text-center">
        <p className="flex items-center justify-center gap-2 text-sm text-emerald-800">
          <Check size={15} className="flex-none" aria-hidden /> {state.message}
        </p>
        {state.fileUrl && (
          <a
            href={state.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <Download size={14} aria-hidden /> Abrir mi regalo
          </a>
        )}
      </div>
    );
  }

  return (
    <form action={action} className="relative space-y-2.5">
      <Honeypot />
      <input type="hidden" name="gift_title" value={gift.title} />
      <input type="hidden" name="file_url" value={gift.file_url ?? ""} />
      <Input
        name="name"
        placeholder="Tu nombre (opcional)"
        aria-label="Tu nombre"
      />
      <Input
        name="email"
        type="email"
        required
        placeholder="tu@email.com"
        aria-label="Tu email"
      />
      <LeadSubmitButton />
      {state.message && !state.ok && (
        <p role="alert" className="text-xs text-red-600">
          {state.message}
        </p>
      )}
      <div className="flex items-center justify-between">
        <p className="text-[0.7rem] text-muted">Sin spam, prometido.</p>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-[0.7rem] text-muted underline underline-offset-2 hover:text-ink"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

const btnClass =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-lavender-600 text-sm font-medium text-white transition-all duration-300 hover:bg-lavender-700 hover:shadow-lila focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender-500";

/** CTA completo de acceso a un regalo (los tres modos). */
export function GiftAccessAction({ gift }: { gift: Gift }) {
  const [showGate, setShowGate] = useState(false);
  const access = gift.access ?? "directo";
  const externalUrl = access === "enlace" ? gift.url : gift.file_url;

  if (access === "email") {
    return showGate ? (
      <EmailGate gift={gift} onDone={() => setShowGate(false)} />
    ) : (
      <button
        type="button"
        onClick={() => setShowGate(true)}
        className={btnClass}
      >
        <Mail size={15} aria-hidden /> Recibir gratis con mi email
      </button>
    );
  }

  if (externalUrl) {
    return (
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
      >
        {access === "enlace" ? (
          <>
            <ArrowUpRight size={16} aria-hidden /> Acceder al recurso
          </>
        ) : (
          <>
            <Download size={16} aria-hidden /> Descargar gratis
          </>
        )}
      </a>
    );
  }

  return (
    <a
      href="/contacto"
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-sand-300 bg-white/60 text-sm font-medium text-ink transition-all duration-300 hover:border-lavender-400"
    >
      Pedírmelo por mensaje
    </a>
  );
}
