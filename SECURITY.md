# Seguridad — historial de auditoría y correcciones

Registro de la revisión de seguridad hecha sobre el proyecto y de los cambios aplicados. Última actualización: 2026-07-18 (revisión final).

## Revisión final (2026-07-18)

Pasada de cierre sobre todo lo tocado en este historial, antes de dar por terminado el trabajo de seguridad de esta ronda:

- `npx tsc --noEmit` → limpio (exit 0).
- `npx next build` → build de producción exitoso, 21 rutas generadas, sin errores.
- `npm audit` → **2 vulnerabilidades (1 alta, 1 moderada)**, sin cambios respecto a la verificación anterior — nada se degradó.
- Revisión de código en busca de restos de debug (`console.log`, `TODO`, `FIXME`) en `src/` → ninguno encontrado.
- `README.md` actualizado para reflejar el estado real de `next.config.mjs` (la sección "Mantenimiento" decía que `typescript.ignoreBuildErrors` seguía en `true`; ya está en `false` y verificado — se corrigió el texto) y se agregó una referencia cruzada a este archivo.

No se encontró ningún hallazgo nuevo. El estado sigue siendo el descripto en las secciones de abajo: Crítico y Alto pendientes de tu acción (rotar credenciales, definir `ADMIN_SECRET`), Medio y Bajo corregidos.

## Resumen

Se hizo una auditoría manual completa (no hay repo git, así que se revisó código a mano en vez de con `/security-review`) cubriendo: secretos y variables de entorno, autenticación del panel admin, Supabase/RLS, formularios públicos, headers de seguridad, cookies y dependencias. Sobre esos hallazgos se corrigieron los de severidad **Media** y **Baja**. Los de severidad **Crítica** y **Alta** quedan pendientes porque requieren una acción del dueño del sitio (rotar credenciales en el dashboard de Supabase) que no se puede hacer desde acá.

---

## 🔴 Crítico — PENDIENTE (requiere acción tuya)

**Secretos reales en `.env.local`**

- El archivo tiene en texto plano la `SUPABASE_SERVICE_ROLE_KEY` real (bypasea toda la seguridad de la base de datos) y las credenciales reales del panel admin (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).
- No están en git (no hay repo), pero quedaron expuestos en esta conversación y en cualquier backup/zip de la carpeta.
- **Acción pendiente:**
  1. Rotar la `service_role key` en el dashboard de Supabase (Project Settings → API).
  2. Cambiar `ADMIN_PASSWORD` por una nueva.
  3. Actualizar `.env.local` con los valores nuevos.

Esto no se hizo porque requiere tu dashboard de Supabase; no es algo que se pueda ejecutar desde el entorno de código.

---

## 🟠 Alto — PENDIENTE (requiere acción tuya)

**1. `ADMIN_SECRET` sin configurar** (`src/lib/admin/session.ts`)

- La cookie de sesión del admin se firma con HMAC. Si `ADMIN_SECRET` no está seteado, la clave de firma se deriva de `ADMIN_PASSWORD` directamente.
- Riesgo: si la password se filtra o es débil, se pueden falsificar sesiones sin necesidad de fuerza bruta contra el login.
- **Acción pendiente:** generar un secreto aleatorio de 32+ bytes y setearlo como `ADMIN_SECRET` en el entorno (independiente de la password).

**2. Bucket de Storage `media` público** (`supabase/schema.sql`, `src/lib/admin/actions.ts`)

- Es público por diseño (para que los regalos descargables funcionen sin login), con nombres de archivo poco predecibles (6 caracteres random).
- No es un bug, pero es un punto a vigilar: si alguna vez se sube algo que debería ser privado a ese bucket, quedaría accesible por URL directa.
- Sin acción por ahora — solo queda documentado como watch-item.

---

## 🟡 Medio — CORREGIDO

**1. Dependencias con vulnerabilidades conocidas**

| Paquete | Antes | Ahora |
|---|---|---|
| `next` | 14.2.15 | **14.2.35** |
| `@supabase/supabase-js` | 2.45.4 | **2.110.7** |
| `@supabase/ssr` | 0.5.1 | **0.5.2** |

Esto resolvió, entre otros, un CVE **crítico** de Denial of Service en Server Actions de Next.js, y bugs de manejo inseguro de cookies/paths en los paquetes de Supabase. `npm audit` bajó de 6 vulnerabilidades (1 crítica) a **2 (1 alta, 1 moderada)** — las que quedan solo se resuelven saltando a Next 16 (versión mayor, con posibles breaking changes), así que se dejó pendiente de una decisión tuya explícita en vez de aplicarla sola.

**2. `typescript.ignoreBuildErrors: true`** (`next.config.mjs`)

- Estaba en `true` porque el proyecto se generó sin poder correr `npm`/`tsc` en su momento, así que nunca se verificó si el tipado realmente compilaba.
- Se corrió `tsc --noEmit`, aparecieron 2 errores reales, y se arreglaron:
  - Faltaba `"target": "ES2017"` en `tsconfig.json` (sin esto, iterar un `Uint8Array` con `for...of` no compila).
  - `src/lib/admin/actions.ts` (función `seedDefaultsIfNeeded`): el insert genérico a Supabase no tipaba bien porque mezclaba filas de tablas distintas en una sola variable — se separó en tres ramas, una por tabla.
  - `src/lib/supabase/server.ts`: faltaba anotar el tipo del parámetro `cookiesToSet` en el callback `setAll`.
- Ahora la bandera está en `false`: si el código deja de tipar, el build vuelve a fallar (como debería).

**3. CSP (`Content-Security-Policy`) con `unsafe-inline`/`unsafe-eval` en `script-src`**

- Se intentó reemplazarlo por un CSP con nonce por request (técnica recomendada por Next.js) vía `src/middleware.ts`.
- **Se probó con un navegador real (Playwright) y rompía el sitio entero**: Next no lograba inyectar el nonce en sus propios scripts corriendo en modo self-hosted (`next start`), así que el navegador bloqueaba todo el JavaScript — la página cargaba pero no hidrataba, ningún botón funcionaba.
- Se revirtió a la CSP estática original (la que ya estaba funcionando) para no arriesgar el sitio en producción.
- **Queda como mejora pendiente**: probarlo específicamente en un preview deploy de Vercel (ahí el mecanismo de middleware es distinto — un Edge Function real en vez de un solo proceso Node — y es posible que sí funcione ahí).

**4. `eslint.ignoreDuringBuilds: true`**

- Se dejó como está: ESLint no está instalado ni configurado en este proyecto (no hay dependencia `eslint`, ni `.eslintrc`, ni config nueva). Activar la bandera sin instalar y configurar ESLint primero solo haría fallar el build por falta de configuración, no por errores reales.
- Es un trabajo aparte (instalar `eslint-config-next`, configurarlo, revisar lo que encuentre) que no se hizo porque no es estrictamente un tema de seguridad y se sale del alcance pedido.

---

## 🟢 Bajo — CORREGIDO

**Rate limiting en memoria** (`src/lib/rate-limit.ts`)

- El rate limiting (contra fuerza bruta y spam de formularios) vive en memoria del proceso, no en un store compartido — en un hosting serverless con múltiples instancias, cada una tiene su propio contador.
- Confiar en el header `x-forwarded-for` para identificar la IP del visitante solo es seguro si el proxy delante (Vercel) lo sanea — se agregó un comentario aclarando explícitamente esa condición, para que quede documentado por qué es seguro en el hosting actual y cuándo dejaría de serlo.
- No se migró a un store externo (Redis/Upstash/Vercel KV) porque eso requiere credenciales e infraestructura nueva que no se puede decidir ni crear sin vos.

---

## Verificación hecha

Después de cada cambio se corrió:

- `npx tsc --noEmit` → limpio, sin errores.
- `npx next build` → build de producción exitoso, sin errores, todas las páginas generadas estáticamente igual que antes.
- Smoke test con navegador headless (Playwright) sobre las 8 páginas principales (home, FAQ, servicios, regalos, contacto, sobre-mí, admin, admin/login): **0 errores de consola, 0 respuestas HTTP con error, 0 fallos de carga**.
- Verificación visual (screenshot) de que el sitio se ve y funciona igual que antes.
- Una segunda auditoría independiente después de aplicar todo, para confirmar que ningún fix quedó a medio aplicar y que no se introdujo ninguna regresión.

## Próximos pasos sugeridos (en orden de prioridad)

1. Rotar `SUPABASE_SERVICE_ROLE_KEY` y `ADMIN_PASSWORD` (Crítico).
2. Generar y setear `ADMIN_SECRET` (Alto).
3. Decidir si vale la pena migrar a Next 16 para cerrar las 2 vulnerabilidades restantes de `npm audit` (Medio, requiere testing propio por ser versión mayor).
4. Si en algún momento se despliega a Vercel, probar ahí el CSP con nonce (ver punto 3 de la sección Medio) — podría funcionar en ese entorno aunque falló en local.
