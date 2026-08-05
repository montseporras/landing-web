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
  // Snapshot de lo último cargado/guardado: permite detectar cambios sin
  // guardar (aviso al cancelar, al restaurar y al cerrar la pestaña).
  const [savedSnapshot, setSavedSnapshot] = useState<string>(
    JSON.stringify(fallback),
  );

  useEffect(() => {
    let cancelled = false;
    adminGetContent(key).then(({ data, error: loadError }) => {
      if (cancelled) return;
      if (loadError === "not_configured") setConfigured(false);
      else if (loadError && loadError !== "no_session") setError(loadError);
      if (data) {
        const merged = { ...fallback, ...(data as T) };
        setValue(merged);
        setSavedSnapshot(JSON.stringify(merged));
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const isDirty = JSON.stringify(value) !== savedSnapshot;

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    const { error: saveError } = await adminUpsertContent(key, value);
    setSaving(false);
    if (!saveError) {
      setSaved(true);
      setSavedSnapshot(JSON.stringify(value));
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

  /** Descarta los cambios sin guardar y vuelve al último valor guardado. */
  const cancel = useCallback(() => {
    if (isDirty && !confirm("Tenés cambios sin guardar. ¿Descartarlos?")) {
      return;
    }
    setValue(JSON.parse(savedSnapshot) as T);
    setError(null);
  }, [isDirty, savedSnapshot]);

  /**
   * Reemplaza el valor actual (sin guardar) por el contenido de fábrica.
   * La administradora sigue teniendo que tocar "Guardar cambios" para
   * confirmarlo — no escribe en la base de datos por sí sola.
   */
  const restoreDefault = useCallback(
    (section?: string) => {
      const label = section ? `«${section}»` : "esta sección";
      if (!confirm(`¿Restaurar ${label} al contenido predeterminado?`)) {
        return;
      }
      setValue(fallback);
      setError(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    value,
    setValue,
    save,
    cancel,
    restoreDefault,
    isDirty,
    /** Último valor guardado (o el de fábrica, si nunca se guardó). Útil
     * para combinar varias secciones en un único botón "Cancelar". */
    lastSaved: JSON.parse(savedSnapshot) as T,
    loading,
    saving,
    saved,
    error,
    configured,
  };
}
