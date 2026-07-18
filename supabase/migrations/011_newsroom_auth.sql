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
