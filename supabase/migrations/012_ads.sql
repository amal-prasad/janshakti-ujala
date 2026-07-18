-- Ads managed in Supabase Studio only (no admin UI, per project rule). Public
-- read is restricted to active rows within their date window; all writes go
-- through the service role in Studio, same pattern as every other table.
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  slot text not null check (slot in ('sidebar','infeed','footer')),
  image_url text not null,
  link_url text not null,
  alt_text text not null default 'विज्ञापन',
  is_active boolean not null default false,
  starts_at date,
  ends_at date,
  created_at timestamptz not null default now()
);

alter table public.ads enable row level security;

create policy "ads public read" on public.ads for select using (
  is_active
  and (starts_at is null or starts_at <= current_date)
  and (ends_at is null or ends_at >= current_date)
);

create index if not exists ads_slot_active_idx on public.ads (slot) where is_active;
