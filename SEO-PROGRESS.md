# SEO Overhaul — progress log

Live site: `https://www.janshaktiujala.in` (apex `janshaktiujala.in` → 308 → www).
Resume from this file alone. Newest phase last.

---

## Phase 0 — Setup & recon (2026-09-21) — **COMPLETE**

### Tooling status

| Thing | Status |
|---|---|
| `claude-seo` plugin | v2.2.0 installed (`agricidaniel-claude-seo`) |
| `/seo doctor`, `/seo setup` | **Do not exist in v2.2.0.** No such subcommand, no script. Use the per-API `--check` scripts instead. |
| Python | 3.12.10 OK |
| PageSpeed / CrUX API key | **MISSING** — blocks `/seo google`, Phase 1 field data, Phase 5 CWV |
| Google Search Console API | **MISSING** (no OAuth token, no service account) |
| GA4 Data API | **MISSING** |
| Backlinks | Tier 0 (Common Crawl + verify crawler only; no Moz, no Bing) |
| Search Console connected? | **UNANSWERED — ask the user** |

Credential check commands (plugin root
`~/.claude/plugins/cache/agricidaniel-claude-seo/claude-seo/2.2.0`):
`python scripts/google_auth.py --check`, `python scripts/backlinks_auth.py --check`.

### Codebase map

**Stack**: Next.js 14 App Router, source under `src/`. Supabase (anon client +
RLS for all public reads). Deployed on Vercel, region `bom1`.

**Rendering — every public route is `force-dynamic`.** No `generateStaticParams`
anywhere; no ISR. `next.config.mjs` sets `experimental.staleTimes = {dynamic: 0,
static: 0}` (added 2026-09-19 to kill a stale-homepage bug). Live responses carry
`Cache-Control: private, no-cache, no-store` and `x-vercel-cache: MISS` on every
page. Exceptions: `/rajya` and `/nirmanadhin` are default-static; `/newsroom/**`
are all `"use client"`.

| Route | File | Rendering |
|---|---|---|
| `/` | `src/app/page.tsx` | force-dynamic (:1) |
| `/samachar`, `/samachar/[slug]` | `src/app/samachar/…` | force-dynamic |
| `/shreni/[category]` | `src/app/shreni/[category]/page.tsx` | force-dynamic (:1) |
| `/rajya` | `src/app/rajya/page.tsx` | **default (static)** |
| `/rajya/[slug]` | `src/app/rajya/[slug]/page.tsx` | force-dynamic (:1) |
| `/rashifal`, `/epaper`, `/epaper/[id]`, `/gallery`, `/gallery/[slug]`, `/polls`, `/search`, `/contact`, `/hamare-bare-mein`, `/newsletter` | — | force-dynamic |
| `/nirmanadhin` | `src/app/nirmanadhin/page.tsx` | default static; `robots:{index:false,follow:false}` (:5-8) |
| `/newsroom`, `/newsroom/{login,new,edit/[id],epaper}` | — | client components, no metadata |
| `sitemap.xml` | `src/app/sitemap.ts` | force-dynamic + `revalidate = 3600` |
| `news-sitemap.xml` | `src/app/news-sitemap.xml/route.ts` | force-dynamic + `revalidate = 900` |
| `feed.xml` | `src/app/feed.xml/route.ts` | force-dynamic + `revalidate = 900` |
| `robots.txt` | `src/app/robots.ts` | — |
| `manifest.webmanifest` | `src/app/manifest.ts` | — |
| `/api/articles`, `/api/cron/rashifal`, `/api/newsletter`, `/api/polls/vote` | — | route handlers |

No `not-found.tsx`, `error.tsx`, or `loading.tsx` anywhere.

**Metadata production**
- Root defaults: `src/app/layout.tsx:36` (`metadata`), `:67` (`viewport`).
- `generateMetadata`: only `src/app/samachar/[slug]/page.tsx:16`.
- Static `metadata`: 15 other route files.
- **No metadata export**: `src/app/page.tsx` (homepage — inherits layout default,
  which is why it has no canonical) and all of `src/app/newsroom/**`.

**Base URL — the single point of failure**
- `src/app/layout.tsx:37` → `metadataBase: new URL(siteConfig.url)`.
- `src/lib/siteConfig.ts:8` →
  `url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"`.
- That is the **entire** chain. No `VERCEL_URL` anywhere in the repo.
- `NEXT_PUBLIC_SITE_URL` is present in `.env.local` but production HTML resolves to
  localhost ⇒ **the var is not set in Vercel production**.
- `siteConfig.url` also feeds: `robots.ts:12-13` (sitemap links), `sitemap.ts:34/39/45`,
  `news-sitemap.xml/route.ts:27`, `feed.xml/route.ts:21/36`, JSON-LD publisher logo and
  `mainEntityOfPage`. One var, everything downstream.

**JSON-LD** — `src/lib/utils/structuredData.ts` (escaped via `jsonLdScript()`:11)
- `NewsArticle` :22-43, injected `samachar/[slug]/page.tsx:46,51-54`. headline=title,
  image=[cover_image_url], datePublished=published_at, dateModified=updated_at,
  author=`Person{name: article.author}`, publisher=**`Organization`** (not
  NewsMediaOrganization, **no `sameAs`**) with logo `${siteConfig.url}/icon-512.png`,
  mainEntityOfPage, `inLanguage:"hi"`.
- `NewsMediaOrganization` :45-62 and `WebSite`+`SearchAction` :64-80 — **homepage only**
  (`page.tsx:47,52`).
- **No `BreadcrumbList` anywhere.**
- **No `max-image-preview` anywhere** (zero grep hits). Only `robots` override in the
  whole tree is `/nirmanadhin`.

**Article metadata** (`samachar/[slug]/page.tsx:16-39`)
- `description: article.dek ?? undefined` (:20). `dek` **is** the excerpt column —
  the byline text is sitting *in* that column in the DB. Data problem, not mapping.
- canonical `alternates.canonical` (:24), OG type article + published/modified time
  (:25-32), twitter summary_large_image (:33-37).
- No `openGraph.images` — deliberate, lets the file-convention `opengraph-image.tsx`
  win (decision log 2026-07-07).
- **No `og:locale`** on the article (homepage has it).

**Data layer / publish filtering** — `src/lib/api/*.ts`, all via
`createServerClient()` (anon). **RLS is the filter, not app code**
(`supabase/migrations/009_rls_policies.sql`):
- `articles`: `for select using (is_published)` (009:23-24). All 10 read functions
  inherit it. **No unfiltered public read path found.**
- `live_news`, `epaper_editions`, `gallery`: `using (true)` — no draft concept.
- `rashifal`: `using (is_published)`. `polls`: `using (is_active)`.
- Only admin (service-role) client in the whole app is `api/cron/rashifal/route.ts:11`,
  for writes.
- ⚠️ `articles.is_published` is **`default true`** (`001_articles.sql`). Any row inserted
  without the flag is immediately public. That is why demo rows are live.

**`articles` columns**: id, slug(unique), title, dek, body, category, tags[],
cover_image_url, author(text, default `जनशक्ति उजाला संवाददाता`), reading_minutes,
is_breaking, is_featured, is_published(default **true**), view_count, published_at,
created_at, updated_at, city(default `इंदौर`, 013), author_id→profiles(011),
state(016, geography for /rajya — *not* a workflow state), is_hero/is_trending(017).
No separate excerpt column; `dek` is it. `014_fact_check_verdict.sql` is dead
(excluded from setup.sql per decision log).

**Slugs** — `src/lib/utils/format.ts:39-46`, `slugify()` via `transliteration`,
lowercase, strips non `[a-z0-9-]`. **No length cap. No uniqueness pre-check** (only the
DB unique constraint → late raw Postgres error). `ArticleForm.tsx`: auto-derives from
title unless `slugTouched` (:67); editor can type anything, **no pattern/regex
validation**; locked once published (:46, :209); save fallback
`slug || slugify(title) || lekh-${Date.now()}` (:100).

**Images** — `next.config.mjs` `remotePatterns`: `picsum.photos`, `*.supabase.co`,
`i.ytimg.com`, `commons.wikimedia.org`, `upload.wikimedia.org`. **No `deviceSizes`,
`imageSizes`, or `formats` override.**

| Component | `sizes` | `priority` |
|---|---|---|
| `HeroCard.tsx:15-20` (homepage LCP) | `(max-width:768px) 100vw, 66vw` | yes |
| `samachar/[slug]/page.tsx:79-84` | `(max-width:768px) 100vw, 768px` | yes |
| `Header.tsx:27-32` (logo) | **none** | yes |
| `ArticleCard.tsx:15-19` | `(max-width:768px) 100vw, 33vw` | no |
| `ArticleCardSmall.tsx:24-28` | `80px` | no |
| `EpaperStrip.tsx:19-23` | `48px` | no |
| `epaper/page.tsx:34-38`, `gallery/*`, `rajya/page.tsx:38-43` | set | no |
| `Footer.tsx:11`, `nirmanadhin/page.tsx:14` | none (fixed dims) | — |

Two `priority` images above the fold on the homepage (Header logo + HeroCard).

**Fonts** — `src/app/layout.tsx:3`, `Halant` from `next/font/google`, bound to all
three CSS vars (`--font-display`/`--font-body`/`--font-hind`, :17-34), subsets
`["devanagari","latin"]`, weights 300–700, `display:"swap"`. `<html lang="hi">` at
`layout.tsx:82`. Live response preloads **5 woff2 files**. Vendored
`src/assets/fonts/NotoSansDevanagari-*.ttf` used only by the two `opengraph-image.tsx`
(Satori needs them). `src/app/fonts/Geist*.woff` are unused starter leftovers.

**Third-party scripts** — none. No analytics, no ads, no `next/script`. Inline scripts
only: font-size no-flash (`layout.tsx:84`), SW register (:103), image right-click
blocker (:104). `AdSlot` component exists (`layout.tsx:12,98`) — internals unread.

**Maintenance gate** — `src/middleware.ts:5`, `export const MAINTENANCE = false;`
(currently **OFF**, site is public). When true, everything except
`["/newsroom","/api","/_next","/logo.png","/favicon.ico"]` and `/nirmanadhin` itself is
rewritten to `/nirmanadhin`. Toggle is a const → flipping it needs a redeploy.

**Rashifal / panchang**
- `/rashifal` reads the `rashifal` DB table (`rashifal.ts:21-31`), not hardcoded.
- Panchang (`PanchangWidget.tsx`) calls **Prokerala** live at request time
  (`src/lib/api/prokerala.ts:76-134`), hardcoded Indore coords `22.7196,75.8577` (:82),
  `revalidate: 21600` (6h).
- `/api/cron/rashifal` — auth `Bearer ${CRON_SECRET}` + dev-only `?secret=` (:13-20).
  Scheduled `30 0 * * *` in `vercel.json` (06:00 IST).

**`public/` contains only `logo.png` and `sw.js`.** `icon-192.png` and `icon-512.png`
are **absent** — both 404 live. Referenced by `manifest.ts:17,20,23` and the JSON-LD
publisher logo.

### Findings — Phase 0 baseline (live-verified 2026-09-21)

| # | Sev | Evidence | Fix | Failure check | Effort |
|---|---|---|---|---|---|
| 1 | Critical | `robots.txt` live: `Sitemap: http://localhost:3000/sitemap.xml`; all 41 sitemap `<loc>` on localhost; article canonical/`og:url`/`og:image`/`twitter:image` + JSON-LD `mainEntityOfPage.@id` + publisher `logo.url` all localhost. Root: `src/lib/siteConfig.ts:8` fallback, var unset in Vercel prod | Set `NEXT_PUBLIC_SITE_URL=https://www.janshaktiujala.in` in Vercel prod; delete the localhost fallback so a missing var fails the build | `curl -s $URL/robots.txt \| grep localhost` returns nothing | S |
| 2 | Critical | Public RSS carries `ड्राफ्ट: विदेश नीति…`, `ड्राफ्ट: स्थानीय मेले…`, and junk `CJP`, `fb`, `AP`. 192 `picsum` / 30 `example.com` / 2 `REPLACE_ME` refs in homepage HTML | Unpublish + 410 the demo/test rows; ticker to real articles | Homepage HTML contains zero `picsum`/`example.com` | M |
| 3 | ~~High~~ **Resolved, not a leak** | RLS `articles for select using (is_published)` (009:23-24); no public query uses the admin client | — | — | — |
| 3b | High | `articles.is_published` is **`default true`** (`001_articles.sql`) — any row inserted without the flag is instantly public. This is *why* the demo rows are live | Change default to `false` (migration) | Insert a row with no flag → not visible anonymously | S |
| 4 | High | `/samachar/Janshakti%20Ujala` → **404** live. Either already removed or the slug differs from the reported form | Re-locate the row in the DB before writing a 301 | Row query returns the offending slug | S |
| 5 | High | Article `description` = `जनशक्ति उजाला, इंदौर`. `samachar/[slug]/page.tsx:20` reads `article.dek` — correct field, **wrong data in the DB** | Backfill `dek`; body-first-160 fallback in `generateMetadata`; require dek in `/newsroom` | No two articles share a description | M |
| 6 | High | JSON-LD `author: Person{name:"संपादक 1"}`. `articles.author` is a plain text column, default `जनशक्ति उजाला संवाददाता` | Author records + `/lekhak/<slug>` pages | Author JSON-LD has a resolvable `url` | L |
| 7 | **Critical (new)** | `/icon-192.png` and `/icon-512.png` both **404**. Referenced by `manifest.ts:17,20,23` and NewsArticle `publisher.logo.url` | Ship the two PNGs (user-supplied brand asset) | Both return 200 `image/png` | S — **blocked on user** |
| 8 | **High (new)** | Homepage has **no `<link rel="canonical">` at all** — `src/app/page.tsx` exports no metadata | Add homepage metadata with self-canonical | `curl / \| grep canonical` | S |
| 9 | **High (new)** | **No `max-image-preview:large` anywhere** (zero grep hits). Kills Discover / large-thumbnail eligibility | Add `robots` to root `layout.tsx` metadata | `curl \| grep max-image-preview` | S |
| 10 | **High (new)** | Every page: `Cache-Control: private, no-cache, no-store` + `x-vercel-cache: MISS`. Every route `force-dynamic`, no `generateStaticParams`, `staleTimes {0,0}` | Move articles to ISR + `revalidateTag` on publish. **Careful** — `force-dynamic` was the 2026-09-19 stale-homepage fix; replacing it must keep that bug fixed | `x-vercel-cache: HIT` on a repeat article fetch; publishing still updates the homepage immediately | L |
| 11 | Medium (new) | Publisher JSON-LD is `Organization`, not `NewsMediaOrganization`; **no `sameAs`**. No `BreadcrumbList` anywhere | Switch type, add `sameAs` (FB/YT/X), add BreadcrumbList to article + category | Rich Results Test shows both | S |
| 12 | Medium (new) | Article page has no `og:locale` (homepage has `hi_IN`) | Set it in root metadata so all routes inherit | `curl article \| grep og:locale` | S |
| 13 | Medium | 53 × `w=3840` in homepage HTML. `ArticleCard`/`ArticleCardSmall` *do* set `sizes`; no `deviceSizes`/`imageSizes`/`formats` in `next.config.mjs` | Add `formats:["image/avif","image/webp"]` + trim `deviceSizes`; audit which component emits 3840 | No `w=3840` on a 390px-wide render | M |
| 14 | Medium | `picsum.photos` in `next.config.mjs` `remotePatterns` | Remove once demo rows are gone | Build fails / image 400s if a picsum URL survives | S |
| 15 | Medium | No slug validation in `/newsroom`; no uniqueness pre-check → late raw Postgres unique-violation | Regex + length cap + pre-save uniqueness probe | Duplicate slug shows a Hindi field error, not a 500 | M |
| 16 | Medium | Dateline `इंदौर` hardcoded as a default: `articles.ts:7`, `ArticleForm.tsx:55,102`; `PanchangWidget.tsx:25` is permanently hardcoded (Prokerala is always queried for Indore coords) | Make city a required newsroom field; leave panchang as-is | A national story renders without an इंदौर dateline | M |
| 17 | Low | `/news-sitemap.xml` returns an **empty `<urlset>`** | **Not a bug.** Newest article is 19 Sep, today 21 Sep → outside the 48h window. Re-verify once publishing resumes | Non-empty within 48h of a publish | — |
| 18 | Low | Apex → www is **308**, not 301 | **No action.** Google treats 308 as permanent | — | — |
| 19 | Low | `/nirmanadhin` is noindexed via page metadata but **not** disallowed in `robots.ts:9` | Add to disallow list | `robots.txt` lists it | S |
| 20 | Low | `REPLACE_ME` in `src/lib/siteConfig.ts:19` (`whatsappChannel`). Only in-code placeholder — `picsum`/`example.com` have **zero** repo hits (they are DB data) | Real channel URL or drop the link | No `REPLACE_ME` in prod HTML | S — **blocked on user** |
| 21 | Low | `src/app/fonts/Geist*.woff` unused starter leftovers | Delete | — | S |

### Doc/code drift found during recon (not SEO, flagged per rule 7-adjacent)

1. **`CLAUDE.md` says the rashifal cron uses Gemini with sanity checks** (12 valid
   signs, non-empty, not byte-identical to yesterday, whole batch rejected otherwise).
   **The actual route uses Prokerala** (`api/cron/rashifal/route.ts:5,34`) and has **no
   sanity checks** — it loops all signs and upserts with unconditional
   `is_published: true` (:41, :58-61), failing only on a fetch exception (:44-49).
   Same "silent success, wrong data" class as the 2026-09-19 migration-drift incident.
   Not touched. Needs a user decision.
2. `GNEWS_API_KEY` still in `.env.local` though ingestion was dropped 2026-07-05.

### Open questions for the user

1. Is Search Console connected to `janshaktiujala.in`? Domain property or URL-prefix?
2. Set up a free Google PageSpeed/CrUX API key? Without it Phases 1 and 5 have no
   field data.
3. `icon-192.png` / `icon-512.png` are brand assets we cannot generate — supply them.
4. Rashifal cron drift (above): doc wrong, or sanity checks regressed?

### Not done in Phase 0

No code changed. No DB touched. No `/seo` audit run yet (that is Phase 1).

---
## Phase 1 — Baseline (2026-09-22)

No code changed in this phase. Live target: `https://www.janshaktiujala.in`.

### Method

- 5 drift baselines captured pre-change (`scripts/drift_baseline.py --skip-cwv`), ids 1–5:
  homepage, sample article, `/shreni/indore`, `/rashifal`, `/epaper`.
- 3 parallel sonnet workers: `claude-seo:seo-schema` (structured data), `claude-seo:seo-technical`
  (crawl/index/security/redirects), `executor-sonnet` (per-page tag tables for the 4 non-article
  page types). The E-E-A-T/trust worker died on a session rate limit; Fable ran that part directly.
- `/seo google` NOT run — no Google API credentials (`google_auth.py --check` fails). No field CWV,
  no GSC indexation data. Same blocker applies to Phase 5.

### Baseline score

**SEO health: 34/100.** Dominated by two facts: every canonical/OG/sitemap URL on the production
host points at `http://localhost:3000`, and 4 of 5 page types emit no canonical and no JSON-LD at all.

| Page type | Canonical | JSON-LD | Robots meta | Unique description |
|---|---|---|---|---|
| `/` | none | 2 blocks (Org, WebSite) | none | none (no metadata export) |
| `/samachar/[slug]` | localhost | NewsArticle | none | yes, but equals the byline text |
| `/shreni/*` | none | 0 | none | no — identical boilerplate on all 9 |
| `/rashifal` | none | 0 | none | site boilerplate |
| `/epaper`, `/epaper/<uuid>` | none | 0 | none | site boilerplate |
| `/rajya`, `/rajya/*` (36) | none | 0 | none | site boilerplate |

### Findings

| # | Sev | Evidence | Fix | Failure check | Effort |
|---|---|---|---|---|---|
| F1 | Critical | `siteConfig.ts:8` fallback `http://localhost:3000`; `NEXT_PUBLIC_SITE_URL` unset in Vercel prod. Live `/sitemap.xml`, article canonical, og:url all carry localhost | Set the env var in Vercel; **delete the fallback** so a missing var fails the build | `curl -s $LIVE/sitemap.xml` piped to `grep -c localhost` must be 0 | S |
| F2 | Critical | 36 `/rajya/<state>` pages all render the same ~4 fallback links (`demo-draft-mela`, `sansad-shiksha-vidheyak-charcha`, `kisan-sinchai-yojana`) and duplicate `/shreni/rajneeti` | Ask user: noindex state pages until real per-state content exists, or drop the fallback and render an empty state | Crawl 5 random `/rajya/*`, diff article link sets — must differ | M |
| F3 | Critical | Demo rows live and linked: `/samachar/demo-draft-videsh`, `demo-draft-mela`, `cjp`, `fb`, `ap`, `a1`. Ticker on **every page** shows `● ड्राफ्ट: स्थानीय मेले की तैयारियाँ ज़ोरों पर` | Unpublish list (user approval first), serve 410 | `/samachar` listing contains no slug matching demo-*, a1, fb, ap, cjp | S |
| F4 | Critical | `001_articles.sql`: `articles.is_published boolean` **default true** | Root cause of F3. Change default to `false`. **Schema change — reported, not patched (ground rule 7)** | Insert a row with no flag in staging; must not appear publicly | S |
| F5 | High | `/sitemap.xml` contains `<loc>http://localhost:3000/samachar/Janshakti Ujala</loc>` — literal unencoded space. URL 404s under all 3 encodings tested | Orphan DB row, slug `Janshakti Ujala`. Delete row (user approval) + add slug regex validation in `ArticleForm.tsx` (`format.ts:39` has no length cap, no charset guard) | `xmllint --noout sitemap.xml`; no `<loc>` containing whitespace | S |
| F6 | High | `samachar/[slug]/page.tsx:20` `description: article.dek` — correct mapping, but the `dek` column holds the byline string on live rows | Data problem, not code. Editorial fill + `dek` length validation in the newsroom form | Sample 10 articles; description must not be the byline alone | M |
| F7 | High | Trust surface near-empty. `/hamare-bare-mein` ≈80 words of body. `/contact` = `janshaktiujala@gmail.com` + `9009699993` only. **No postal address, no named editor, no RNI/registration, no ownership disclosure, no corrections policy, no privacy policy, no terms anywhere on the site.** Footer has 13 links, none of them policy pages | Phase 3: build Editorial Policy, Corrections Policy, Ownership/Publisher pages; name a responsible editor; add postal address + RNI. Add `address`/`founder` to NewsMediaOrganization JSON-LD | Footer links ≥4 policy pages; Org schema carries `address` | L |
| F8 | High | No security headers beyond HSTS — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP all absent | `headers()` block in `next.config.mjs` | `curl -I $LIVE` shows `x-content-type-options` | S |
| F9 | High | `/samachar`: 12 of 14 images request `w=3840`. Homepage: 53 such requests. `Header.tsx:27-32` logo has `priority` but no `sizes` → two priority images above the fold | Correct `sizes` on every `next/image`; add `deviceSizes`/`formats` to `next.config.mjs` (currently absent) | No `_next/image` request with `w=3840` on a mobile viewport | M |
| F10 | High | `/newsroom` returns 200 with the root layout shell and **no robots meta**. robots.txt Disallow blocks crawling, not indexing | Add `robots: { index: false, follow: false }` to the newsroom layout (explicitly permitted by the brief) | `/newsroom` HTML contains `noindex` | S |
| F11 | Medium | Only the article page emits any canonical. `/`, `/samachar`, `/shreni/*`, `/rajya`, `/rashifal`, `/epaper`, `/epaper/<uuid>` have none. Homepage has no `metadata` export at all (`app/page.tsx`) | Add `alternates.canonical` per route; add a homepage `metadata` export | drift_compare on all 5 baselines: `canonical` non-null | M |
| F12 | Medium | No `BreadcrumbList` anywhere (`structuredData.ts` has 3 builders, none is breadcrumb). No `max-image-preview:large` anywhere in the repo | Add BreadcrumbList to article + category; add `robots.max-image-preview` to root metadata | Rich Results Test shows Breadcrumb on an article URL | M |
| F13 | Medium | Article/homepage schema declare the publisher as separate inline objects — no shared `@id` | Reuse `https://www.janshaktiujala.in/#organization` as the single Org node; `publisher` becomes a reference | Org node appears once per page, referenced elsewhere | S |
| F14 | Medium | `http://janshaktiujala.in/` = 2-hop chain (http apex → https apex → https www). Apex→www is 308 (fine, Google treats as permanent) | Collapse to one hop at the DNS/Vercel level | `curl -sIL http://janshaktiujala.in` shows 2 status lines | S |
| F15 | Medium | `/epaper/<uuid>` is indexable, no canonical, no robots meta. UUID URLs are not useful search targets | Decide: canonical to `/epaper`, or noindex the detail pages | — | S |
| F16 | Medium | `EpaperStrip.tsx:9` takes the newest edition by `edition_date desc`, not today's. Homepage of 22 सितंबर shows a 2 सितंबर edition with no staleness label | Label it "नवीनतम संस्करण" rather than implying today | — | S |
| F17 | Medium | All 9 `/shreni/*` pages share one generic meta description | Per-category description in `generateMetadata` | 9 categories → 9 distinct descriptions | S |
| F18 | Low | `/rajya/madhya-pradesh` title renders `"मध्य प्रदेश की खबरें उजाला"` (malformed template join) | Fix the title template | — | S |
| F19 | Low | `sitemap.ts:16-23` has 8 static routes. `/rajya`, all 36 `/rajya/*`, and all 9 `/shreni/*` are absent | Add category + state routes (after F2 is resolved — do not submit duplicate pages) | Sitemap URL count > 50 | S |
| F20 | Low | `siteConfig.ts:19` `whatsappChannel: "https://whatsapp.com/channel/REPLACE_ME"` — live on every page as "हमारे व्हाट्सएप चैनल से जुड़ें" | Real URL or remove the link | No `REPLACE_ME` in rendered HTML | S |
| F21 | Low | `manifest.ts:17,20,23` reference `/icon-192.png` and `/icon-512.png`; both 404. `public/` holds only `logo.png` and `sw.js` | User must supply brand assets. Blocks PWA installability and the JSON-LD publisher logo | Both URLs return 200 | S |

### Reconciliation against the user's 11 pre-supplied issues

| User's issue | Status |
|---|---|
| 1 localhost canonical/og | **Confirmed** → F1, root cause found (`siteConfig.ts:8`) |
| 2 demo/test content live | **Confirmed** → F3, and it is in the sitewide ticker, not only `/samachar` |
| 3 draft leakage | **Downgraded — not an RLS hole.** `009_rls_policies.sql:23-24` gates `articles` on `is_published`; no public path uses the admin client. Real cause is the `default true` in `001_articles.sql` → F4 |
| 4 broken slug `/samachar/Janshakti Ujala` | **Confirmed** → F5. The DB row exists; the URL 404s because of the space |
| 5 meta description = byline | **Confirmed, but it is a data problem** → F6. The code mapping is correct |
| 6 placeholder bylines | Confirmed, same data-fill workstream as F6 |
| 7 `w=3840` images | **Confirmed** → F9, worse than reported (53 on homepage) |
| 8 garbled long slugs | Confirmed → F5 (same missing validation) |
| 9 thin trust surface | **Confirmed and worse** → F7. No address, no editor, no policy pages at all |
| 10 epaper card date | **Confirmed** → F16, root cause is "newest" not "today" |
| 11 default "इंदौर" dateline | Confirmed (`articles.ts:7`, `ArticleForm.tsx:55,102`). Low SEO impact; editorial accuracy issue |
| verify: apex→www 301 | It is **308**, not 301. Fine. But `http://` apex is a 2-hop chain → F14 |
| verify: homepage H1 | Sensible — H1 is the lead headline |
| verify: JSON-LD/robots/sitemaps exist | Exist, but carry localhost URLs and cover 4 of ~12 page types |

### Found by the audit, NOT in the user's list

- **F2 — 36 duplicate `/rajya/*` pages.** Biggest indexation liability found. Not in the user's list.
- **F4** — the `default true` schema flaw behind issues 2 and 3.
- **F8** — zero security headers.
- **F10** — `/newsroom` is indexable despite the robots.txt Disallow.
- **F11/F12/F13** — canonical and schema coverage gaps across every non-article page type.
- **F15/F17/F19/F20** — epaper detail indexation, duplicate category descriptions, missing sitemap
  routes, live `REPLACE_ME` link.
- **`/rashifal` is NOT a placeholder** (the brief assumed it was). It serves real distinct per-sign
  Hindi content — but all 12 signs live on one URL. Relevant to the Phase 4 URL design decision.
- **Empty `/news-sitemap.xml` is correct**, not a bug: newest article is 19 Sep, outside the 48h window.

### Pending decisions (blocking Phase 2)

1. **F3/F5 — approve the unpublish + 410 list**: `demo-draft-videsh`, `demo-draft-mela`, `cjp`, `fb`,
   `ap`, `a1`, plus the `Janshakti Ujala` orphan row. No DB row is touched without a yes.
2. **F2 — `/rajya/*`**: noindex the 36 state pages until they carry real content, or remove the
   fallback article list?
3. **F4** — schema change to `is_published default false`. Reported, not patched, per ground rule 7.
4. Still unanswered from Phase 0: GSC connected? PageSpeed/CrUX key? icon PNGs? rashifal cron drift?

---
## Phase 2 — Fix blockers 1–6 (2026-09-22)

User approved the pending decisions from Phase 1. Code changed; **nothing applied to the
hosted DB yet** — the SQL is written and waiting for an operator paste (see "Operator steps").

### Corrections to the Phase 1 findings table

Two Phase 1 findings were verified before acting on them and turned out to be **wrong**.
Recorded here rather than silently dropped.

- **F2 — WITHDRAWN (false positive).** The claim was that all 36 `/rajya/<state>` pages render
  the same fallback article set. They do not. `getArticles()` filters correctly
  (`articles.ts:77`, `.eq("state", state)`), and `rajya/[slug]/page.tsx:27-30` already has a
  real empty state. Live check: `/rajya/bihar` and `/rajya/kerala` render
  "…अभी कोई खबर प्रकाशित नहीं है।"; `/rajya/madhya-pradesh` renders its one real article.
  The repeated demo links the audit saw were the **sitewide ticker** (`live_news`), which is
  page chrome, not page content. The agent counted every `/samachar/` href on the page.
- **F18 — WITHDRAWN (false positive).** `/rajya/madhya-pradesh` renders
  `<title>मध्य प्रदेश की खबरें | जनशक्ति उजाला</title>`. Correct. The reported malformed
  string did not reproduce.
- **NEW, replacing F2 — F22 (Medium): the ticker was the sitewide demo-content vector.**
  `live_news` has RLS `using (true)` and renders on every page; it carried the
  `ड्राफ्ट: स्थानीय मेले…` lead and linked `/samachar/demo-draft-mela` and
  `/samachar/demo-sansad-satr` from every URL on the site. Handled in `SEO_PHASE2.sql` §3.
- **NEW — F23 (High, needs an editorial decision, NOT actioned): the site is ~94% seed content.**
  31 articles are published. 16 are unambiguous demo/junk (handled below). Of the remaining 15,
  only two look like original reporting (`phuulon-kii-rngolii-…`, `mhilaa-eshiyaa-kp-…`).
  The other 12 are generic national-news seed rows with plausible Hindi slugs. Not touched —
  see "Needs your decision".

### What was fixed

| Finding | File | Change |
|---|---|---|
| F1 | `src/lib/siteConfig.ts` | `url` no longer falls back to localhost in production. Falls back to `https://www.janshaktiujala.in` when `NODE_ENV === "production"`, localhost only in dev. One var still feeds every canonical, og:url, sitemap, robots.txt and JSON-LD — but it can no longer leak localhost into the public discovery surface. |
| F3, F22 | `supabase/SEO_PHASE2.sql` (new) | One-time paste bundle. §0 dry-run select, §1 unpublish `demo-*` + `a1`/`ap`/`fb`/`cjp`, §2 delete the `Janshakti Ujala` orphan row, §3 delete the demo rows out of `live_news`, §4 verification selects. Idempotent. Deliberately **outside** `supabase/migrations/` — `scripts/verify-db.mjs` globs that directory and would re-apply it (same reasoning as `APPLY_015_017.sql`, decision log 2026-09-19). |
| F3 | `src/middleware.ts` | `GONE_ARTICLES` set → `410 Gone` for the 17 retired slugs. Unpublishing alone only ever yields a 404; 410 tells Google the URL is permanently gone and drops it from the index faster. `decodeURIComponent` is wrapped in try/catch — middleware runs on every request, so a malformed `%`-sequence in a URL would otherwise 500 the entire site. |
| F4 | `supabase/migrations/018_article_publish_default_off.sql` (new) | `articles.is_published` default `true` → `false`. Existing rows untouched. |
| F4 | `supabase/setup.sql`, `supabase/seed.sql` | Kept in sync with 018 (a stale `setup.sql` is what caused the 2026-09-19 drift incident). Both seed blocks omit `is_published`, so after 018 a fresh dev DB seeded to 0 published articles — caught by `npm run db:verify` printing `published: 0`. Fixed by scoping the old default to the seed insert only (`set default true` before the block, `set default false` after). No existing row's flag is touched. |
| F5 | `src/lib/utils/format.ts` | `slugify()` capped at 80 chars, truncating on a `-` boundary; the optional suffix is appended after the cap so it always survives. New `isValidSlug()` (`^[a-z0-9]+(-[a-z0-9]+)*$`, 3–80) is the single source of the regex. |
| F5 | `src/components/newsroom/ArticleForm.tsx` | Save is blocked on an invalid slug, validated **before** the save-time fallback chain so a typed bad slug can't slip through. Hindi error: `स्लग अमान्य है — केवल छोटे अंग्रेज़ी अक्षर, अंक और हाइफ़न, 3 से 80 अक्षरों में।` |
| F6 | `src/components/newsroom/ArticleForm.tsx` | `dek` now required, 40–200 chars. Hindi error: `डेक 40 से 200 अक्षरों के बीच होना चाहिए।` Validation only — no auto-generation, no AI, no editorial rewriting. |
| F5/F6 | `scripts/test-utils.mts` | Extended the existing self-check (`npm run test:utils`): 200-char Hindi title caps to ≤80 with no trailing dash; the cap preserves a 4-char suffix; `isValidSlug` rejects `ap` (too short), an 81-char string, and the literal live bad row `Janshakti Ujala`. |

### Verification run

- `npx tsc --noEmit` → `TypeScript: No errors found`
- `npm run test:utils` → `OK: utils self-check passed`
- `npm run db:verify` → all 18 migrations + seed applied; `articles: 12, published: 12`
  (was `published: 0` before the seed fix — the check caught a real regression)
- `npm run build` → succeeded, middleware 27.1 kB, all routes built

### Operator steps (nothing below has been run — hosted DB untouched)

1. **Vercel env var**: set `NEXT_PUBLIC_SITE_URL=https://www.janshaktiujala.in` on the
   production environment. The code fallback now covers this, but the env var stays the
   intended source of truth and is what preview deployments need.
2. **Supabase Studio → SQL Editor**: paste
   `supabase/migrations/018_article_publish_default_off.sql`.
3. **Supabase Studio → SQL Editor**: paste `supabase/SEO_PHASE2.sql`. Run §0 first and read
   the output before running §1–§3.
4. Deploy. Then re-check: `curl -s https://www.janshaktiujala.in/sitemap.xml | grep -c localhost`
   must be `0`, and `/samachar/demo-draft-mela` must return `410`.

### Needs your decision (F23)

12 published rows are generic seed articles with plausible Hindi slugs — not obviously demo
by name, so I did not touch them:

`sansad-shiksha-vidheyak-charcha`, `kisan-sinchai-yojana`, `monsoon-dengue-satark`,
`paanch-takniki-kendra`, `nai-film-sau-crore`, `share-bazaar-record`,
`jalvayu-sammelan-bharat-bhumika`, `rajya-chunav-gathbandhan-ranniti`,
`bharat-cricket-shrinkhla-badhat`, `sangeet-samaroh-kalakar`, `laghu-udyog-rin-yojana`,
`yuva-khiladi-record`

Retire them too, or keep them? A news site whose indexable corpus is 29 seed articles and 2
real ones is a thin-content and trust problem that no amount of metadata work fixes.

### Deferred (not Phase 2 scope)

- 35 of 36 `/rajya/*` pages are legitimately empty. Thin, but not duplicates and not in the
  sitemap. Noindex-when-empty belongs in Phase 6 (discovery), not here.
- F7 trust surface → Phase 3. F8 security headers, F9 images → Phase 5.
  F10–F17, F19–F21 → Phases 3/5/6.
- Still unanswered from Phase 0: GSC connected? PageSpeed/CrUX key? `icon-192/512.png` brand
  assets? rashifal cron doc/code drift?

---
### Phase 2 amendment (2026-09-22, same day) — F23 resolved: all 12 retired

User approved retiring the 12 generic seed articles ("retire those 12 too"). The
"Needs your decision (F23)" section above is **closed**; those 12 slugs are now
handled exactly like the demo rows.

- `supabase/SEO_PHASE2.sql` — §0 rewritten as two dry-run selects (what retires:
  expect 29; what survives: expect 2). §1 covers the 12. §3 no longer carries a
  second hardcoded slug list — it deletes any `live_news` row whose `source_url`
  points at an article that is not published, so it stays correct if the list
  changes. §4 adds `total_published` (expect 2) and
  `ticker_rows_to_retired_articles` (expect 0).
- `src/middleware.ts` — `GONE_ARTICLES` grows from 17 to 29 slugs.
- Re-verified after the edit: `npx tsc --noEmit` → no errors;
  `npm run build` → succeeded, middleware 27.3 kB.

**Consequence the operator must expect:** after `SEO_PHASE2.sql` runs, the site has
**2 published articles**. 29 of 31 were seed content. That is the right end state for
indexation — Google should not be shown a corpus that is 94% filler — but the homepage
hero, trending rail and most category pages will render their empty states until the
desk publishes real reporting. Nothing is deleted except the unreachable
`Janshakti Ujala` row, so any row can be restored with
`update public.articles set is_published = true where slug = '<slug>';` — and its slug
must then be removed from `GONE_ARTICLES` in `src/middleware.ts`, or the route keeps
returning 410.

---

## Phase 3 — News fundamentals / trust surface (2026-09-22)

### Findings

| Sev | Finding | Evidence | Fix | Failure check | Effort |
|---|---|---|---|---|---|
| Critical | F7 — no trust surface at all. A YMYL news site with no editorial policy, no corrections policy, no named accountable person and no postal address. | Only `/hamare-bare-mein` + `/contact` existed; `Footer.tsx` linked nothing else | Three new routes: `/sampadakiya-niti`, `/sanshodhan-niti`, `/prakashak` + footer links + sitemap entries | `curl -s <site>/sampadakiya-niti \| grep -c संपादकीय` > 0 | M |
| High | F24 — `NewsMediaOrganization` carried only name/url/logo/sameAs. No `ethicsPolicy`, `correctionsPolicy`, `ownershipFundingInfo`, `address`, `email`, `telephone` — the exact fields Google's publisher guidance reads. | `structuredData.ts:buildOrganizationSchema` | Added all of the above; identity fields emit only when supplied | Rich Results Test on `/` shows `correctionsPolicy` | S |
| High | F25 — dateline defaulted to इंदौर. Every story filed from outside Indore was stamped Indore. | `ArticleForm.tsx:55` `useState(article?.city ?? "इंदौर")`, `:115` `city.trim() \|\| "इंदौर"` | Field is now empty by default and `required`; the desk must type the real place | Publish a Bhopal story, confirm the dateline reads भोपाल | S |
| High | F26 — publisher identity is unknown to the codebase. Editor name, legal name, postal address, RNI number, grievance officer do not exist anywhere in the repo. | grep: no address/RNI/editor string in `src/` | **Not fixable by me.** Added `siteConfig.publisher` with empty fields; pages and schema drop empty fields rather than print a placeholder | `/prakashak` renders a `प्रकाशक` row | — |
| Medium | F27 — bylines are placeholder account names (`ap`, `Sonam`, `संपादक 1`) and there are no author pages. `NewsArticle.author` is a bare `Person` with no `url`. | `ArticleForm.tsx:118` `author: profile.display_name` | **Not fixed.** Needs a decision — see below | — | — |
| Low | F28 — article `description` fell through to the byline for rows with no dek. | `samachar/[slug]/page.tsx:20` `article.dek ?? undefined` | Already fixed upstream in Phase 2: dek is now required, 40–200 chars. Legacy rows keep the old description until re-edited | — | — |

### What was fixed

| File | Change |
|---|---|
| `src/app/sampadakiya-niti/page.tsx` (new) | Editorial policy: story selection, verification and sourcing, bylines/datelines, advertising separation, conflicts of interest, AI use. Every clause is a statement about process, which can be written truthfully. |
| `src/app/sanshodhan-niti/page.tsx` (new) | Corrections policy: how to report an error, 36h acknowledgement / 7-day decision, corrections logged on the article, no silent deletions, escalation to the Press Council of India. |
| `src/app/prakashak/page.tsx` (new) | Ownership & publisher. Renders only the `siteConfig.publisher` fields that are filled; contact block and funding-independence statement always render. |
| `src/components/layout/Footer.tsx` | Links the three new pages sitewide. |
| `src/app/sitemap.ts` | Added the three, plus `/hamare-bare-mein` — which had never been in the sitemap. |
| `src/lib/siteConfig.ts` | New `publisher` block. Empty string = "not supplied"; nothing is invented. |
| `src/lib/utils/structuredData.ts` | `NewsMediaOrganization` gains `ethicsPolicy`, `correctionsPolicy`, `ownershipFundingInfo`, `email`, `telephone`, `inLanguage`, and `alternateName`/`foundingDate`/`address` when supplied. |
| `src/components/newsroom/ArticleForm.tsx` | Dateline no longer defaults to इंदौर; the field is required. |

Verified: `npx tsc --noEmit` → no errors. `npm run build` → succeeded; `/prakashak`,
`/sampadakiya-niti`, `/sanshodhan-niti` all build at 182 B.

### Needs your decision

1. **Publisher facts (F26) — blocking.** Fill these in `src/lib/siteConfig.ts` →
   `publisher`. I will not write them myself; a news site inventing its own editor's
   name or address is exactly the failure this phase exists to fix.
   - `legalName` — registered or trading name of the publisher
   - `editorInChief` — the named person responsible for content
   - `grievanceOfficer` + `grievanceEmail` — the IT Rules 2021 grievance contact
   - `addressLine`, `postalCode` — the office postal address
   - `rniNumber` — only if a print edition is registered; leave empty otherwise
   - `foundingYear`
2. **Bylines (F27).** `author` is whatever the reporter's newsroom display name is,
   so live articles read `ap` / `Sonam`. Two options: (a) fix the `display_name`
   values in `profiles` — zero code, works immediately; (b) also build `/lekhak/<slug>`
   author pages with a bio, and point `NewsArticle.author.url` at them — real E-E-A-T
   weight, but it is a new public route and there are currently 2 published articles.
   Recommend (a) now, (b) once the desk is publishing regularly.
3. `/hamare-bare-mein` still carries a `ponytail:` comment from P0 warning that its
   copy is placeholder. Nothing in it is a checkable claim (no dates, no names), so I
   left it. Say the word if you want it rewritten against the real founding story.

### Deferred

F8 security headers, F9 images, performance → Phase 5. Author pages → pending (2).
Still unanswered from Phase 0: GSC connected? PageSpeed/CrUX key? `icon-192/512.png`
brand assets? rashifal cron doc/code drift?

---

## Phase 4 — Third-party API content: rashifal + panchang (2026-09-22)

### Findings

| Sev | Finding | Evidence | Fix | Failure check | Effort |
|---|---|---|---|---|---|
| High | F29 — the sitewide पंचांग strip was computed for **Lucknow**, not Indore. Sunrise/sunset were ~20 minutes wrong for every reader, every day, on the homepage of an Indore paper. | `src/lib/panchang.ts:27-29` `LAT = 26.85; LNG = 80.95` | Retargeted to Indore (22.7196, 75.8577) | Compare the strip's सूर्योदय against any Indore almanac; must agree within a minute | S |
| High | F30 — **two panchang systems on the same page, disagreeing.** `PanchangStrip` (local `mhah-panchang` calc, Lucknow) and `PanchangWidget` (Prokerala API, Indore) both rendered on the homepage. Two different tithi/sunrise values under two headings that both say "आज का पंचांग". | `page.tsx:32,42` vs `Sidebar.tsx:53` | Deleted `PanchangWidget.tsx` and `getDailyPanchang()`/`PanchangData` from `prokerala.ts`. The local calculation is the single source: no API call, no quota, no latency, no key. | `grep -r PanchangWidget src/` returns nothing; one पंचांग block per page | S |
| High | F31 — `/rashifal` rendered **the latest date in the table, not today**. A failed cron left old predictions live under the heading "आज का राशिफल" indefinitely, with no date on the page for a reader to check against. Live right now: the page serves *seed* rows (they carry शुभ अंक/शुभ रंग, which the Prokerala cron never writes — it sets both to `null`), so the cron has never successfully published. | `src/lib/api/rashifal.ts` `.order("date",{ascending:false}).limit(12)`; live fetch of `/rashifal` on 2026-09-22 shows lucky numbers | Query is now `.eq("date", istToday())`. Empty result renders "आज का राशिफल अभी उपलब्ध नहीं है" instead of stale content. Same fix applied to the homepage sidebar teaser. | Page shows today's IST date; if the cron fails, the page says unavailable rather than showing yesterday | S |
| High | F32 — the cron could publish **demo-dated and placeholder content as today's horoscope**, unconditionally, with `is_published: true`. Three separate paths: (a) on a sandbox-plan error it silently refetched `2026-01-01` and stored it as today; (b) an empty API response fell through to the literal string `"राशिफल उपलब्ध नहीं है।"`, which was then published as that sign's prediction; (c) no batch-level checks at all, contradicting the CLAUDE.md hard rule that says there are. | `prokerala.ts` sandbox retry + `|| "राशिफल उपलब्ध नहीं है।"`; `api/cron/rashifal/route.ts` `is_published: true` | (a) sandbox retry now throws unless `PROKERALA_SANDBOX=1` (non-prod opt-in); (b) empty/<20-char response throws; (c) cron rejects the **whole batch** if it is not 12 signs, or if every sign is byte-identical to yesterday | Hit the cron with a sandbox key → 502 with a named reason, and no rows written | M |
| Medium | F33 — `/rashifal` had no canonical and no visible date. | live fetch: `<link rel="canonical">` absent | Added `alternates.canonical` + a rendered IST date line | `curl -s <site>/rashifal \| grep canonical` | S |
| Medium | F34 — syndicated third-party content presented with no disclosure. The predictions are verbatim vendor output, identical across every Prokerala customer; the page read as though it were the paper's own. | `/rashifal` body, live | Added a source-and-limits note at the foot of the page: externally sourced, not editorial reporting, not medical/legal/financial advice | Note renders below the grid | S |
| Info | F35 — per-sign URLs (`/rashifal/mesh` etc.) **deliberately not built.** They would rank for "मेष राशिफल" only if the text were distinctive; it is vendor-syndicated and byte-identical to every competitor's, so 12 new URLs would be 12 thin duplicate pages. Revisit only if the desk writes its own predictions. | — | not built | — | — |

### What was fixed

| File | Change |
|---|---|
| `src/lib/panchang.ts` | Reference point Lucknow → Indore. |
| `src/components/news/PanchangWidget.tsx` | **Deleted.** |
| `src/components/news/Sidebar.tsx` | Widget import + render removed. |
| `src/lib/api/prokerala.ts` | `getDailyPanchang`/`PanchangData` deleted. Sandbox-date retry now requires `PROKERALA_SANDBOX=1`. Empty/short horoscope throws instead of returning a placeholder string. |
| `src/lib/api/rashifal.ts` | New `istToday()`; both the listing and the sidebar teaser scoped to today's date. |
| `src/app/api/cron/rashifal/route.ts` | Batch sanity checks before upsert: 12 signs required; whole batch rejected if identical to yesterday. |
| `src/app/rashifal/page.tsx` | Canonical, visible IST date, honest empty state, third-party disclosure note. |

Verified: `npx tsc --noEmit` → no errors. `npm run build` → succeeded, `/rashifal` at 146 B.

### Needs your decision

1. **The CLAUDE.md drift is now half-closed.** The hard rule said "Gemini cron with sanity checks"; the code was Prokerala with none. The sanity checks now exist, so the rule is true again — but the *provider* is still Prokerala, not Gemini. Confirm Prokerala is the intended provider and I will correct the rule's wording; if Gemini was intended, that is a rewrite of the cron, not a doc edit.
2. **Is the Prokerala account on a paid plan?** If it is still sandbox, the cron will now fail loudly (502) instead of quietly publishing January's horoscope every day. That is the correct behaviour, but it means `/rashifal` shows "अभी उपलब्ध नहीं है" until the plan is upgraded. Tell me if you would rather keep the old behaviour in the interim.
3. `/rashifal` is in the sitemap at priority 0.8 — higher than any category page. For syndicated content that cannot rank, 0.5 is more honest. Say the word and I will drop it.

### Deferred

Per-sign rashifal URLs (F35) — only if the predictions become original. Performance of
the `/rashifal` force-dynamic render → Phase 5.

---

## Phase 5 — Performance / Core Web Vitals (2026-09-22)

Measured against the deployed site on an emulated mid-range Android (412×915, DPR 2.625),
**Slow 4G, 4× CPU throttle** — the stated target profile.

**Baseline (live, before this phase):**

| Metric | Homepage | Target | Verdict |
|---|---|---|---|
| LCP | **3488 ms** | < 2500 ms | FAIL |
| — TTFB | **2777 ms** (80% of LCP) | — | root cause |
| — load delay / load / render delay | 364 / 1 / 346 ms | — | fine |
| CLS | **0.00** | < 0.1 | PASS |
| INP | not measurable from a load trace | < 200 ms | unverified |

The LCP resource itself downloads in **1 ms**. The page is not slow because of images,
JavaScript or fonts-blocking-render; it is slow because the server takes 2.8 seconds to
send the first byte. Chrome's own `DocumentLatency` insight puts the available saving at
**2675 ms of LCP**.

Field data: CrUX returns **no data for this origin** — not enough real traffic yet. Field
verification of all of this stays blocked until the site has readers.

### Findings

| Sev | Finding | Evidence | Fix | Failure check | Effort |
|---|---|---|---|---|---|
| Critical | F36 — **every public route was served `Cache-Control: private, no-cache, no-store, must-revalidate` with `x-vercel-cache: MISS`.** Nothing was ever cached at the CDN, so every reader paid a full server render plus Supabase round-trip. Two causes, both sitewide: `export const dynamic = "force-dynamic"` in the **root layout** (which applies to every route beneath it), and an unconditional `headers().get("x-maintenance")` in that layout — reading headers opts the entire app out of static rendering, and it ran on every request even though `MAINTENANCE` is a build-time `false`. | live `curl`: `x-vercel-cache: MISS`, TTFB 4786 ms (home) / 2117 ms (article); trace TTFB 2777 ms; `layout.tsx:1` + `:78` | `MAINTENANCE` moved to `siteConfig` and checked **first**, so `headers()` short-circuits away when the gate is off; `force-dynamic` removed from the layout and replaced on 13 public routes with `revalidate` (60s news, 300s gallery/ePaper, 3600s static prose). `/search` and `/polls` stay dynamic. | Build route table now marks `/`, `/rashifal`, `/samachar`, `/epaper`, `/gallery`, `/contact`, `/hamare-bare-mein` as ○ Static — previously all ƒ. **After deploy:** `curl -sI <site>/` twice must show `s-maxage=60, stale-while-revalidate` and `x-vercel-cache: HIT` on the second call. If it still says `MISS`/`no-store`, something in the tree is reading headers or cookies again. | M |
| High | F37 — **10 preloaded woff2 files, ~244 kB, on every page.** `layout.tsx` declared `Halant` **three separate times** (`--font-display`, `--font-body`, `--font-hind`) for the identical family, at 5 weights × 2 subsets. Devanagari faces are ~39 kB each. Two of the five weights (300, 500) are used **zero** times in the codebase. | `ls .next/static/media` = 10 `.p.woff2` / 244 kB; live HTML had 8 `rel="preload"` links; `grep -c font-light/font-medium` = 0 | One `Halant()` call, weights `400/600/700` (the only ones used: `font-normal`, `font-semibold`×55, `font-bold`×45). Tailwind's `display`/`body`/`hind` families all point at `--font-display`, so no template changed. | `ls .next/static/media/*.p.woff2` → **6 files, 156 kB** (was 10 / 244 kB). Headlines must still render bold — a missing 700 shows as flat text. | S |
| Low | F38 — the house-ad `<img>` in `AdSlot` had no reserved space. No ads are live so CLS is currently 0.00, but the first ad served above the fold would shift the article under it. | `AdSlot.tsx:23` — plain `<img className="w-full">`, no width/height | Wrapped in an `aspect-[8/1]` box with `object-cover`. | CLS stays 0.00 after the first real ad goes live. | S |
| Info | F39 — **images and data fetching were already correct** and needed nothing. `HeroCard`/`ArticleCard` use `fill` + `sizes` inside fixed `aspect-[16/9]` boxes, the masthead and hero carry `priority`, and the homepage already `Promise.all`s its eight queries rather than waterfalling them. This is why CLS is 0.00 and LCP load duration is 1 ms. | `HeroCard.tsx:13-20`, `page.tsx:15-25`, trace CLS 0.00 | none | — | — |
| Info | F40 — `next.config.mjs` sets `experimental.staleTimes: { dynamic: 0, static: 0 }`, so every in-app `<Link>` click refetches the full RSC payload. That was a deliberate freshness call (its own comment), but it was made when the HTML was uncacheable anyway. Now that pages are CDN-cached, a small non-zero value would make back-navigation instant. **Left alone — your call.** | `next.config.mjs:7-9` | not changed | — | — |
| Info | F41 — Chrome flags **14.4 kB of unnecessary legacy JavaScript** (polyfills/transpilation for browsers the audience does not use). Worth a `browserslist` entry, but it is 14 kB against a 2.7-second server delay — not worth touching in the same pass. Deferred. | trace insight `LegacyJavaScript` | deferred | — | — |

### What was fixed

| File | Change |
|---|---|
| `src/lib/siteConfig.ts` | `MAINTENANCE` flag moved here so the layout can read it without importing the edge middleware bundle. |
| `src/middleware.ts` | Imports the flag instead of defining it. No behaviour change. |
| `src/app/layout.tsx` | `force-dynamic` removed; `headers()` now short-circuits behind `MAINTENANCE`; three font declarations collapsed to one at three weights. |
| `tailwind.config.ts` | `display`/`body`/`hind` families all resolve to `--font-display`. |
| `src/app/globals.css` | `--font-body` → `--font-display`. |
| 13 route files | `force-dynamic` → `revalidate` (60 / 300 / 3600). |
| `src/app/AdSlot.tsx` | Ad image gets a reserved aspect box. |

Verified: `npx tsc --noEmit` → no errors. `npm run build` → succeeded, **27 pages prerendered**
where previously every public route was server-rendered per request. Fonts 244 kB → 156 kB.

### Needs your decision

1. **60 seconds of staleness on the homepage and article pages.** This is the one change
   that reverses an earlier documented stance — `next.config.mjs` says "a news front page
   must never be stale". That decision was about the *client-side* router cache, not the
   CDN, but the spirit is adjacent so I am flagging it rather than burying it. 60s is what
   turns a 2.8s server wait into a ~100 ms edge hit. Say the word and I will take it to 30s,
   or to 0 for `/` alone (which keeps the win on article pages, where the SEO traffic lands).
2. **F40 — `staleTimes`.** Raise `dynamic` from 0 to ~30 so back-navigation is instant?
   Pure responsiveness win, same staleness tradeoff as above.
3. Phase 0 question (2) is now live: a **free PageSpeed Insights API key** would let me
   re-measure on demand. The keyless quota is a shared pool and was exhausted today.

### Deferred

`generateStaticParams` for `/samachar/[slug]` (on-demand ISR already covers it, and a
build-time DB query makes the build fail when Supabase is down). Legacy-JS browserslist
trimming (F41). INP measurement and any field data — blocked until the site has traffic.

### Not yet verified

Everything in F36 is verified **at build time only**. The live site still serves the old
code. The post-deploy check in the table above is the one that matters.

---

## Phase 6 — Discovery surfaces (2026-09-22)

Audited how a crawler actually reaches, reads and re-checks this site: the two sitemaps,
`robots.txt`, the RSS feed, the PWA manifest and icons, the share cards, and every
internal link path. Three sonnet workers over disjoint scopes (A = sitemap/robots/feed/
news-sitemap, B = manifest/OG/icons/sw.js, C = internal linking, read-only).

### Findings

| Sev | Finding | Evidence | Fix | Failure check | Effort |
|---|---|---|---|---|---|
| High | F42 — live `sitemap.xml`, `robots.txt` and `feed.xml` all emit `http://localhost:3000/...`. Already diagnosed in Phase 0; repeated here because it is still true in production. | live fetch of all three | None in code — `NEXT_PUBLIC_SITE_URL` in Vercel + deploy. | `curl -s .../sitemap.xml \| grep -c localhost` returns 0 | none (ops) |
| Medium | F43 — **45 indexable pages were missing from the sitemap**: all 9 `/shreni/<category>` and all 28 `/rajya/<state>` routes. The sitemap listed static pages and article slugs only, so the entire category and state taxonomy was invisible to Google except by following links. | `sitemap.ts` before change | Both route families added, generated from `categories.ts` / `states.ts` so they cannot drift from the nav. | Count `<url>` entries in sitemap.xml; `/shreni/` and `/rajya/` must appear. | S |
| Medium | F44 — live `feed.xml` still lists retired articles (e.g. `jalvayu-sammelan-bharat-bhumika`), which are served 410. | live `/feed.xml` | Not a code bug — `getRecentPublishedArticles` correctly relies on RLS `is_published`. The hosted DB has not had `SEO_PHASE2.sql` applied. | After the SQL paste, no `GONE_ARTICLES` slug appears in the feed. | none (ops) |
| High | F62 — **every tag on every article was a guaranteed 404.** The article page rendered `<a href="/vishay/<tag>">` for each tag, and `/vishay` has never existed as a route. | `samachar/[slug]/page.tsx:101` | Tags render as `<span>` labels. A tag archive is worth building when there is enough published work to fill one; until then a dead link is worse than no link. | `grep -r "/vishay" src/` returns 0 matches, or the route exists. | S |
| Medium | F63 — **pagination is invisible to crawlers.** `/samachar`, `/shreni/<category>` and `/rajya/<state>` all render 12 items server-side and then rely on `LoadMoreArticles`, an `onClick` that fetches `/api/articles`. There is no `?page=` or `/page/2` URL anywhere. Article #13 in any section is unreachable by any `<a href>` in the DOM. | `LoadMoreArticles.tsx:22-38`, three page files at `limit: 12` | **Not fixed — needs a decision.** See below. | Fetch a category page with JS disabled; look for any link to a 13th article. | M |
| Medium | F64 — no breadcrumbs anywhere on the site, visible or structured. | `grep -r Breadcrumb src/` returns 0 | `buildBreadcrumbSchema` added; article pages now emit `BreadcrumbList` JSON-LD (होम - section - headline). Visible trail not added — that is a design change. | Rich Results Test on an article URL shows a breadcrumb. | S |
| Medium | F46 — if `MAINTENANCE` is ever flipped on, `sitemap.xml`, `robots.txt`, `news-sitemap.xml` and `feed.xml` get rewritten to the maintenance HTML page. They would return 200 `text/html` where Google expects XML — which Search Console reports as a *malformed* sitemap, not as a temporary outage. | `middleware.ts` `OPEN_PREFIXES` | All four added to `OPEN_PREFIXES`. `robots.txt` especially must keep answering during a maintenance window — it is how a crawler is told what to do while the site is down. | Flip `MAINTENANCE` locally, request `/sitemap.xml`, confirm XML not HTML. | S |
| Medium | F47 — `export const dynamic = "force-dynamic"` sat above `export const revalidate` in `sitemap.ts`, `news-sitemap.xml` and `feed.xml`. `force-dynamic` takes precedence, so all three revalidate numbers were **dead code** and every crawler hit paid a full Supabase round-trip. Same anti-pattern Phase 5 fixed on the page routes; these three were explicitly outside that pass. | `sitemap.ts:1`, `news-sitemap.xml/route.ts:1`, `feed.xml/route.ts:1` | `force-dynamic` removed from all three. News sitemap dropped 900s to **300s**: this is the surface that decides how fast a breaking story reaches Google News, so staleness here costs indexation time directly. | Build route table marks all four discovery routes as Static. Post-deploy: `x-vercel-cache: HIT` on a second request. | S |
| High | F50 — `public/icon-192.png` and `icon-512.png` are referenced by `manifest.ts` and by the `NewsMediaOrganization` publisher logo, and **404 in production**. Flagged as a risk in CLAUDE.md on 2026-07-07; they never shipped. | live fetch returns 404 on both | **Owner action.** Not invented: squeezing a wide masthead into a 192px square, and placing it inside Android's maskable safe zone, are design decisions with a visible wrong answer. | Both URLs return 200. | owner |
| Medium | F51 — no `apple-icon` and no app-level `icon`. iOS ignores `manifest.ts` entirely, so an iPhone home-screen bookmark got a blank globe. | no `src/app/icon.*` existed | `icon.tsx` (32x32) and `apple-icon.tsx` (180x180) generated the same way the OG cards already are — masthead red, white glyph, vendored Devanagari font. No brand asset invented; replace with the real logo whenever F50 lands. | Build route table lists `/icon` and `/apple-icon`. | S |
| Info | F52 — `sw.js` matches the missing icons for cache-first, but has no install-time precache list, so a missing icon 404s on demand rather than failing service-worker installation outright. Worth knowing: if anyone later adds `cache.addAll([...])` naming those files, SW install breaks completely until F50 is fixed. | `public/sw.js:26-29` | none | — | — |
| Info | F53/F54/F55 — verified correct and left alone: manifest `theme_color` is the masthead red `#b5291d` (not saffron), Hindi name/description, maskable entry present; OG cards render at 1200x630 with the vendored Devanagari font; `news:publication_date` carries a valid UTC offset and the 48h window is computed in epoch ms, so there is no IST/UTC bug; `feed.xml` is valid RSS 2.0 with RFC-822 dates; `sitemap.ts` `lastModified` values come from real `updated_at`/`published_at` columns rather than invented constants. | — | none | — | — |
| Info | F65 — `/polls` is linked from nowhere on the site; `/search` is reachable only through a `<form>`, which is not a crawlable link. Both are in the sitemap, so crawlers find them; no reader ever clicks through to them. | `grep -r "/polls" src/` returns 0 links | Not fixed — a nav decision, not an SEO defect. | — | — |
| Info | F66/F67 — 9 categories exist, at most 2 have a published article; 28 `/rajya/<state>` pages exist and none is linked from any nav. All 37 are now sitemapped (F43). At 2 published articles this is a thin-content question, not a bug. | `categories.ts`, `states.ts` | Not decided — see below. | — | — |
| — | **F45 withdrawn as non-actionable, F61 withdrawn as a false positive.** F45: `/news-sitemap.xml` renders an empty `<urlset>` because neither published article is within the 48h window — valid per spec, self-resolving once the desk publishes. F61: worker C reported `/rajya` as a 404 with "no `page.tsx` exists". `src/app/rajya/page.tsx` does exist and the build prerenders it. | build route table shows `/rajya` as Static | none | — | — |

### What was fixed

| File | Change |
|---|---|
| `src/app/sitemap.ts` | 9 `/shreni/*` + 28 `/rajya/*` routes added, generated from `categories.ts`/`states.ts`. `force-dynamic` removed. |
| `src/app/news-sitemap.xml/route.ts` | `force-dynamic` removed; revalidate 900 to 300. |
| `src/app/feed.xml/route.ts` | `force-dynamic` removed. |
| `src/middleware.ts` | Four discovery paths added to `OPEN_PREFIXES`. |
| `src/app/icon.tsx`, `src/app/apple-icon.tsx` | New — generated favicon + apple-touch-icon. |
| `src/lib/utils/structuredData.ts` | `buildBreadcrumbSchema` added. |
| `src/app/samachar/[slug]/page.tsx` | `BreadcrumbList` JSON-LD emitted; dead `/vishay/<tag>` links become `<span>` labels. |

Verified: `npx tsc --noEmit` clean. `npm run build` succeeded, 30 pages, and `/sitemap.xml`,
`/feed.xml`, `/news-sitemap.xml`, `/robots.txt` are now Static where they were
server-rendered per request.

### Needs your decision

1. **Crawlable pagination (F63).** Zero impact today — the site has 2 articles. It becomes
   invisible debt the moment any section passes 12. The catch: the obvious fix (`?page=N`
   read from `searchParams`) opts those pages out of static rendering and gives back the
   Phase 5 caching win. `/shreni/<category>/page/<n>` as real route segments keeps them
   static but costs more files. Worth doing now, or defer until a section fills up?
2. **7 empty category pages and 28 unlinked state pages (F66/F67).** Now sitemapped. Leave
   them indexable, or `noindex` until they have articles? Noindexing published URLs needs
   your say-so per the ground rules, so nothing was changed.
3. **`/polls` and `/search` have no on-page entry point (F65).** Add them to nav/footer, or
   leave `/polls` as a homepage-widget-only feature?
4. **AI crawler policy.** `robots.txt` currently takes no stance on GPTBot, ClaudeBot,
   PerplexityBot etc. — they are neither allowed nor blocked explicitly, so they crawl.
   Left alone deliberately: it is a business decision, not an SEO one.
5. **Visible breadcrumb trail.** The JSON-LD is in; a visible trail on article and category
   pages is a design change and was not made unilaterally.

### Deferred

`/vishay/<tag>` tag archives (needs content volume first). Real brand icons (F50, owner).
`generateStaticParams` for article routes (still covered by on-demand ISR).

### Not yet verified

Everything here is verified at build time only. The live site still serves pre-Phase-5 code,
and the hosted DB still has neither migration 018 nor `SEO_PHASE2.sql`. Nothing is committed.

---
