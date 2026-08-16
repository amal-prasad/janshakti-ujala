-- State classification for the /rajya (states of India) page. Nullable —
-- most articles won't tag a state; editors set it only when relevant.
alter table public.articles
  add column if not exists state text;

create index if not exists articles_state_idx on public.articles (state) where state is not null;
