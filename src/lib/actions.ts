"use server";

import { logError } from "@/lib/log";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import {
  cleanText,
  isHoneypotTripped,
  isValidEmail,
  LIMITS,
} from "@/lib/validation";
import type { SubmissionType } from "@/lib/types";

/**
 * Server actions de los formularios públicos (contacto, llamada y descarga
 * de regalos con email).
 *
 * Seguridad aplicada en cada envío:
 * - Honeypot anti-bots (campo oculto "website").
 * - Rate limiting por IP (máx. 5 envíos cada 10 minutos por formulario).
 * - Validación y sanitización de todos los campos (longitud + formato).
 * - Mensajes de error siempre amigables; el detalle queda en el log.
 */

export interface FormState {
  ok: boolean;
  message: string;
}

const GENERIC_ERROR =
  "Hubo un problema al enviar. Probá de nuevo en unos minutos.";

async function saveSubmission(
  type: SubmissionType,
  formData: FormData,
  fields: {
    name?: string;
    email: string;
    phone?: string;
    message?: string;
    meta?: Record<string, unknown>;
    nameRequired?: boolean;
  },
): Promise<FormState> {
  try {
    // Honeypot: si un bot completó el campo oculto, se simula éxito y
    // el envío se descarta (no le damos pistas al bot).
    if (isHoneypotTripped(formData)) {
      return { ok: true, message: "¡Recibido! Gracias por escribir." };
    }

    const email = cleanText(fields.email, LIMITS.email);
    if (!isValidEmail(email)) {
      return { ok: false, message: "Ingresá un email válido." };
    }

    const name = cleanText(fields.name, LIMITS.name);
    if (fields.nameRequired && !name) {
      return {
        ok: false,
        message: "Contame tu nombre para poder responderte.",
      };
    }

    // Máx. 5 envíos por formulario cada 10 minutos por IP (anti-spam).
    const ip = getClientIp();
    if (!rateLimit(`form:${type}:${ip}`, 5, 10 * 60 * 1000)) {
      return {
        ok: false,
        message:
          "Enviaste varios mensajes seguidos. Esperá unos minutos y volvé a intentar.",
      };
    }

    const supabase = createClient();
    if (!supabase) {
      // Sin base de datos configurada: se simula éxito para poder probar la
      // interfaz en desarrollo. En producción esto no debería ocurrir.
      logError(`form:${type}`, "Supabase no configurado; envío no guardado");
      return { ok: true, message: "" };
    }

    const { error } = await supabase.from("submissions").insert({
      type,
      name: name || null,
      email,
      phone: cleanText(fields.phone, LIMITS.phone) || null,
      message: cleanText(fields.message, LIMITS.message) || null,
      meta: fields.meta ?? null,
    });

    if (error) {
      logError(`form:${type}`, error.message);
      return { ok: false, message: GENERIC_ERROR };
    }
    return { ok: true, message: "" };
  } catch (e) {
    logError(`form:${type}`, e);
    return { ok: false, message: GENERIC_ERROR };
  }
}

/** Formulario de contacto general. */
export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const res = await saveSubmission("contacto", formData, {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
    meta: {
      subject: cleanText(formData.get("subject"), LIMITS.subject),
    },
    nameRequired: true,
  });
  if (res.ok && !res.message) {
    res.message =
      "¡Gracias por escribirme! Te respondo dentro de las próximas 48 hs.";
  }
  return res;
}

/** Solicitud de llamada de claridad. */
export async function submitCallRequest(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const res = await saveSubmission("llamada", formData, {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
    meta: {
      availability: cleanText(formData.get("availability"), LIMITS.shortText),
    },
    nameRequired: true,
  });
  if (res.ok && !res.message) {
    res.message =
      "¡Listo! Recibí tu solicitud. Te escribo en menos de 48 hs para coordinar la llamada.";
  }
  return res;
}

/**
 * Acceso a un regalo con captura de email: guarda el lead y devuelve la URL
 * del archivo para iniciar la descarga.
 */
export async function submitGiftLead(
  _prev: FormState & { fileUrl?: string | null },
  formData: FormData,
): Promise<FormState & { fileUrl?: string | null }> {
  const fileUrl = cleanText(formData.get("file_url"), LIMITS.url);
  const res = await saveSubmission("descarga", formData, {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    // Solo guardamos el nombre del regalo (amigable para el panel).
    meta: {
      gift_title: cleanText(formData.get("gift_title"), LIMITS.title),
    },
  });
  if (!res.ok) return res;
  return {
    ok: true,
    message: fileUrl
      ? "¡Listo! Tu descarga comienza ahora."
      : "¡Gracias! Te lo enviaremos a tu correo apenas esté disponible.",
    fileUrl: fileUrl || null,
  };
}
