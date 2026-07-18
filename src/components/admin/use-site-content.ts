"use client";

import { useCallback, useEffect, useState } from "react";
import { adminGetContent, adminUpsertContent } from "@/lib/admin/actions";

/**
 * Hook para leer y guardar una sección editable (tabla site_content) a través
 * de las server actions protegidas del panel.
 *
 * - `fallback` es el contenido por defecto que se muestra antes de editar.
 * - `save()` persiste y el servidor revalida el sitio público al instante.
 * - `error` expone un mensaje amigable si algo falla (nunca errores técnicos).
 */
export function useSiteContent<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adminGetContent(key).then(({ data, error: loadError }) => {
      if (cancelled) return;
      if (loadError === "not_configured") setConfigured(false);
      else if (loadError && loadError !== "no_session") setError(loadError);
      if (data) setValue({ ...fallback, ...(data as T) });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    const { error: saveError } = await adminUpsertContent(key, value);
    setSaving(false);
    if (!saveError) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      return true;
    }
    setError(
      saveError === "not_configured"
        ? "El backend no está configurado."
        : saveError === "no_session"
          ? "Tu sesión expiró. Recargá la página e ingresá de nuevo."
          : saveError,
    );
    return false;
  }, [key, value]);

  return {
    value,
    setValue,
    save,
    loading,
    saving,
    saved,
    error,
    configured,
  };
}
