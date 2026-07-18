-- ═══════════════════════════════════════════════════════════════════
--  FS · Francis Salazar — Esquema de base de datos v5 (Supabase)
--
--  Cómo usarlo:
--  1. Crear un proyecto en https://supabase.com
--  2. Abrir el SQL Editor del proyecto
--  3. Pegar TODO este archivo y ejecutar (Run)
--  4. (Opcional) Ejecutar después supabase/seed.sql para el contenido inicial
--
--  Si venís de la versión 1 (con blog/ebooks/recursos/testimonios), este
--  script crea solo lo nuevo; las tablas viejas pueden eliminarse a mano
--  desde Table Editor cuando quieras (posts, ebooks, resources, testimonials).
-- ═══════════════════════════════════════════════════════════════════

-- ── Contenido editable por sección (Inicio, Sobre mí, Ajustes, etc.) ──
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── Regalos descargables ─────────────────────────────────────────────
create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  -- Tipo de recurso: TEXTO LIBRE (Ebook, Guía, Curso, Workbook, …)
  category text not null default 'Ebook',
  image text,
  file_url text,
  -- Enlace externo (solo para access = 'enlace')
  url text,
  -- Modo de acceso: descarga directa / pedir email / enlace externo
  access text not null default 'directo' check (access in ('directo','email','enlace')),
  -- Recurso destacado: se muestra en grande en la portada (eBook principal)
  featured boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ── Servicios (gestionables desde el panel) ──────────────────────────
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  -- Características ("qué incluye"): una por elemento del array
  features text[] not null default '{}',
  price_label text,
  cta_label text not null default 'Reservar llamada',
  icon text not null default 'Sparkles',
  image text,
  highlighted boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0
);

-- ── Preguntas frecuentes ─────────────────────────────────────────────
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  active boolean not null default true,
  sort_order int not null default 0
);

-- ── Formularios recibidos (contacto, llamadas, descargas de regalos) ──
--  Esta tabla ES el historial permanente: los registros nunca se borran
--  desde el panel. "Quitar de la bandeja" solo marca hidden = true.
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('contacto','llamada','descarga')),
  name text,
  email text not null,
  phone text,
  message text,
  meta jsonb,
  -- Estado de gestión en el panel: nuevo → leído
  status text not null default 'nuevo' check (status in ('nuevo','leido','archivado')),
  -- Oculto de la bandeja principal (soft-delete). Sigue en el historial.
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists submissions_type_idx
  on public.submissions (type, created_at desc);

-- ── updated_at automático ────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════
--  Seguridad (Row Level Security)
--
--  El panel de administración NO usa Supabase Auth: opera desde el
--  servidor con la service key (que ignora RLS). Por lo tanto, la clave
--  pública (anon) — la única que llega al navegador — solo puede:
--  · LEER contenido activo/publicado.
--  · INSERTAR formularios (submissions).
--  Nada más: sin updates, sin deletes, sin leer formularios ajenos.
-- ═══════════════════════════════════════════════════════════════════

alter table public.site_content enable row level security;
alter table public.gifts        enable row level security;
alter table public.services     enable row level security;
alter table public.faqs         enable row level security;
alter table public.submissions  enable row level security;

-- Lectura pública de contenido publicado
create policy "site_content lectura publica" on public.site_content
  for select using (true);

create policy "gifts lectura publica" on public.gifts
  for select using (active);

create policy "services lectura publica" on public.services
  for select using (active);

create policy "faqs lectura publica" on public.faqs
  for select using (active);

-- Envío público de formularios (solo insert; jamás lectura pública)
create policy "submissions insert publico" on public.submissions
  for insert with check (true);

-- ═══════════════════════════════════════════════════════════════════
--  Storage: bucket público para imágenes y archivos subidos del panel
--  (las subidas se hacen desde el servidor con la service key; el público
--   solo puede LEER los archivos)
-- ═══════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

do $$
begin
  create policy "media lectura publica" on storage.objects
    for select using (bucket_id = 'media');
exception when duplicate_object then null;
end $$;

-- ═══════════════════════════════════════════════════════════════════
--  MIGRACIÓN desde versiones anteriores (solo si YA tenías la base
--  creada). Ejecutar UNA VEZ; si la base es nueva, ignorar este bloque:
--  descomentá las líneas y ejecutalas en el SQL Editor.
-- ═══════════════════════════════════════════════════════════════════
-- Desde v2:
-- alter table public.gifts add column if not exists url text;
-- alter table public.gifts add column if not exists access text not null default 'directo';
-- alter table public.gifts drop constraint if exists gifts_category_check;
-- alter table public.gifts add constraint gifts_access_check check (access in ('directo','email','enlace'));
-- alter table public.submissions drop constraint if exists submissions_type_check;
-- alter table public.submissions add constraint submissions_type_check
--   check (type in ('contacto','llamada','newsletter','descarga'));
--
-- Desde v3 (agrega el estado de gestión de formularios):
-- alter table public.submissions add column if not exists status text not null default 'nuevo';
-- alter table public.submissions drop constraint if exists submissions_status_check;
-- alter table public.submissions add constraint submissions_status_check
--   check (status in ('nuevo','leido','archivado'));
--
-- Desde v3 (endurece RLS: el panel ya no usa Supabase Auth):
-- drop policy if exists "gifts lectura publica" on public.gifts;
-- create policy "gifts lectura publica" on public.gifts for select using (active);
-- drop policy if exists "faqs lectura publica" on public.faqs;
-- create policy "faqs lectura publica" on public.faqs for select using (active);
-- drop policy if exists "submissions lectura admin" on public.submissions;
-- drop policy if exists "submissions delete admin" on public.submissions;
-- drop policy if exists "site_content escritura admin" on public.site_content;
-- drop policy if exists "gifts escritura admin" on public.gifts;
-- drop policy if exists "faqs escritura admin" on public.faqs;
-- drop policy if exists "media escritura admin" on storage.objects;
-- drop policy if exists "media update admin" on storage.objects;
-- drop policy if exists "media delete admin" on storage.objects;

-- ═══════════════════════════════════════════════════════════════════
--  Desde v4 → v5  (EJECUTAR ESTO si ya tenías la base creada en v4)
--  Copiá y ejecutá este bloque completo en el SQL Editor de Supabase.
-- ═══════════════════════════════════════════════════════════════════
-- -- 1) Regalo destacado en la portada
-- alter table public.gifts add column if not exists featured boolean not null default false;
--
-- -- 2) Historial permanente de formularios (soft-delete)
-- alter table public.submissions add column if not exists hidden boolean not null default false;
--
-- -- 3) Se elimina el Newsletter: el tipo ya no lo admite
-- --    (si tenías registros newsletter, primero convertilos o borralos)
-- delete from public.submissions where type = 'newsletter';
-- alter table public.submissions drop constraint if exists submissions_type_check;
-- alter table public.submissions add constraint submissions_type_check
--   check (type in ('contacto','llamada','descarga'));
--
-- -- 4) Nueva tabla de Servicios (gestionable desde el panel)
-- create table if not exists public.services (
--   id uuid primary key default gen_random_uuid(),
--   title text not null,
--   description text not null default '',
--   features text[] not null default '{}',
--   price_label text,
--   cta_label text not null default 'Reservar llamada',
--   icon text not null default 'Sparkles',
--   image text,
--   highlighted boolean not null default false,
--   active boolean not null default true,
--   sort_order int not null default 0
-- );
-- alter table public.services enable row level security;
-- create policy "services lectura publica" on public.services for select using (active);
--
-- -- 5) Los servicios venían de site_content; ese registro ya no se usa
-- delete from public.site_content where key = 'services';
