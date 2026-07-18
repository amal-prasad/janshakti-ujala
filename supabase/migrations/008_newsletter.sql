-- Newsletter capture (V1: store the email only; digest sending is out of scope).
-- No public read policy — writes go through /api/newsletter via the service role.
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  confirmed  boolean not null default false,
  created_at timestamptz not null default now()
);
