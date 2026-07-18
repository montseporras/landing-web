/**
 * Content-Security-Policy.
 *
 * Se incluyen las directivas "duras" que NO rompen el runtime de Next.js
 * (que necesita estilos y scripts en línea): bloquean la inyección de plugins
 * (object-src), el secuestro de la URL base (base-uri), el embebido en iframes
 * de terceros (frame-ancestors) y el envío de formularios a otros dominios
 * (form-action). Se permiten imágenes desde Supabase y data/blob para las
 * vistas previas del panel.
 *
 * script-src con nonce por request (sin 'unsafe-inline'/'unsafe-eval') se
 * intentó vía middleware pero rompe la hidratación en `next start`
 * self-hosted: Next no llega a inyectar el nonce en sus propios chunks en
 * ese modo (funciona distinto en Vercel, pero no se pudo verificar acá sin
 * desplegar). Queda pendiente como mejora a probar en un preview de Vercel
 * antes de aplicar.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com",
  "media-src 'self' https://*.supabase.co",
  "font-src 'self' data:",
  // Next.js inyecta estilos y scripts en línea (hidratación); se permiten.
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https://*.supabase.co",
  "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
].join("; ");

/**
 * Headers de seguridad aplicados a todas las respuestas (equivalente gratuito
 * a Helmet). Cubren las protecciones OWASP básicas sin costo.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Evita que el navegador "adivine" tipos MIME (drive-by downloads).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // El sitio no puede embeberse en iframes de terceros (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // No filtrar la URL completa a otros sitios.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desactiva APIs sensibles que el sitio no usa.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Fuerza HTTPS durante 2 años (Vercel ya sirve todo por HTTPS).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // Protección XSS legada para navegadores antiguos.
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // no revelar la tecnología del servidor
  experimental: {
    serverActions: {
      // Debe superar el máximo permitido por archivo (25 MB) + overhead
      bodySizeLimit: "30mb",
    },
  },
  images: {
    remotePatterns: [
      // Imágenes servidas desde Supabase Storage
      { protocol: "https", hostname: "**.supabase.co" },
      // Placeholders / fotos de stock durante el desarrollo
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // Verificado: `tsc --noEmit` pasa limpio, así que los errores de tipos
  // vuelven a bloquear el build.
  typescript: { ignoreBuildErrors: false },
  // ESLint no está instalado/configurado en este proyecto todavía (no hay
  // eslint-config-next ni .eslintrc). Hasta que se agregue, esta bandera
  // debe seguir en `true` o el build falla por falta de config, no por
  // errores reales.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
