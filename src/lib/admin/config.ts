/**
 * Ruta (secreta) del panel de administración.
 *
 * Por seguridad, el panel NO vive en una URL evidente como `/admin` o
 * `/login`: eso lo hace trivial de descubrir para un atacante. En su lugar
 * usa una ruta poco predecible, definida acá en UN solo lugar para que todas
 * las referencias internas (middleware, sidebar, redirecciones) queden
 * siempre sincronizadas.
 *
 * ⚠️ IMPORTANTE: si cambiás `ADMIN_BASE_PATH`, tenés que:
 *   1. Renombrar la carpeta `src/app/mi-estudio` para que coincida con el
 *      nuevo valor (el nombre de la carpeta ES la URL en el App Router).
 *   2. Actualizar el `matcher` de `src/middleware.ts` (debe ser una constante
 *      literal: Next.js lo analiza en tiempo de build y no resuelve variables).
 *   3. Actualizar la sección "Panel de administración" del `README.md`.
 *
 * La URL NUNCA debe aparecer enlazada en el sitio público (navbar, footer,
 * sitemap, etc.): solo se documenta en el README para los desarrolladores
 * con acceso al repositorio.
 */
export const ADMIN_BASE_PATH = "/mi-estudio";

/** Ruta del login del panel. */
export const ADMIN_LOGIN_PATH = `${ADMIN_BASE_PATH}/login`;
