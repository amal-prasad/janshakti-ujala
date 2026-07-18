-- ==== supabase/migrations/006_gallery.sql ====
-- Photo galleries. Images stored inline as a JSONB array of {url, caption} so the
-- lightbox needs no join. ponytail: jsonb over a child table; albums are small.
create table if not exists public.gallery (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  cover_image_url text,
  images          jsonb not null default '[]'::jsonb,  -- [{ "url": "...", "caption": "..." }]
  published_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create index if not exists gallery_published_idx
  on public.gallery (published_at desc);


-- ==== supabase/migrations/011_newsroom_auth.sql ====
-- /newsroom write path (see CLAUDE.md decision log, 2026-07-03).
-- profiles (reporter|editor) + articles.author_id + RLS for the authenticated role.
-- Accounts are provisioned manually in Studio: create auth user, then a profiles row.

-- Shim for plain-Postgres db:verify (embedded, no Supabase). Real Supabase already
-- has auth.users / auth.uid() / the authenticated role, so this block is a no-op there.
do $$
begin
  if not exists (select 1 from pg_namespace where nspname = 'auth') then
    create schema auth;
    create table auth.users (id uuid primary key default gen_random_uuid());
    create function auth.uid() returns uuid language sql stable as 'select null::uuid';
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end $$;

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  role         text not null check (role in ('reporter', 'editor')),
  display_name text not null,
  created_at   timestamptz not null default now()
);

alter table public.articles
  add column if not exists author_id uuid references public.profiles (id);

-- SECURITY DEFINER so policies can check the caller's role without a recursive
-- RLS lookup on profiles (mirrors the increment_poll_vote pattern in 010).
create or replace function public.is_editor()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'editor'
  );
$$;

alter table public.profiles enable row level security;

-- Staff can see all profiles (byline names in the newsroom list).
create policy "profiles staff read" on public.profiles
  for select to authenticated using (true);

-- Reporters: own rows only, and only while unpublished. Editors: everything,
-- including the is_published flip. Public anon read policy (009) is untouched.
create policy "articles staff read" on public.articles
  for select to authenticated
  using (author_id = auth.uid() or is_editor());

create policy "articles staff insert" on public.articles
  for insert to authenticated
  with check ((author_id = auth.uid() and not is_published) or is_editor());

create policy "articles staff update" on public.articles
  for update to authenticated
  using ((author_id = auth.uid() and not is_published) or is_editor())
  with check ((author_id = auth.uid() and not is_published) or is_editor());

-- Storage bucket for article images (skipped on plain Postgres — no storage schema).
do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'storage') then
    insert into storage.buckets (id, name, public)
    values ('article-images', 'article-images', true)
    on conflict (id) do nothing;

    create policy "article images public read" on storage.objects
      for select using (bucket_id = 'article-images');
    create policy "article images staff upload" on storage.objects
      for insert to authenticated
      with check (bucket_id = 'article-images');
  end if;
end $$;


-- ==== supabase/migrations/012_ads.sql ====
-- Ads managed in Supabase Studio only (no admin UI, per project rule). Public
-- read is restricted to active rows within their date window; all writes go
-- through the service role in Studio, same pattern as every other table.
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  slot text not null check (slot in ('sidebar','infeed','footer')),
  image_url text not null,
  link_url text not null,
  alt_text text not null default 'विज्ञापन',
  is_active boolean not null default false,
  starts_at date,
  ends_at date,
  created_at timestamptz not null default now()
);

alter table public.ads enable row level security;

create policy "ads public read" on public.ads for select using (
  is_active
  and (starts_at is null or starts_at <= current_date)
  and (ends_at is null or ends_at >= current_date)
);

create index if not exists ads_slot_active_idx on public.ads (slot) where is_active;


-- ==== supabase/migrations/013_article_city.sql ====
-- Dateline city for every article. Regional paper — default is the home city.
-- Existing rows get the default; the newsroom form lets reporters override it.
alter table public.articles
  add column if not exists city text not null default 'इंदौर';

