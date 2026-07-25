# FS · Francis Salazar — Plataforma web premium (v5)

Sitio web profesional + panel de administración (CMS) para la marca personal
de **Francis Salazar**, coach especializada en gestión emocional, inteligencia
emocional y neurociencia.

## 🎯 Objetivo

Ofrecer una experiencia digital elegante y serena (estética _soft luxury_
editorial) que genere conexión emocional inmediata y lleve al visitante a la
conversión: descargar un regalo gratuito, reservar una llamada de claridad,
enviar un mensaje o escribir por WhatsApp — y que la propia coach pueda
gestionar **todo el contenido sin conocimientos técnicos**.

## 🛠️ Tecnologías

| Capa            | Tecnología                                                                     |
| --------------- | ------------------------------------------------------------------------------ |
| Framework       | Next.js 14 (App Router) + React 18                                             |
| Lenguaje        | TypeScript (estricto)                                                          |
| Estilos         | Tailwind CSS · tipografías Cormorant Garamond + Inter (`next/font`)            |
| Animaciones     | Framer Motion (scroll reveal, contadores, parallax, microinteracciones)        |
| Iconos          | Lucide React                                                                   |
| Backend         | Supabase — Postgres y Storage (datos y archivos)                               |
| Acceso al panel | Login propio con usuario + contraseña (cookie firmada HMAC, sin Supabase Auth) |
| Hosting         | Vercel (recomendado)                                                           |

## 🧭 Arquitectura general

- **Sitio público** (`src/app/(site)`) — páginas renderizadas en el servidor
  con **ISR** + revalidación inmediata: cada vez que se guarda algo en el
  panel, el servidor regenera el sitio al instante (`revalidatePath`), sin
  redeploy y con carga ultrarrápida.
- **Panel** (`src/app/mi-estudio`, ruta **secreta** — ver
  [🔑 Cómo acceder al panel](#-cómo-acceder-al-panel)) — client components que
  operan a través de _server actions_ protegidas por la cookie de sesión; la
  service key de Supabase nunca llega al navegador.
- **Capa de contenido con fallback** (`src/lib/content`) — si Supabase no está
  configurado (o una sección nunca se editó), el sitio muestra contenido por
  defecto profesional. Nada se rompe sin base de datos. La primera vez que se
  abre «Regalos» o «Preguntas frecuentes» en el panel, ese contenido de
  fábrica **se siembra en la base** para poder editarlo/ocultarlo/eliminarlo
  como cualquier otro registro.
- **Seguridad** — el login del panel es **usuario + contraseña locales**
  (variables de entorno), sin Supabase Auth. La sesión es una cookie httpOnly
  firmada con HMAC-SHA256 que el middleware verifica en cada request: el panel
  vive en una **ruta secreta** (no en `/admin`) y un visitante sin sesión que
  escriba cualquier URL del panel a mano es **redirigido al inicio**. Todas las
  operaciones del panel pasan por _server actions_ que validan esa cookie,
  sanitizan el payload contra una **allowlist de tablas y columnas** y usan la
  `SUPABASE_SERVICE_ROLE_KEY` (solo en el servidor). El público, vía RLS, solo
  lee contenido activo y solo puede enviar formularios.

> El detalle completo de todas las medidas de seguridad está en la sección
> [🔒 Seguridad](#-seguridad) más abajo.

### Páginas públicas

`/` (hero, beneficios, sobre mí con estadísticas animadas, "Camino Claro,
Paso a Paso", servicios, regalos destacados, FAQ, CTA final) · `/sobre-mi`
(historia, misión, valores, galería, estadísticas) · `/servicios` ·
`/regalos` (descargables con filtros por categoría) · `/faq` · `/contacto`.

### Panel de administración (ruta secreta)

La URL exacta del panel está documentada en
[🔑 Cómo acceder al panel](#-cómo-acceder-al-panel). Pensado para una persona
sin conocimientos técnicos — solo lo esencial:

| Sección              | Qué permite                                                                                                                                                                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Página de inicio     | Títulos, subtítulos, botones/CTAs, fotografía, insignias                                                                                                                                                                                                                                      |
| Sobre mí             | Foto principal, galería, biografía, historia, misión, valores y **estadísticas** (personas acompañadas, años, horas, % que recomiendan)                                                                                                                                                       |
| Servicios            | **CRUD completo**: crear/editar/eliminar/ordenar/activar servicios, con «qué incluye», precio opcional, ícono o imagen, y destacado — todo sin tocar código                                                                                                                                    |
| Regalos              | Crear/editar/eliminar/ordenar recursos (incluidos los de fábrica); portada, descripción, **tipo libre** (Ebook, Guía, Curso…), **modo de acceso** (descarga directa / pedir email / enlace externo) y **destacar en la portada** (eBook principal). El regalo destacado tiene, solo en el inicio, un tratamiento visual animado (flotación suave, halos, marco dorado); la grilla de `/regalos` se mantiene simple a propósito (`src/components/sections/gifts-grid.tsx`) |
| Preguntas frecuentes | CRUD completo con orden de aparición, incluidas las preguntas que vienen de fábrica                                                                                                                                                                                                           |
| Formularios          | **Bandeja** e **historial permanente**: ver nombre, email, teléfono, mensaje, fecha y detalle amigable (p. ej. «Regalo descargado: …»); marcar leído, responder por email, **quitar de la bandeja con contraseña** (nunca se borra de verdad) y **exportar el historial a Excel**              |
| Ajustes              | Marca, redes sociales (Instagram, WhatsApp, email…) y footer                                                                                                                                                                                                                                  |

## 🚀 Instalación paso a paso

Requisitos: [Node.js](https://nodejs.org) 18.17 o superior.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar en desarrollo (funciona sin Supabase, con contenido de ejemplo)
npm run dev            # → http://localhost:3000
```

### Conectar Supabase (para activar el panel)

1. Creá un proyecto gratuito en [supabase.com](https://supabase.com).
2. En **SQL Editor → New query**, pegá todo `supabase/schema.sql` y ejecutá **Run**.
3. (Opcional) Ejecutá también `supabase/seed.sql` para cargar el contenido de ejemplo.
4. Copiá `.env.example` a `.env.local` y completá con los valores de
   **Project Settings → API** (URL, anon key y **service_role key**). La URL es
   la **Project URL** (`https://xxxx.supabase.co`), sin `/rest/v1/` ni nada al
   final.
5. Elegí un usuario y una contraseña para el panel y escribilos en
   `ADMIN_USERNAME` y `ADMIN_PASSWORD` del mismo archivo. No hace falta crear
   ningún usuario en Supabase.

> **¿Ya tenías la base creada en una versión anterior (v4)?** No repitas el
> `schema.sql` completo: al final de ese archivo hay un bloque comentado
> **«Desde v4 → v5»**. Copiá y ejecutá SOLO ese bloque en el SQL Editor para
> agregar lo nuevo (regalo destacado, historial de formularios, tabla de
> servicios) sin perder tus datos.

### Variables de entorno

| Variable                        | Descripción                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL del proyecto Supabase                                                                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (anon), para las lecturas del sitio                                         |
| `SUPABASE_SERVICE_ROLE_KEY`     | Clave **secreta** de servicio; solo vive en el servidor y la usan las acciones del panel  |
| `ADMIN_USERNAME`                | Usuario del panel de administración                                                       |
| `ADMIN_PASSWORD`                | Contraseña del panel (elegí una larga y única)                                            |
| `ADMIN_SECRET`                  | _(Opcional)_ secreto para firmar la cookie de sesión; si falta se deriva de la contraseña |
| `NEXT_PUBLIC_SITE_URL`          | URL pública del sitio, sin barra final                                                    |

### Scripts disponibles

| Script          | Acción                                |
| --------------- | ------------------------------------- |
| `npm run dev`   | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción                   |
| `npm start`     | Sirve el build de producción          |
| `npm run lint`  | Linter                                |

## 🔑 Cómo acceder al panel

> ⚠️ **Solo para desarrolladores autorizados con acceso a este repositorio.**
> No compartas esta URL ni la enlaces desde ninguna página pública.

**URL del panel (ruta secreta):**

```
https://tudominio.com/mi-estudio/login
```

En desarrollo local: `http://localhost:3000/mi-estudio/login`.

Por seguridad, el panel **no** vive en `/admin` ni en `/login` (rutas obvias y
fáciles de descubrir). La ruta se define en **un solo lugar**,
`src/lib/admin/config.ts` (`ADMIN_BASE_PATH`), y NO aparece enlazada en ninguna
parte del sitio público (navbar, footer, sitemap ni robots.txt).

1. Entrá a la URL de arriba.
2. Ingresá el **usuario y contraseña** definidos en `ADMIN_USERNAME` y
   `ADMIN_PASSWORD`. Existe una única administradora; no hay registro ni
   recuperación por email.
3. **Sesión**: por defecto la sesión es **temporal** — se cierra al cerrar el
   navegador y vuelve a pedir la contraseña. Si marcás **«Recordarme en este
   dispositivo»** en el login, la sesión persiste **7 días**. Al **cerrar
   sesión** se borra toda la cookie: no queda nada que permita volver a entrar
   automáticamente.
4. Sin sesión, cualquier intento de entrar a una URL del panel redirige al
   inicio del sitio.

### Cambiar la ruta secreta del panel

Si en algún momento querés cambiar la URL del panel, tenés que tocar
**tres lugares** (señalados con comentarios en el código):

1. `src/lib/admin/config.ts` → `ADMIN_BASE_PATH` (la constante).
2. Renombrar la carpeta `src/app/mi-estudio` para que coincida (el
   nombre de la carpeta **es** la URL en el App Router de Next.js).
3. `src/middleware.ts` → el `matcher` (debe ser un literal estático; Next.js lo
   analiza en build y no resuelve variables).

Y actualizá esta sección del README con la nueva URL.

## ✏️ Guías rápidas de uso

**Modificar "Sobre mí"** → Panel → _Sobre mí_: editá los textos, subí la foto
principal, agregá **varias imágenes a la vez** a la galería (reordenalas con
las flechas, quitá las que quieras) y ajustá las estadísticas (número +
sufijo + etiqueta). Guardá; el sitio se actualiza al instante.

**Formatos de imagen recomendados** (también se muestran en cada pantalla):

| Imagen                    | Medidas                       | Formato                    | Peso máx. |
| ------------------------- | ----------------------------- | -------------------------- | --------- |
| Foto principal del inicio | 1000×1150 px (vertical 7:8)   | JPG/PNG/WebP               | 8 MB      |
| Foto de "Sobre mí"        | 800×1000 px (vertical 4:5)    | JPG/PNG/WebP               | 8 MB      |
| Galería                   | 800×800 px (cuadrada)         | JPG/PNG/WebP               | 8 MB      |
| Portada de regalo         | 1280×720 px (horizontal 16:9) | JPG/PNG/WebP               | 8 MB      |
| Archivos descargables     | —                             | PDF/audio/video/ZIP/Office | 25 MB     |

**Gestionar servicios** → Panel → _Servicios_: creá, editá, ordená (▲▼),
activá/desactivá y destacá servicios. Cada uno tiene título, descripción,
lista de «qué incluye» (una línea por ítem), precio opcional, ícono o imagen y
texto del botón.

**Subir un regalo** → Panel → _Regalos_ → _Agregar regalo_: título,
descripción, **tipo** (texto libre: Ebook, Guía, Meditación, Curso, lo que
quieras), portada opcional, el **modo de acceso** (descarga directa, pedir
email antes de entregar, o enlace externo) y el interruptor **«Destacar en la
portada»** para el eBook principal. El interruptor verde lo muestra u oculta
sin borrarlo; las flechas ▲▼ cambian el orden.

**Editar las FAQ** → Panel → _Preguntas frecuentes_: agregá, editá, eliminá y
reordená con las flechas.

**Formularios: bandeja e historial permanente** → Panel → _Formularios_:

- **Bandeja**: los mensajes del día a día. Filtrás por tipo (llamadas,
  contacto, descargas de regalos), buscás, marcás como leído ✓, respondés por
  email ↩ y podés **quitar de la bandeja** un registro (pide tu contraseña y
  confirma).
- **Historial permanente**: el respaldo completo que **nunca se borra** —
  incluye también lo que quitaste de la bandeja (podés devolverlo). Desde acá
  **exportás todo a Excel** con un clic.

Importante: «quitar de la bandeja» **no elimina** el registro; solo lo saca de
la vista diaria. Todo queda guardado para siempre en el historial.

## 📁 Estructura de carpetas

```
src/
├── app/
│   ├── (site)/            # Sitio público
│   │   ├── page.tsx       # Inicio
│   │   ├── sobre-mi/  servicios/  regalos/  faq/  contacto/
│   │   ├── layout.tsx     # Navbar + footer + JSON-LD + skip-link
│   │   ├── loading.tsx    # Skeleton loading
│   │   └── not-found.tsx  # 404
│   ├── mi-estudio/ # Panel (RUTA SECRETA — ver README «Cómo acceder»)
│   │   ├── layout.tsx     # noindex/nofollow para todo el panel
│   │   ├── login/         # Login del panel
│   │   └── (panel)/       # Dashboard + secciones del CMS
│   ├── layout.tsx         # Fuentes + metadata global
│   ├── sitemap.ts  robots.ts  icon.svg
├── components/
│   ├── sections/          # Secciones del sitio (hero, regalos, timeline…)
│   ├── admin/             # Piezas del CMS (EntityManager, MediaUpload…)
│   ├── layout/            # Navbar, footer, WhatsApp, scroll progress
│   ├── motion/            # Reveal, Stagger, Counter, Parallax
│   └── ui/                # Primitivas (Button, Input, Accordion…)
├── lib/
│   ├── content/           # defaults.ts (fallback) + queries.ts (Supabase)
│   ├── supabase/          # Clientes (público, server, service-role) + config.ts
│   ├── admin/             # session.ts (cookie firmada) + actions.ts + tables.ts (allowlist)
│   ├── actions.ts         # Server Actions de formularios (con validación + rate limit)
│   ├── validation.ts      # Sanitización y validación de entradas
│   ├── media.ts           # Reglas de archivos subidos (tipos, tamaños, specs)
│   ├── rate-limit.ts      # Rate limiting en memoria (login y formularios)
│   ├── export-excel.ts    # Exportación del historial a Excel (sin librerías)
│   ├── log.ts             # Logging interno del servidor
│   ├── types.ts  utils.ts
└── middleware.ts          # Protección del panel (ruta secreta)
components/ui/honeypot.tsx  # Campo trampa anti-bots de los formularios
supabase/
├── schema.sql             # Tablas + RLS + Storage (ejecutar primero)
└── seed.sql               # Contenido inicial (opcional)
```

## 🗄️ Base de datos: dónde se guarda todo y sus límites

Todos los datos viven en **Supabase (PostgreSQL)**, en estas tablas:

| Tabla          | Qué guarda                                                                       |
| -------------- | -------------------------------------------------------------------------------- |
| `site_content` | Contenido por secciones en JSON (inicio, sobre mí, ajustes, beneficios, pasos)   |
| `services`     | Servicios (gestionables desde el panel)                                          |
| `gifts`        | Regalos / recursos descargables                                                  |
| `faqs`         | Preguntas frecuentes                                                             |
| `submissions`  | **Historial permanente** de formularios (contacto, llamadas, descargas)          |

Los archivos e imágenes se guardan en **Supabase Storage** (bucket `media`).

**Datos de las personas** (quien pide un regalo o deja contacto): se guardan en
`submissions`. Esta tabla **es** el historial permanente — desde el panel nunca
se borra un registro; «quitar de la bandeja» solo marca la columna `hidden`.
Es la arquitectura recomendada (soft-delete): la administradora mantiene su
bandeja ordenada sin perder nunca el respaldo, y puede exportarlo a Excel.

### Límites del plan gratuito de Supabase (y cómo escalar)

- **Almacenamiento de base de datos:** 500 MB. Para datos de texto (formularios,
  contenido) alcanza para **decenas de miles de registros**; es difícil llegar
  al límite con este uso.
- **Storage de archivos:** 1 GB. Es lo primero que se puede llenar si subís
  muchos PDFs, audios o videos pesados. Recomendación: para videos, usá el modo
  **«enlace externo»** (YouTube/Vimeo/Drive) en lugar de subir el archivo.
- **Proyecto en pausa por inactividad:** si no recibe tráfico por ~7 días, el
  plan gratuito pausa el proyecto; se reactiva solo al primer acceso (o entrando
  al panel de Supabase). Con un sitio en producción con visitas, no ocurre.
- **Transferencia:** 5 GB/mes de egreso, suficiente para un sitio de marca
  personal.
- **Escalar:** si algún día se queda corto, el salto al plan Pro (~USD 25/mes)
  multiplica todos los límites, sin cambiar una línea de código.

Rendimiento y seguridad de la base ya están cubiertos: índices en `submissions`,
**RLS** activo (el público solo lee contenido activo e inserta formularios), y
todas las escrituras pasan por el servidor con la service key.

## 🔒 Seguridad

La seguridad está implementada por capas, usando **solo recursos gratuitos**
(sin servicios de pago ni dependencias externas). A continuación, qué se
protege, cómo y dónde está en el código.

### 1. Autenticación del panel

- **Login propio usuario + contraseña**, sin Supabase Auth. Las credenciales
  viven únicamente en variables de entorno (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
  — nunca en el código ni en la base de datos. → `src/lib/admin/actions.ts`
- **Comparación en tiempo constante** de usuario y contraseña (vía HMAC), para
  no filtrar información por _timing attacks_.
- **Sesión sin estado**: una cookie `httpOnly` firmada con **HMAC-SHA256**
  (`src/lib/admin/session.ts`). No se puede falsificar sin el secreto. La
  cookie es `httpOnly` + `SameSite=Lax` + `Secure` (en producción), por lo que
  no es accesible desde JavaScript y no viaja en peticiones de otros sitios.
- **Sesión temporal por defecto, sin persistencia oculta**: sin marcar
  «Recordarme», la cookie es de **sesión** (se borra al cerrar el navegador) y
  el token se firma con vida corta (12 h); con «Recordarme» persiste 7 días.
  Al cerrar sesión la cookie se **sobrescribe vencida y se elimina**: no queda
  ningún rastro que permita reingresar de forma automática. La autenticación es
  **solo por cookie httpOnly** — no se guarda nada en `localStorage` ni
  `sessionStorage`.
- **Rate limiting del login**: máximo **5 intentos cada 15 minutos por IP**
  (`src/lib/rate-limit.ts`), para frenar ataques de fuerza bruta.
- **Panel invisible + ruta secreta**: el panel vive en una URL poco predecible
  (`ADMIN_BASE_PATH` en `src/lib/admin/config.ts`), nunca `/admin`. El
  `middleware.ts` verifica la cookie en cada request; un visitante sin sesión
  que escriba la URL a mano es **redirigido al inicio**. La URL no está
  enlazada en ninguna parte del sitio público, ni en el sitemap, ni en
  robots.txt, y el panel envía `noindex`.
- Sin registro, sin recuperación por email, una sola administradora: menos
  superficie de ataque.

### 2. Autorización y acceso a datos

- Todas las operaciones del panel pasan por **server actions** que primero
  validan la cookie de sesión (`guard()` en `src/lib/admin/actions.ts`).
- La **service key de Supabase** (que salta RLS) vive y se usa **solo en el
  servidor**; jamás se envía al navegador.
- **Allowlist de tablas y columnas** (`src/lib/admin/tables.ts`): las acciones
  genéricas de alta/edición solo aceptan tablas y columnas explícitamente
  permitidas, y cada valor pasa por su sanitizador. Un payload manipulado desde
  el navegador no puede tocar tablas ni columnas ajenas ni inyectar campos.
- **Row Level Security (RLS)** en Postgres (`supabase/schema.sql`): la clave
  pública (la única que llega al navegador) solo puede **leer contenido activo**
  e **insertar formularios**. No puede leer formularios de otras personas, ni
  actualizar, ni borrar nada.

### 3. Validación y sanitización de entradas

- **Doble validación** — en el navegador (respuesta inmediata) y de nuevo en el
  servidor (seguridad real). El servidor nunca confía en el cliente.
  → `src/lib/validation.ts`
- Límites de longitud en todos los campos, validación de formato de email, y
  **eliminación de caracteres de control** (previene datos basura y ciertos
  vectores de inyección).
- **URLs seguras**: solo se aceptan `http(s)` o rutas internas; se rechazan
  esquemas peligrosos como `javascript:` (`isSafeUrl`).
- **Protección XSS**: React escapa todo el contenido por defecto. El único
  punto con HTML crudo es el JSON-LD de SEO, que se serializa escapando
  `< > &` para que ningún contenido editable pueda romper la etiqueta
  `<script>` (`jsonLdScript` en `src/lib/utils.ts`).

### 4. Formularios públicos

- **Honeypot anti-bots**: un campo oculto (`website`) en cada formulario; si un
  bot lo completa, el envío se descarta en silencio.
  → `src/components/ui/honeypot.tsx` + `isHoneypotTripped`
- **Rate limiting**: máximo **5 envíos cada 10 minutos por IP y por tipo** de
  formulario.
- Validación de todos los campos antes de guardar; **mensajes de error siempre
  amigables**.

### 5. Subida de archivos

- **Allowlist de extensiones** (`src/lib/media.ts`): se aceptan imágenes,
  PDF, audio, video, ZIP y Office. Se **excluyen los SVG** a propósito, porque
  pueden contener scripts (XSS almacenado).
- **Límites de tamaño**: imágenes hasta **8 MB**, otros archivos hasta **25 MB**.
- Validación **en el navegador y de nuevo en el servidor** (extensión, tamaño y
  que el archivo no esté vacío).

### 6. Cabeceras de seguridad (equivalente gratuito a Helmet)

Aplicadas a todas las respuestas desde `next.config.mjs`:

| Cabecera                          | Para qué                                                                                                                                                                                                                                             |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`         | Restringe orígenes: bloquea plugins (`object-src none`), embebido en iframes ajenos (`frame-ancestors none`), secuestro de la URL base y envío de formularios a otros dominios; solo permite imágenes de Supabase/Unsplash y videos de YouTube/Vimeo |
| `X-Frame-Options: DENY`           | Anti-clickjacking (refuerza el CSP en navegadores viejos)                                                                                                                                                                                            |
| `X-Content-Type-Options: nosniff` | Evita que el navegador "adivine" tipos MIME                                                                                                                                                                                                          |
| `Referrer-Policy`                 | No filtra la URL completa a sitios externos                                                                                                                                                                                                          |
| `Permissions-Policy`              | Desactiva cámara, micrófono, geolocalización y pagos (no se usan)                                                                                                                                                                                    |
| `Strict-Transport-Security`       | Fuerza HTTPS durante 2 años                                                                                                                                                                                                                          |
| `X-XSS-Protection`                | Protección XSS legada para navegadores antiguos                                                                                                                                                                                                      |
| `poweredByHeader: false`          | No revela que el back está hecho con Next.js                                                                                                                                                                                                         |

### 7. Manejo de errores y secretos

- **Nunca se exponen errores internos** (stack traces, mensajes de Supabase) al
  usuario: se registran en el log del servidor (`src/lib/log.ts`) y al navegador
  solo llega un mensaje claro y amigable.
- **Todos los secretos por variables de entorno**; el `.env.local` está en
  `.gitignore` y jamás se sube al repositorio.
- La app **detecta si Supabase todavía tiene los valores de ejemplo**
  (`src/lib/supabase/config.ts`) y, en ese caso, muestra la guía de
  configuración en vez de intentar conectarse a una base inexistente.

### Checklist antes de publicar

- [ ] `ADMIN_USERNAME` y `ADMIN_PASSWORD` con una contraseña **larga y única**
      (no reutilizada de otro servicio).
- [ ] `ADMIN_SECRET` definido con un valor aleatorio largo (opcional pero
      recomendado; si no, la firma se deriva de la contraseña).
- [ ] Las claves de Supabase cargadas como **variables de entorno en Vercel**,
      no en el código.
- [ ] `schema.sql` ejecutado (crea las tablas **con RLS activado**).
- [ ] Verificar que el sitio se sirve **siempre por HTTPS** (Vercel lo hace solo).
- [ ] Nunca compartir ni subir la `SUPABASE_SERVICE_ROLE_KEY`.

> **Auditoría e historial de seguridad**: `SECURITY.md` (en la raíz del
> proyecto) documenta la revisión de seguridad hecha sobre el código, qué se
> corrigió, qué queda pendiente (rotar credenciales, definir `ADMIN_SECRET`) y
> cómo se verificó cada cambio. Es el registro histórico; esta sección es la
> referencia de arquitectura vigente.

## ✅ Buenas prácticas del proyecto

- Componentes pequeños, tipados y desacoplados; el CRUD del panel se genera
  con un único componente reutilizable (`EntityManager`).
- Server Components por defecto; `"use client"` solo donde hay interacción.
- Accesibilidad WCAG AA: skip-link, foco visible, labels y `aria-*` en
  formularios y carruseles, contraste alto y `prefers-reduced-motion`.
- Rendimiento: ISR, `next/image` (AVIF/WebP, lazy), `next/font` con
  `display: swap`, cliente público de Supabase sin cookies para render
  estático.

## ✒️ Tipografía de párrafos: texto justificado

Todos los párrafos largos del sitio (hero, "sobre mí", servicios, regalos,
FAQ, footer, contacto…) usan la clase `.text-justify-soft`
(`src/app/globals.css`): texto **justificado en todos los tamaños de
pantalla, incluido mobile**, con `hyphens: auto` para partir palabras largas
al final de línea cuando hace falta — así las líneas quedan parejas de borde
a borde sin dejar espacios irregulares entre palabras, incluso en columnas
angostas. La separación silábica usa el diccionario del idioma declarado en
`<html lang="es">` (`src/app/layout.tsx`), por eso corta bien en español. Para
justificar un párrafo nuevo, agregale la clase `prose-fs` (cuerpo de texto
estándar) o `text-justify-soft` directamente si necesitás otro tamaño/color.

## 🔧 Mantenimiento

- **Favicon**: reemplazar `src/app/icon.svg`.
- **Colores/tipografías**: `tailwind.config.ts` y `src/app/layout.tsx`.
- **Contenido por defecto** (lo que se ve sin base de datos): `src/lib/content/defaults.ts`.
- **Dependencias**: `npm outdated` → actualizar de a una y probar con `npm run build`.
- `next.config.mjs`: `typescript.ignoreBuildErrors` está en `false` — el
  build falla si hay errores de tipos, como debería. `eslint.ignoreDuringBuilds`
  sigue en `true` porque ESLint no está instalado ni configurado en el
  proyecto (no hay `eslint` como dependencia ni archivo de config); instalar
  `eslint-config-next` y resolver lo que encuentre es un paso pendiente
  opcional antes de poder desactivar esa bandera también.

## ☁️ Deploy en Vercel

1. Subí el proyecto a un repositorio de GitHub (el `.env.local` **no** se sube,
   está en `.gitignore` — así tus claves nunca quedan en el repo).
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importá el repo.
3. En **Environment Variables** cargá **todas** las variables de la tabla de más
   arriba (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`,
   `ADMIN_SECRET` y `NEXT_PUBLIC_SITE_URL` = tu dominio final).
4. **Deploy**. A partir de ahí el flujo es totalmente automático:

   ```bash
   git add .
   git commit -m "Mis cambios"
   git push
   ```

   Vercel detecta el push a la rama de producción (`main`), corre el build y
   publica la nueva versión sin ninguna configuración adicional. No hay
   `vercel.json` ni pasos manuales: es Next.js _zero-config_.

> **Mantené el repositorio PRIVADO.** El `README.md` y el `SECURITY.md` sí se
> versionan (para que los desarrolladores autorizados tengan la documentación),
> y el README incluye la ruta secreta del panel. La seguridad real del panel es
> el usuario + contraseña con rate limiting; la ruta secreta es una capa extra.
> Aun así, si el repo fuera público esa URL quedaría expuesta, así que
> mantenelo privado. El `.env.local` con las claves **nunca** se sube (está en
> `.gitignore`).

> Otras plataformas (Netlify, Railway, un VPS con `npm run build && npm start`)
> también funcionan: es una app Next.js estándar sin dependencias exóticas.
