# Graph Report - Janshakti ujala  (2026-11-24)

## Corpus Check
- 258 files · ~312,232 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .log 9, .toml 2, .ico 2)

## Summary
- 632 nodes · 987 edges · 107 communities (18 shown, 89 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2f98e7a6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .agents/skills
- .agents/skills
- .agents/skills
- .agents/skills
- rashifal/route.ts
- .agents/skills
- test-utils.mts
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
- ArticleForm.tsx
- types.ts
- Social posts and consistent news categories
- .agents/skills
- page.tsx
- .agents/skills
- app/page.tsx

## God Nodes (most connected - your core abstractions)
1. `createServerClient()` - 30 edges
2. `SiteConfig` - 20 edges
3. `formatDate()` - 18 edges
4. `Home()` - 17 edges
5. `getArticles()` - 15 edges
6. `compilerOptions` - 15 edges
7. `ArticleForm()` - 14 edges
8. `आपके लिए काम की सूची — TODO (owner actions)` - 11 edges
9. `selectCards()` - 10 edges
10. `getCategory()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `addSocialPost()` --indirect_call--> `body()`  [INFERRED]
  src/components/newsroom/ArticleForm.tsx → scripts/seed-demo.mjs
- `onSubmit()` --indirect_call--> `body()`  [INFERRED]
  src/components/newsroom/ArticleForm.tsx → scripts/seed-demo.mjs
- `Topbar()` --calls--> `formatDate()`  [EXTRACTED]
  src/components/layout/Topbar.tsx → src/lib/utils/format.ts
- `POST()` --calls--> `createServerClient()`  [INFERRED]
  src/app/api/revalidate/route.ts → src/lib/supabase/server.ts
- `Home()` --calls--> `AdSlot()`  [EXTRACTED]
  src/app/page.tsx → src/components/AdSlot.tsx

## Import Cycles
- None detected.

## Communities (107 total, 89 thin omitted)

### Community 0 - ".agents/skills"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - ".agents/skills"
Cohesion: 0.04
Nodes (45): Baseline score, Codebase map, Corrections to the Phase 1 findings table, Deferred, Deferred, Deferred, Deferred, Deferred (not Phase 2 scope) (+37 more)

### Community 3 - ".agents/skills"
Cohesion: 0.06
Nodes (48): dependencies, headroom-ai@^0.22.4, mhah-panchang@^1.2.0, next@14.2.35, react-dom@^18, react-markdown@^10.1.0, resend@^6.14.0, @supabase/ssr@^0.12.0 (+40 more)

### Community 83 - "rashifal/route.ts"
Cohesion: 0.14
Nodes (16): authorized(), GET(), metadata, RashifalPage(), API_SIGN, fetchProkeralaRashifal(), getProkeralaToken(), getAllRashifalToday() (+8 more)

### Community 84 - ".agents/skills"
Cohesion: 0.09
Nodes (31): POST(), escapeXml(), GET(), GalleryPage(), metadata, GET(), metadata, Props (+23 more)

### Community 85 - "test-utils.mts"
Cohesion: 0.18
Nodes (10): links, long, longWithSuffix, s, t, ICONS, NAMES, ShareButtons() (+2 more)

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
Cohesion: 0.07
Nodes (29): inserted, GET(), generateMetadata(), Params, StatePage(), metadata, SamacharPage(), Params (+21 more)

### Community 90 - "siteConfig.ts"
Cohesion: 0.05
Nodes (26): next, metadata, metadata, revalidate, metadata, revalidate, metadata, siteHost (+18 more)

### Community 92 - ".agents/skills"
Cohesion: 0.50
Nodes (4): Deploy on Vercel, README.md (default create-next-app boilerplate), Getting Started, Learn More

### Community 101 - "ArticleForm.tsx"
Cohesion: 0.08
Nodes (36): react@^18, react, EditArticlePage(), NewsroomEpaperPage(), NewArticlePage(), Filter, NewsroomListPage(), Row (+28 more)

### Community 103 - "types.ts"
Cohesion: 0.08
Nodes (27): POST(), POST(), GalleryDetailPage(), generateMetadata(), Params, metadata, PollsPage(), AdSlot() (+19 more)

### Community 104 - "Social posts and consistent news categories"
Cohesion: 0.33
Nodes (5): Category decision, Constraints, Social posts and consistent news categories, Verification and migration result, Work and checks

### Community 113 - ".agents/skills"
Cohesion: 0.40
Nodes (3): halant, metadata, viewport

### Community 119 - ".agents/skills"
Cohesion: 0.15
Nodes (14): formatIstTime(), getTodayPanchang(), istToday(), KARANA_HI, MASA_HI, MhahPanchang, MhahPanchangInstance, NAKSHATRA_HI (+6 more)

### Community 182 - "app/page.tsx"
Cohesion: 0.10
Nodes (30): EpaperEditionPage(), generateMetadata(), EpaperPage(), metadata, metadata, Home(), revalidate, EpaperStrip() (+22 more)

## Knowledge Gaps
- **89 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ArticleForm.tsx` to `.agents/skills`, `app/page.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `.agents/skills` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `next` connect `siteConfig.ts` to `.agents/skills`, `ArticleForm.tsx`, `app/page.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `.agents/skills` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._
- **Why does `SiteConfig` connect `siteConfig.ts` to `categories.ts`, `rashifal/route.ts`, `.agents/skills`, `app/page.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `.agents/skills` be split into smaller, more focused modules?**
  _Cohesion score 0.055272108843537414 - nodes in this community are weakly interconnected._
- **Should `rashifal/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._