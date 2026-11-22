# Graph Report - Janshakti ujala  (2026-11-21)

## Corpus Check
- 256 files · ~311,828 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .log 9, .toml 2, .ico 2)

## Summary
- 627 nodes · 967 edges · 115 communities (23 shown, 92 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b54c372`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .agents/skills
- .agents/skills
- .agents/skills
- .agents/skills
- formatDate
- .agents/skills
- gallery.ts
- .agents/skills
- verify-db.mjs
- .agents/skills
- categories.ts
- siteConfig.ts
- .agents/skills
- .agents/skills
- .agents/skills
- .agents/skills
- .agents/skills
- .agents/skills
- .agents/skills
- sitemap.ts
- .agents/skills
- ArticleForm.tsx
- middleware.ts
- Social posts and consistent news categories
- prakashak/page.tsx
- hamare-bare-mein/page.tsx
- niyam-evam-sharten/page.tsx
- opengraph-image.tsx
- cookie-niti/page.tsx
- .agents/skills
- page.tsx
- .agents/skills
- BreakingNewsTicker.tsx
- app/page.tsx

## God Nodes (most connected - your core abstractions)
1. `createServerClient()` - 29 edges
2. `SiteConfig` - 20 edges
3. `formatDate()` - 18 edges
4. `Home()` - 17 edges
5. `getArticles()` - 16 edges
6. `compilerOptions` - 15 edges
7. `ArticleForm()` - 14 edges
8. `आपके लिए काम की सूची — TODO (owner actions)` - 11 edges
9. `getCategory()` - 10 edges
10. `getNewsroomClient()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `addSocialPost()` --indirect_call--> `body()`  [INFERRED]
  src/components/newsroom/ArticleForm.tsx → scripts/seed-demo.mjs
- `onSubmit()` --indirect_call--> `body()`  [INFERRED]
  src/components/newsroom/ArticleForm.tsx → scripts/seed-demo.mjs
- `POST()` --calls--> `createServerClient()`  [INFERRED]
  src/app/api/revalidate/route.ts → src/lib/supabase/server.ts
- `Home()` --calls--> `EpaperStrip()`  [EXTRACTED]
  src/app/page.tsx → src/components/home/EpaperStrip.tsx
- `Home()` --calls--> `getArticles()`  [EXTRACTED]
  src/app/page.tsx → src/lib/api/articles.ts

## Import Cycles
- None detected.

## Communities (115 total, 92 thin omitted)

### Community 0 - ".agents/skills"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - ".agents/skills"
Cohesion: 0.04
Nodes (45): Baseline score, Codebase map, Corrections to the Phase 1 findings table, Deferred, Deferred, Deferred, Deferred, Deferred (not Phase 2 scope) (+37 more)

### Community 3 - ".agents/skills"
Cohesion: 0.06
Nodes (47): dependencies, headroom-ai@^0.22.4, mhah-panchang@^1.2.0, react-dom@^18, react-markdown@^10.1.0, resend@^6.14.0, @supabase/ssr@^0.12.0, transliteration@^2.6.1 (+39 more)

### Community 83 - "formatDate"
Cohesion: 0.26
Nodes (10): EpaperEditionPage(), generateMetadata(), EpaperPage(), metadata, EpaperStrip(), Topbar(), getEpaperEdition(), getEpaperEditions() (+2 more)

### Community 84 - ".agents/skills"
Cohesion: 0.07
Nodes (44): inserted, GET(), POST(), escapeXml(), GET(), GET(), generateMetadata(), Params (+36 more)

### Community 85 - "gallery.ts"
Cohesion: 0.24
Nodes (9): GalleryPage(), metadata, GalleryDetailPage(), generateMetadata(), Params, sitemap(), getGalleries(), getGalleryBySlug() (+1 more)

### Community 86 - ".agents/skills"
Cohesion: 0.14
Nodes (13): 🔴 1. Set `NEXT_PUBLIC_SITE_URL` in Vercel — 2 minutes, 🔴 2. Apply the two pending SQL files to the hosted database, 2a. `supabase/migrations/018_article_publish_default_off.sql`, 2b. `supabase/SEO_PHASE2.sql`, 🔴 3. Fill in the publisher identity block, 🟢 4. Brand icon files & tab icon (Done), 🟡 5. Answer three questions I still need, 🟡 6. Two performance decisions (reversible, one line each) (+5 more)

### Community 87 - "verify-db.mjs"
Cohesion: 0.10
Nodes (17): @supabase/supabase-js@^2.108.2, @supabase/supabase-js, assertCategoryMigration(), db, rows, body(), db, ensureUser() (+9 more)

### Community 88 - ".agents/skills"
Cohesion: 0.18
Nodes (11): HolidaysClientWidget(), TYPE_LABEL, HolidaysWidget(), CalendarificHoliday, FALLBACK_HOLIDAYS, fallbackUpcoming(), fetchYear(), getUpcomingHolidays() (+3 more)

### Community 89 - "categories.ts"
Cohesion: 0.17
Nodes (6): Params, MobileMenu(), bySlug, categories, Category, legacyNames

### Community 90 - "siteConfig.ts"
Cohesion: 0.14
Nodes (5): metadata, metadata, metadata, metadata, SiteConfig

### Community 92 - ".agents/skills"
Cohesion: 0.50
Nodes (4): Deploy on Vercel, README.md (default create-next-app boilerplate), Getting Started, Learn More

### Community 98 - ".agents/skills"
Cohesion: 0.09
Nodes (23): authorized(), GET(), POST(), POST(), metadata, RashifalPage(), API_SIGN, fetchProkeralaRashifal() (+15 more)

### Community 99 - "sitemap.ts"
Cohesion: 0.20
Nodes (7): MAIN_PAGES, metadata, POLICY_PAGES, STATIC_ROUTES, bySlug, StateInfo, states

### Community 101 - "ArticleForm.tsx"
Cohesion: 0.07
Nodes (37): react@^18, react, links, long, longWithSuffix, s, t, FONT_LABEL (+29 more)

### Community 103 - "middleware.ts"
Cohesion: 0.11
Nodes (21): EditArticlePage(), NewsroomEpaperPage(), NewArticlePage(), Filter, NewsroomListPage(), Row, metadata, PollsPage() (+13 more)

### Community 104 - "Social posts and consistent news categories"
Cohesion: 0.33
Nodes (5): Category decision, Constraints, Social posts and consistent news categories, Verification and migration result, Work and checks

### Community 105 - "prakashak/page.tsx"
Cohesion: 0.40
Nodes (3): addressParts, metadata, rows

### Community 108 - "opengraph-image.tsx"
Cohesion: 0.67
Nodes (3): Image(), loadDevanagariFonts(), size

### Community 110 - "cookie-niti/page.tsx"
Cohesion: 0.20
Nodes (6): next@14.2.35, next, metadata, revalidate, metadata, revalidate

### Community 113 - ".agents/skills"
Cohesion: 0.40
Nodes (3): halant, metadata, viewport

### Community 119 - ".agents/skills"
Cohesion: 0.15
Nodes (14): formatIstTime(), getTodayPanchang(), istToday(), KARANA_HI, MASA_HI, MhahPanchang, MhahPanchangInstance, NAKSHATRA_HI (+6 more)

### Community 182 - "app/page.tsx"
Cohesion: 0.12
Nodes (22): metadata, Home(), revalidate, AdSlot(), ArticleCard(), ArticleCardSmall(), CategorySection(), HeroCard() (+14 more)

## Knowledge Gaps
- **92 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ArticleForm.tsx` to `.agents/skills`, `app/page.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `.agents/skills` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `SiteConfig` connect `siteConfig.ts` to `.agents/skills`, `sitemap.ts`, `prakashak/page.tsx`, `hamare-bare-mein/page.tsx`, `niyam-evam-sharten/page.tsx`, `opengraph-image.tsx`, `cookie-niti/page.tsx`, `formatDate`, `.agents/skills`, `app/page.tsx`, `categories.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `.agents/skills` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._
- **Why does `next` connect `cookie-niti/page.tsx` to `.agents/skills`, `ArticleForm.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `.agents/skills` be split into smaller, more focused modules?**
  _Cohesion score 0.05673758865248227 - nodes in this community are weakly interconnected._
- **Should `.agents/skills` be split into smaller, more focused modules?**
  _Cohesion score 0.07199032062915911 - nodes in this community are weakly interconnected._