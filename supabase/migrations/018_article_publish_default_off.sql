-- 2026-09-22 — SEO audit F4.
--
-- `articles.is_published` shipped as `default true` in 001_articles.sql. That default,
-- not a missing query filter, is why seed/demo rows were publicly visible: RLS gates
-- reads on `is_published` correctly (009_rls_policies.sql:23-24), but every row inserted
-- without an explicit flag was born published.
--
-- Draft-by-default is the only safe default for an editorial workflow: the newsroom
-- RLS model already assumes reporters create rows with is_published = false and only
-- editors may flip it (011_newsroom_auth.sql).
--
-- Existing rows are NOT touched — this changes the default for future inserts only.
-- Retiring the already-published seed rows is a separate, explicit operation in
-- supabase/SEO_PHASE2.sql.

alter table public.articles
  alter column is_published set default false;
