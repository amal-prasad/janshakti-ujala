-- ePaper = a PDF uploaded to Supabase Storage + one row here (added in Studio).
-- Viewer is an <iframe> over pdf_url. No puppeteer.
create table if not exists public.epaper_editions (
  id            uuid primary key default gen_random_uuid(),
  edition_date  date not null,
  title         text not null default 'मुख्य संस्करण',
  city          text not null default 'मुख्य',
  pdf_url       text not null,                  -- Supabase Storage public URL
  thumbnail_url text,
  created_at    timestamptz not null default now(),
  unique (edition_date, city)
);

create index if not exists epaper_date_idx
  on public.epaper_editions (edition_date desc);
