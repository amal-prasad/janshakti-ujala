-- /newsroom delete. Mirrors "articles staff update" (011): reporters may delete
-- their own drafts only; editors may delete any row, published or not.
-- Hard delete — nothing references articles.id, so no cascade concerns.
drop policy if exists "articles staff delete" on public.articles;
create policy "articles staff delete" on public.articles
  for delete to authenticated
  using ((author_id = auth.uid() and not is_published) or is_editor());
