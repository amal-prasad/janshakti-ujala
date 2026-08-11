-- Fact-check verdict ("सच या झूठ" desk). Nullable with no default: only
-- articles in the `fact-check` category carry one, everything else stays null.
alter table public.articles
  add column if not exists verdict text;

-- `add constraint` has no `if not exists` in Postgres — guard it so re-runs are safe.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'articles_verdict_check'
  ) then
    alter table public.articles
      add constraint articles_verdict_check
      check (verdict is null or verdict in ('true', 'false', 'misleading'));
  end if;
end $$;
