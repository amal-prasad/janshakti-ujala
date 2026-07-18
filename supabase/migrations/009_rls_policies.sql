-- Public read-only site: anon may SELECT published rows; all writes go through the
-- service role (which bypasses RLS), so there are NO anon insert/update policies.

-- Atomic view counter. SECURITY DEFINER so it can write under RLS when called with
-- the anon key from /api/articles/[slug]/views.
create or replace function public.increment_view_count(article_slug text)
returns void language sql security definer set search_path = public as $$
  update public.articles set view_count = view_count + 1
  where slug = article_slug and is_published;
$$;

alter table public.articles               enable row level security;
alter table public.live_news              enable row level security;
alter table public.epaper_editions        enable row level security;
alter table public.rashifal               enable row level security;
alter table public.polls                  enable row level security;
alter table public.poll_options           enable row level security;
alter table public.gallery                enable row level security;
alter table public.videos                 enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Published / public-visible rows only.
create policy "articles public read" on public.articles
  for select using (is_published);
create policy "live_news public read" on public.live_news
  for select using (true);
create policy "epaper public read" on public.epaper_editions
  for select using (true);
create policy "rashifal public read" on public.rashifal
  for select using (is_published);
create policy "polls public read" on public.polls
  for select using (is_active);
create policy "poll_options public read" on public.poll_options
  for select using (true);
create policy "gallery public read" on public.gallery
  for select using (true);
create policy "videos public read" on public.videos
  for select using (true);
-- newsletter_subscribers: intentionally no policy → readable/writable only by service role.
