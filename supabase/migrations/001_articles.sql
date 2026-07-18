-- Original editorial content. Authored & edited in Supabase Studio (no admin UI).
create extension if not exists "pgcrypto";

create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  dek             text,                         -- standfirst / summary
  body            text not null,                -- plain text; paragraphs split on blank lines
  category        text not null,                -- category slug (see src/lib/categories.ts)
  tags            text[] not null default '{}',
  cover_image_url text,
  author          text not null default 'जनशक्ति उजाला संवाददाता',
  reading_minutes integer not null default 1,   -- auto-filled by trigger below
  is_breaking     boolean not null default false,
  is_featured     boolean not null default false, -- eligible for the hero carousel
  is_published    boolean not null default true,
  view_count      integer not null default 0,
  published_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists articles_category_published_idx
  on public.articles (category, published_at desc) where is_published;
create index if not exists articles_published_idx
  on public.articles (published_at desc) where is_published;
create index if not exists articles_featured_idx
  on public.articles (published_at desc) where is_published and is_featured;
create index if not exists articles_tags_idx on public.articles using gin (tags);

-- Estimate reading time from Hindi word count (~200 wpm) so Studio editors never
-- have to set it by hand. ponytail: naive whitespace split; fine for prose.
create or replace function public.set_reading_minutes()
returns trigger language plpgsql as $$
declare
  words integer;
begin
  words := coalesce(array_length(regexp_split_to_array(btrim(new.body), '\s+'), 1), 0);
  new.reading_minutes := greatest(1, ceil(words / 200.0));
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_reading_minutes on public.articles;
create trigger trg_reading_minutes
  before insert or update of body on public.articles
  for each row execute function public.set_reading_minutes();
