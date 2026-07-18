-- Daily horoscope. /api/cron/rashifal auto-publishes (is_published = true) after
-- programmatic sanity checks — see the route. The default false still gates any
-- row inserted by hand in Studio until flipped.
create table if not exists public.rashifal (
  id           uuid primary key default gen_random_uuid(),
  sign         text not null,                   -- zodiac slug (see src/lib/zodiacSigns.ts)
  date         date not null,
  prediction   text not null,
  lucky_number integer,
  lucky_color  text,
  is_published boolean not null default false,  -- the gate
  created_at   timestamptz not null default now(),
  unique (sign, date)
);

create index if not exists rashifal_date_pub_idx
  on public.rashifal (date desc) where is_published;
