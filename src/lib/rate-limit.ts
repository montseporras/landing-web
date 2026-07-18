import { headers } from "next/headers";

/**
 * Rate limiting en memoria (gratuito, sin servicios externos).
 *
 * Ventana deslizante por clave (acción + IP). En serverless cada instancia
 * tiene su propia memoria, por lo que es un límite "best effort": suficiente
 * para frenar fuerza bruta y spam de formularios sin costo alguno.
 */

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5_000; // tope de memoria ante tráfico anómalo

function prune(now: number, windowMs: number, bucket: Bucket): void {
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);
}

/**
 * IP del visitante (detrás de Vercel/proxies usa x-forwarded-for).
 *
 * Confiable en Vercel: su edge network setea x-forwarded-for con la IP real
 * del cliente como primer valor y no permite que el visitante la falsifique.
 * Si el sitio se sirve alguna vez detrás de otro proxy que no sanee este
 * header, dejaría de ser confiable.
 */
export function getClientIp(): string {
  try {
    const h = headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]!.trim();
    return h.get("x-real-ip") ?? "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Registra un intento y devuelve `true` si la acción está permitida.
 * @param key    identificador (ej.: `login:1.2.3.4`)
 * @param limit  intentos permitidos dentro de la ventana
 * @param windowMs duración de la ventana en milisegundos
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) buckets.clear();

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }
  prune(now, windowMs, bucket);

  if (bucket.timestamps.length >= limit) return false;
  bucket.timestamps.push(now);
  return true;
}
