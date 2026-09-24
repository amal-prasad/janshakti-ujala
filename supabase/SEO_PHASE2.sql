-- SEO Phase 2 cleanup — 2026-09-22. ONE-TIME PASTE BUNDLE.
--
-- Deliberately lives OUTSIDE supabase/migrations/ : scripts/verify-db.mjs globs every
-- .sql in that directory and would re-apply this as a migration. Same reasoning as
-- supabase/APPLY_015_017.sql (see CLAUDE.md decision log, 2026-09-19).
--
-- Idempotent: every statement is a filtered UPDATE/DELETE, safe to run twice.
--
-- HOW TO RUN: paste into Supabase Studio → SQL Editor. Run section 0 FIRST and read
-- the output before running anything else.

-- ---------------------------------------------------------------------------
-- 0. DRY RUN — inspect before you change anything.
-- ---------------------------------------------------------------------------
-- Everything this script retires, plus what survives. Expect 29 rows to retire and
-- 2 to remain published (the two genuine reported stories).
select slug, is_published, published_at
from public.articles
where slug like 'demo-%'
   or slug in (
     -- junk / test slugs
     'a1', 'ap', 'fb', 'cjp', 'Janshakti Ujala',
     -- generic seed articles with plausible Hindi slugs (approved 2026-09-22)
     'sansad-shiksha-vidheyak-charcha', 'kisan-sinchai-yojana',
     'monsoon-dengue-satark', 'paanch-takniki-kendra', 'nai-film-sau-crore',
     'share-bazaar-record', 'jalvayu-sammelan-bharat-bhumika',
     'rajya-chunav-gathbandhan-ranniti', 'bharat-cricket-shrinkhla-badhat',
     'sangeet-samaroh-kalakar', 'laghu-udyog-rin-yojana', 'yuva-khiladi-record'
   )
order by slug;

-- What will still be published afterwards. Read this list — it should be only the
-- articles the desk actually reported.
select slug, title
from public.articles
where is_published
  and slug not like 'demo-%'
  and slug not in (
    'a1', 'ap', 'fb', 'cjp', 'Janshakti Ujala',
    'sansad-shiksha-vidheyak-charcha', 'kisan-sinchai-yojana',
    'monsoon-dengue-satark', 'paanch-takniki-kendra', 'nai-film-sau-crore',
    'share-bazaar-record', 'jalvayu-sammelan-bharat-bhumika',
    'rajya-chunav-gathbandhan-ranniti', 'bharat-cricket-shrinkhla-badhat',
    'sangeet-samaroh-kalakar', 'laghu-udyog-rin-yojana', 'yuva-khiladi-record'
  );

-- ---------------------------------------------------------------------------
-- 1. Retire the demo/test articles.
--
-- Unpublish rather than delete: the rows stay recoverable, and the public site
-- already 404s an unpublished row via RLS. src/middleware.ts additionally returns
-- 410 Gone for these exact slugs so Google drops them from the index quickly
-- instead of retrying a 404. Keep GONE_ARTICLES in middleware.ts in sync with
-- this list.
-- ---------------------------------------------------------------------------
update public.articles
set is_published = false
where slug like 'demo-%'
   or slug in (
     'a1', 'ap', 'fb', 'cjp',
     -- Generic seed articles. Not demo-named, but not reported by the desk either.
     -- Retired on the user's explicit instruction, 2026-09-22: an indexable corpus
     -- of 29 seed articles and 2 real ones is a thin-content and trust problem.
     'sansad-shiksha-vidheyak-charcha', 'kisan-sinchai-yojana',
     'monsoon-dengue-satark', 'paanch-takniki-kendra', 'nai-film-sau-crore',
     'share-bazaar-record', 'jalvayu-sammelan-bharat-bhumika',
     'rajya-chunav-gathbandhan-ranniti', 'bharat-cricket-shrinkhla-badhat',
     'sangeet-samaroh-kalakar', 'laghu-udyog-rin-yojana', 'yuva-khiladi-record'
   );

-- ---------------------------------------------------------------------------
-- 2. Delete the malformed-slug orphan row.
--
-- slug = 'Janshakti Ujala' — a literal space. It emitted an invalid <loc> in
-- sitemap.xml (a URL may not contain a raw space) and 404s under every encoding,
-- so the row is unreachable and cannot be repaired by unpublishing. DELETE is the
-- correct call here; there is no URL at which this content was ever readable.
-- ---------------------------------------------------------------------------
delete from public.articles
where slug = 'Janshakti Ujala';

-- ---------------------------------------------------------------------------
-- 3. Clear demo rows out of the ticker.
--
-- live_news has RLS `using (true)` (009_rls_policies.sql:27-28) — every row is
-- public. The ticker renders on EVERY page, and it is what was linking the demo
-- articles sitewide. Drop the rows that point at retired articles.
-- ---------------------------------------------------------------------------
-- Derived from the articles table rather than a second hardcoded list: any ticker row
-- pointing at an article that is no longer published goes. Run this AFTER §1.
delete from public.live_news ln
where exists (
  select 1
  from public.articles a
  where not a.is_published
    and ln.source_url like '%/samachar/' || a.slug
)
   or ln.headline like 'ड्राफ्ट:%';

-- ---------------------------------------------------------------------------
-- 4. Verify.
-- ---------------------------------------------------------------------------
select count(*) as still_published_seed
from public.articles
where is_published
  and (slug like 'demo-%' or slug in (
    'a1', 'ap', 'fb', 'cjp', 'Janshakti Ujala',
    'sansad-shiksha-vidheyak-charcha', 'kisan-sinchai-yojana',
    'monsoon-dengue-satark', 'paanch-takniki-kendra', 'nai-film-sau-crore',
    'share-bazaar-record', 'jalvayu-sammelan-bharat-bhumika',
    'rajya-chunav-gathbandhan-ranniti', 'bharat-cricket-shrinkhla-badhat',
    'sangeet-samaroh-kalakar', 'laghu-udyog-rin-yojana', 'yuva-khiladi-record'
  ));
-- expect 0

select count(*) as total_published from public.articles where is_published;
-- expect 2

select count(*) as ticker_rows_to_retired_articles
from public.live_news ln
where exists (
  select 1 from public.articles a
  where not a.is_published and ln.source_url like '%/samachar/' || a.slug
);
-- expect 0

-- ---------------------------------------------------------------------------
-- AFTER THIS RUNS: the site has 2 published articles.
--
-- 29 of 31 were seed/demo content. That is the correct end state for indexation —
-- Google should not be shown a corpus that is 94% filler — but the public site will
-- look empty until the desk publishes real reporting. The homepage hero, the trending
-- rail and most category pages will render their empty states.
--
-- Surviving articles:
--   phuulon-kii-rngolii-se-bikhere-rng-kairlii-ttiim-ne-jiitaa-phlaa-inaam
--   mhilaa-eshiyaa-kp-phaainl-men-...-binaa-ttronphii-ke-mnaayaa-jshn
--
-- Nothing is deleted except the unreachable 'Janshakti Ujala' row, so any of these
-- can be brought back with:  update public.articles set is_published = true
--                            where slug = '<slug>';
-- If you do restore one, remove its slug from GONE_ARTICLES in src/middleware.ts —
-- otherwise the route keeps returning 410 and the article stays unreachable.
-- ---------------------------------------------------------------------------
