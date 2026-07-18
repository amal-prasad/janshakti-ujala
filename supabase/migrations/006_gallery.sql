-- Photo galleries. Images stored inline as a JSONB array of {url, caption} so the
-- lightbox needs no join. ponytail: jsonb over a child table; albums are small.
create table if not exists public.gallery (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  cover_image_url text,
  images          jsonb not null default '[]'::jsonb,  -- [{ "url": "...", "caption": "..." }]
  published_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create index if not exists gallery_published_idx
  on public.gallery (published_at desc);
