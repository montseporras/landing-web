"use client";

import { CalendarClock, Check, Send } from "lucide-react";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Honeypot } from "@/components/ui/honeypot";
import { Input, Label, Textarea } from "@/components/ui/input";
import {
  submitCallRequest,
  submitContact,
  type FormState,
} from "@/lib/actions";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };

function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lavender-600 px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-lavender-700 hover:shadow-lila disabled:opacity-60"
    >
      <Send size={15} aria-hidden />
      {pending ? pendingLabel : label}
    </button>
  );
}

function Success({ message }: { message: string }) {
  return (
    <div className="rounded-3xl bg-emerald-50 p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <Check size={22} />
      </span>
      <p className="mt-4 text-emerald-800">{message}</p>
    </div>
  );
}

/** Formulario doble: contacto general o solicitud de llamada, con pestañas. */
export function ContactForms() {
  const [tab, setTab] = useState<"llamada" | "contacto">("llamada");
  const [callState, callAction] = useFormState(submitCallRequest, initial);
  const [contactState, contactAction] = useFormState(submitContact, initial);

  return (
    <div className="rounded-4xl border border-sand-200 bg-white/80 p-6 shadow-soft backdrop-blur md:p-10">
      {/* Pestañas */}
      <div
        role="tablist"
        aria-label="Tipo de consulta"
        className="mb-8 grid grid-cols-2 gap-1 rounded-full bg-sand-100 p-1"
      >
        {(
          [
            { id: "llamada", label: "Reservar llamada" },
            { id: "contacto", label: "Enviar mensaje" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300",
              tab === t.id
                ? "bg-white text-ink shadow-soft"
                : "text-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "llamada" ? (
        callState.ok ? (
          <Success message={callState.message} />
        ) : (
          <form action={callAction} className="relative space-y-4">
            <Honeypot />
            <p className="flex items-start gap-3 rounded-2xl bg-lavender-50 px-4 py-3 text-sm text-muted">
              <CalendarClock
                size={18}
                className="mt-0.5 flex-none text-lavender-500"
                aria-hidden
              />
              La llamada de claridad dura 30 minutos, es gratuita y sin
              compromiso.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="call-name">Nombre</Label>
                <Input
                  id="call-name"
                  name="name"
                  required
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <Label htmlFor="call-email">Email</Label>
                <Input
                  id="call-email"
                  name="email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="call-phone">WhatsApp (opcional)</Label>
                <Input id="call-phone" name="phone" placeholder="+54 9 …" />
              </div>
              <div>
                <Label htmlFor="call-availability">Disponibilidad</Label>
                <Input
                  id="call-availability"
                  name="availability"
                  placeholder="Ej.: tardes entre semana"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="call-message">¿Qué te gustaría trabajar?</Label>
              <Textarea
                id="call-message"
                name="message"
                placeholder="Contame brevemente tu momento actual…"
              />
            </div>
            <SubmitButton
              label="Solicitar llamada gratuita"
              pendingLabel="Enviando…"
            />
            {callState.message && !callState.ok && (
              <p role="alert" className="text-sm text-red-600">
                {callState.message}
              </p>
            )}
          </form>
        )
      ) : contactState.ok ? (
        <Success message={contactState.message} />
      ) : (
        <form action={contactAction} className="relative space-y-4">
          <Honeypot />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="c-name">Nombre</Label>
              <Input id="c-name" name="name" required placeholder="Tu nombre" />
            </div>
            <div>
              <Label htmlFor="c-email">Email</Label>
              <Input
                id="c-email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="c-subject">Asunto</Label>
            <Input
              id="c-subject"
              name="subject"
              placeholder="¿Sobre qué querés hablar?"
            />
          </div>
          <div>
            <Label htmlFor="c-message">Mensaje</Label>
            <Textarea
              id="c-message"
              name="message"
              required
              placeholder="Escribí tu mensaje…"
            />
          </div>
          <SubmitButton label="Enviar mensaje" pendingLabel="Enviando…" />
          {contactState.message && !contactState.ok && (
            <p role="alert" className="text-sm text-red-600">
              {contactState.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
