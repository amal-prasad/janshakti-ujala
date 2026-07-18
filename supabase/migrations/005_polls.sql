-- Reader poll. One active poll at a time is typical. Votes increment a row counter
-- (atomic in Postgres); abuse-control is best-effort (localStorage + IP) in the API.
create table if not exists public.polls (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_options (
  id         uuid primary key default gen_random_uuid(),
  poll_id    uuid not null references public.polls (id) on delete cascade,
  label      text not null,
  vote_count integer not null default 0,
  sort_order integer not null default 0
);

create index if not exists poll_options_poll_idx
  on public.poll_options (poll_id, sort_order);
