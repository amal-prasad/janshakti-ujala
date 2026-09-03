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
