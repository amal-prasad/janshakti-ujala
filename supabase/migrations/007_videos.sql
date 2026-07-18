-- Video section. Embeds YouTube by id; no media is hosted by us.
create table if not exists public.videos (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  youtube_id   text not null,
  description  text,
  category     text,                            -- optional category slug
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index if not exists videos_published_idx
  on public.videos (published_at desc);
