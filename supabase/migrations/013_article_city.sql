-- Dateline city for every article. Regional paper — default is the home city.
-- Existing rows get the default; the newsroom form lets reporters override it.
alter table public.articles
  add column if not exists city text not null default 'इंदौर';
