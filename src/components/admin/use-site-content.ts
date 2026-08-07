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
    adminGetContent(key)
      .then(({ data, error: loadError }) => {
        if (cancelled) return;
        if (loadError === "not_configured") setConfigured(false);
        else if (loadError && loadError !== "no_session") setError(loadError);
        if (data) {
          // Los valores con forma de arreglo (ej.: benefits, how_it_works) no
          // se pueden mezclar con spread de objeto: {...[a,b], ...[c]} da un
          // objeto con claves numéricas, no un arreglo, y rompe cualquier
          // .map() posterior. Un arreglo guardado ya viene completo por ítem
          // (coercionado en el servidor), así que se usa tal cual.
          const merged = Array.isArray(data)
            ? (data as T)
            : ({ ...fallback, ...(data as T) } as T);
          setValue(merged);
          setSavedSnapshot(JSON.stringify(merged));
        }
        setLoading(false);
      })
      .catch(() => {
        // Sin esto, un fallo de red al llamar a la Server Action (ej.: un
        // corte momentáneo hacia Supabase) queda como una promesa rechazada
        // sin manejar, y React desmonta TODO el árbol con "Application
        // error" — incluso si esta sección en particular no era crítica.
        // El fallback (contenido de fábrica, ya seteado por useState) queda
        // en pantalla en vez de romper la página entera.
        if (cancelled) return;
        setError(
          "No se pudo cargar esta sección. Recargá la página e intentá de nuevo.",
        );
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
    let result;
    try {
      result = await adminUpsertContent(key, value);
    } catch {
      // Mismo motivo que en la carga: un fallo de red no debe tirar abajo
      // toda la página, solo esta sección.
      setSaving(false);
      setError("No se pudo guardar. Revisá tu conexión e intentá de nuevo.");
      return false;
    }
    setSaving(false);
    if (!result.error) {
      setSaved(true);
      setSavedSnapshot(JSON.stringify(value));
      setTimeout(() => setSaved(false), 2500);
      return true;
    }
    setError(
      result.error === "not_configured"
        ? "El backend no está configurado."
        : result.error === "no_session"
          ? "Tu sesión expiró. Recargá la página e ingresá de nuevo."
          : result.error,
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
