-- Catch-up bundle for hosted DBs stuck at migration 013. Combines 015, 016 and
-- 017 (in that order) into one paste for the Supabase SQL editor. 014
-- (fact_check_verdict) is deliberately EXCLUDED — that feature was removed from
-- the codebase, so adding its column would be dead schema.
-- Idempotent / safe to re-run: every `create policy` below is preceded by a
-- matching `drop policy if exists` (Postgres has no `create policy if not
-- exists`), and the `alter table ... add column if not exists` / `create index
-- if not exists` statements are already idempotent as written in 016/017.

-- ===== 015_epaper_storage.sql =====
-- ePaper upload path: public-read `epaper-pdfs` bucket + editor-only writes on
-- storage objects and public.epaper_editions (see CLAUDE.md 2026-07-03/05).
-- Reuses is_editor() from 011 — do not redefine it here.

-- Shim for plain-Postgres db:verify (embedded, no Supabase). No-op on real
-- Supabase and no-op again after 011 already created it.
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

-- Table writes. The anon/public SELECT policy ("epaper public read") already
-- exists in 009 and is deliberately NOT duplicated here.
drop policy if exists "epaper editor insert" on public.epaper_editions;
create policy "epaper editor insert" on public.epaper_editions
  for insert to authenticated
  with check (public.is_editor());

drop policy if exists "epaper editor update" on public.epaper_editions;
create policy "epaper editor update" on public.epaper_editions
  for update to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists "epaper editor delete" on public.epaper_editions;
create policy "epaper editor delete" on public.epaper_editions
  for delete to authenticated
  using (public.is_editor());

-- Storage bucket for edition PDFs (skipped on plain Postgres — no storage schema).
do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'storage') then
    -- MIME + size enforced at the bucket, not just in the client form: the
    -- browser check is UX, this is the one an API caller can't skip.
    insert into storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
    values ('epaper-pdfs', 'epaper-pdfs', true, array['application/pdf'], 26214400)
    on conflict (id) do nothing;

    drop policy if exists "epaper pdfs public read" on storage.objects;
    create policy "epaper pdfs public read" on storage.objects
      for select using (bucket_id = 'epaper-pdfs');

    drop policy if exists "epaper pdfs editor upload" on storage.objects;
    create policy "epaper pdfs editor upload" on storage.objects
      for insert to authenticated
      with check (bucket_id = 'epaper-pdfs' and public.is_editor());

    drop policy if exists "epaper pdfs editor update" on storage.objects;
    create policy "epaper pdfs editor update" on storage.objects
      for update to authenticated
      using (bucket_id = 'epaper-pdfs' and public.is_editor())
      with check (bucket_id = 'epaper-pdfs' and public.is_editor());

    drop policy if exists "epaper pdfs editor delete" on storage.objects;
    create policy "epaper pdfs editor delete" on storage.objects
      for delete to authenticated
      using (bucket_id = 'epaper-pdfs' and public.is_editor());
  end if;
end $$;


-- ===== 016_article_state.sql =====
-- State classification for the /rajya (states of India) page. Nullable —
-- most articles won't tag a state; editors set it only when relevant.
alter table public.articles
  add column if not exists state text;

create index if not exists articles_state_idx on public.articles (state) where state is not null;


-- ===== 017_home_placement.sql =====
-- Homepage placement controls, editor-set from /newsroom (see decision log).
-- `is_featured`/`is_breaking` already existed (001) but were unused; this adds
-- the two missing flags for the hero slot and the trending pin.
alter table public.articles add column if not exists is_hero boolean not null default false;
alter table public.articles add column if not exists is_trending boolean not null default false;

create index if not exists articles_hero_idx on public.articles (published_at desc) where is_published and is_hero;
create index if not exists articles_trending_idx on public.articles (published_at desc) where is_published and is_trending;
create index if not exists articles_breaking_idx on public.articles (published_at desc) where is_published and is_breaking;

-- ponytail: no DB trigger stopping a reporter from setting is_hero on a draft; harmless
-- (public reads filter is_published) and the UI hides it. Add a column-level guard only
-- if reporters start abusing it.
