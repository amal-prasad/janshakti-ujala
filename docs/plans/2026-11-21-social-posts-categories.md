# Social posts and consistent news categories

**Goal:** Embed public social posts inside articles, share one category order across navigation and the homepage, and merge Indore coverage into Madhya Pradesh.

**Architecture:** Keep article bodies as Markdown. Recognize standalone Instagram post/Reel, X/Twitter status, and YouTube links through an explicit URL allowlist, rendering official embeds in the shared public/preview renderer. Add a URL insertion control at the body cursor. Keep ordinary links and raw HTML behavior unchanged. Normalize retired Indore categories on reads and edits, migrate existing primary/secondary categories without changing article URLs or publication status, and redirect the old category route.

**Tech stack:** Next.js 14, React 18, react-markdown, Supabase Postgres, existing Node assertion scripts.

## Category decision

Madhya Pradesh, national, other states, politics, international, business, sports, entertainment, technology, education/career, health, religion. Regional coverage leads for this paper. Use `categories.ts` for every homepage category section as well as desktop/mobile menus, editor and sitemap. Empty sections remain hidden.

Research on 2026-11-21: https://www.amarujala.com/ puts country and city/state coverage near the start; https://www.aajtak.in/ also foregrounds India but orders specialist sections differently. This is an editorial recommendation, not a measured universal popularity ranking.

## Work and checks

1. Add regression assertions for unsafe/unsupported social URLs, canonical links, Indore normalization, and preservation of extra categories; run before implementation.
2. Add URL parsing, shared social renderer and editor insertion with Hindi validation, source fallback links, and responsive containers. Never render pasted HTML or arbitrary script sources.
3. Drive homepage sections from the shared category list; normalize old rows, merge section queries, and redirect `/shreni/indore`.
4. Add an idempotent SQL migration and exercise real Postgres fixtures for primary/secondary Indore categories, drafts, duplicates and unchanged publication metadata. Apply the authorized hosted row move with a local backup if database access is available.
5. Update cookie/privacy text for third-party embeds. Run utility regressions, lint, TypeScript/build, database verification and browser checks for mobile layout, category order, insertion/preview and failure fallback.

## Constraints

Only public posts whose owners/platform allow embedding can display. Deleted/private/blocked embeds retain a source link. No account login or social publishing is needed. Existing graphify output changes belong to the user and are left alone.

## Verification and migration result

- Hosted backfill moved 178 published articles, with a full ignored local backup at `.codex/backups/indore-1795263349473.json`. A subsequent read found zero primary or secondary Indore memberships. Every updated row was compared against its backup; only category membership and state changed.
- Real Postgres fixtures passed for primary/secondary membership, empty arrays, deduplication, drafts, publication metadata preservation and idempotence.
- Browser checks at desktop and 375px passed for shared category chronology, the 308 redirect, cursor insertion, rejected URLs, all three embed providers using controlled SDK responses, plain Markdown/HTML safety, script reuse and iframe persistence during preview edits and reader scrolling. A separate blocked-SDK check confirmed the failure message and original post link. Live X SDK produced its official iframe; provider content availability remains external.
- Review caught unstable Markdown paragraph component identities. Hoisting the renderer fixed repeated embed mounting; the browser checks cover this regression.
- UI changes have not been deployed by this task.
