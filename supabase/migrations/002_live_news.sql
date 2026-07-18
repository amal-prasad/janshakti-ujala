-- Breaking-news ticker leads. Fed by /api/cron/ingest from GNews (headlines only).
-- These link OUT to the source; bodies are never copied into `articles`.
create table if not exists public.live_news (
  id           uuid primary key default gen_random_uuid(),
  headline     text not null,
  source_name  text,
  source_url   text not null unique,            -- dedupe key for ingestion
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index if not exists live_news_published_idx
  on public.live_news (published_at desc);
