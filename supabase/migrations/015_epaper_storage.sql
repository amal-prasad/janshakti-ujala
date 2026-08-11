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
create policy "epaper editor insert" on public.epaper_editions
  for insert to authenticated
  with check (public.is_editor());

create policy "epaper editor update" on public.epaper_editions
  for update to authenticated
  using (public.is_editor())
  with check (public.is_editor());

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

    create policy "epaper pdfs public read" on storage.objects
      for select using (bucket_id = 'epaper-pdfs');
    create policy "epaper pdfs editor upload" on storage.objects
      for insert to authenticated
      with check (bucket_id = 'epaper-pdfs' and public.is_editor());
    create policy "epaper pdfs editor update" on storage.objects
      for update to authenticated
      using (bucket_id = 'epaper-pdfs' and public.is_editor())
      with check (bucket_id = 'epaper-pdfs' and public.is_editor());
    create policy "epaper pdfs editor delete" on storage.objects
      for delete to authenticated
      using (bucket_id = 'epaper-pdfs' and public.is_editor());
  end if;
end $$;
