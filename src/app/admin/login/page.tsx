"use client";

import { Loader2, Lock, UserRound } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { Input, Label } from "@/components/ui/input";
import { loginAction, type LoginState } from "@/lib/admin/actions";

const initial: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lavender-600 text-sm font-medium text-cream transition-colors hover:bg-lavender-700 disabled:opacity-60"
    >
      {pending ? (
        <Loader2 size={16} className="animate-spin" aria-hidden />
      ) : (
        <Lock size={15} aria-hidden />
      )}
      {pending ? "Ingresando…" : "Ingresar"}
    </button>
  );
}

export default function LoginPage() {
  const [state, action] = useFormState(loginAction, initial);

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand-50 px-6">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="font-display text-4xl font-semibold text-ink">
            FS<span className="text-gold-500">.</span>
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted">
            Panel de administración
          </p>
        </div>

        <div className="mt-8 rounded-4xl border border-sand-200 bg-white p-8 shadow-soft">
          <form action={action} className="space-y-4">
            <div>
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <UserRound
                  size={16}
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <Input
                  id="username"
                  name="username"
                  required
                  autoComplete="username"
                  className="pl-10"
                  placeholder="Nombre de usuario"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock
                  size={16}
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {state.error && (
              <p
                role="alert"
                className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {state.error}
              </p>
            )}
            <SubmitButton />
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Acceso exclusivo para la administradora del sitio.
        </p>
      </div>
    </main>
  );
}
