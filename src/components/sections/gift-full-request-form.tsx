"use client";

import { Check, Download } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { Honeypot } from "@/components/ui/honeypot";
import { Input } from "@/components/ui/input";
import { submitGiftFullEdition } from "@/lib/actions";
import type { Gift } from "@/lib/types";

/** Formulario de la edición completa (modo "breve_completo"): pide nombre +
 * email y, al enviarlo, entrega una URL temporal de descarga. */

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lavender-600 px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-lavender-700 hover:shadow-lila disabled:opacity-60"
    >
      {pending ? "Un segundo…" : label}
    </button>
  );
}

export function GiftFullRequestForm({ gift }: { gift: Gift }) {
  const [state, action] = useFormState(submitGiftFullEdition, {
    ok: false,
    message: "",
    fileUrl: null,
  });
  const buttonLabel =
    gift.full_form_button_label || `Recibir ${gift.title} completo`;

  if (state.ok) {
    return (
      <div className="rounded-3xl bg-emerald-50 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check size={22} aria-hidden />
        </span>
        <p className="mt-4 text-emerald-800">{state.message}</p>
        {state.fileUrl && (
          <a
            href={state.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <Download size={15} aria-hidden /> Descargar la edición completa
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      action={action}
      className="relative space-y-3 rounded-4xl border border-sand-200 bg-white/80 p-6 shadow-soft backdrop-blur md:p-8"
    >
      <Honeypot />
      <input type="hidden" name="gift_id" value={gift.id} />
      <div>
        <label htmlFor="full-name" className="mb-1.5 block text-sm font-medium text-ink">
          Tu nombre
        </label>
        <Input id="full-name" name="name" required placeholder="Tu nombre" />
      </div>
      <div>
        <label htmlFor="full-email" className="mb-1.5 block text-sm font-medium text-ink">
          Tu email
        </label>
        <Input
          id="full-email"
          name="email"
          type="email"
          required
          placeholder="tu@email.com"
        />
      </div>
      <SubmitButton label={buttonLabel} />
      {state.message && !state.ok && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}
      <p className="text-xs text-muted">Sin spam, prometido.</p>
    </form>
  );
}
