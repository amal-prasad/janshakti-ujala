# आपके लिए काम की सूची — TODO (owner actions)

Everything in this file needs **you**, not code. I cannot do these: they need your
Vercel dashboard, your Supabase Studio, your Google account, your brand assets, or
facts about the publisher that only you know.

Ordered by what unblocks the most. Items 1–4 are blocking; everything after is not.

Status as of 2026-09-22, end of SEO Phase 6. Nothing has been committed or deployed.

---

## 🔴 1. Set `NEXT_PUBLIC_SITE_URL` in Vercel — 2 minutes

**This is the single highest-value item in the file.**

Vercel → your project → Settings → Environment Variables → Add:

| Name | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.janshaktiujala.in` | Production (also Preview, if you want correct previews) |

**Why:** one variable feeds canonical tags, Open Graph tags, both sitemaps,
`robots.txt`, the RSS feed and all JSON-LD. Right now it is unset, so the live site
publishes `http://localhost:3000/...` inside its own sitemap and canonical tags.
Google is being told the real pages live on your laptop.

**How you'll know it worked:** after redeploying, open
`https://www.janshaktiujala.in/sitemap.xml` — every `<loc>` must start with
`https://www.janshaktiujala.in`. Zero occurrences of `localhost`.

---

## 🔴 2. Apply the two pending SQL files to the hosted database

The hosted Supabase DB has **not** been touched by any of this work. Two files are
waiting. Open Supabase Studio → SQL Editor → paste → Run.

**Order matters. Do 2a before 2b.**

### 2a. `supabase/migrations/018_article_publish_default_off.sql`
Flips `articles.is_published` to default **false**.

**Why:** right now the column defaults to `true`, so *every* row inserted anywhere —
including seed rows and anything pasted into Studio — is publicly live the instant it
exists. This is the actual root cause of the demo articles being indexed. It was never
a security hole; RLS was correct. It was a bad default.

### 2b. `supabase/SEO_PHASE2.sql`
Retires the 29 demo/seed articles and clears the demo ticker rows.

**⚠️ Run section §0 first — it is a dry run.** It only *selects* the rows it is about
to change. Read that list before running anything else in the file. If a row in it is
an article you actually want to keep, stop and tell me; do not run §1.

**What it does:** unpublishes 28 rows (recoverable — a one-line update brings any of
them back) and deletes exactly one row: the article whose slug is the literal string
`Janshakti Ujala`. That one is deleted rather than unpublished because a slug with a
space in it is unreachable at any URL and emits an invalid entry in the sitemap —
there is no content to preserve.

**Coupling you must know about:** the retired slugs are also hard-coded in
`GONE_ARTICLES` in `src/middleware.ts`, which serves them HTTP **410 Gone** so Google
drops them from the index quickly instead of recrawling a 404 for months. If you ever
want to bring one of those articles back, you must remove it from that list too, or
the 410 keeps it unreachable even after republishing.

**How you'll know it worked:** `https://www.janshaktiujala.in/samachar/demo-draft-mela`
returns 410, and `/feed.xml` no longer lists any retired article.

---

## 🔴 3. Fill in the publisher identity block

**File:** `src/lib/siteConfig.ts` → the `publisher` object. Every field is currently an
empty string.

I deliberately left these blank and did **not** invent plausible-looking values. A
regional news site's entire claim on a reader is that a named, reachable person stands
behind the reporting. A fabricated editor name or postal address inverts that. An
incomplete page is a weaker signal than a complete one; a false one is worse than
either. So `/prakashak` and the `NewsMediaOrganization` schema both *omit* any field
you leave empty rather than printing a placeholder.

Send me these and I will fill them in, or edit the file yourself:

| Field | What it is | Required by |
|---|---|---|
| `legalName` | Registered name of the publishing entity | Google News publisher guidance |
| `editorInChief` | Full name of the responsible editor | Indian press norms + E-E-A-T |
| `grievanceOfficer` | Full name | **Legally required** for digital news in India (IT Rules 2021) |
| `grievanceEmail` | Monitored email address | Same |
| `addressLine` | Street address of the office | LocalBusiness / NewsMediaOrganization schema |
| `postalCode` | PIN code | Same |
| `rniNumber` | RNI registration number, if the paper has one | Trust signal; leave empty if none |
| `foundingYear` | Year the paper started | Trust signal |

**If you do not have an RNI number, leave it empty.** Empty is fine. Wrong is not.

---

## 🔴 4. Supply two brand icon files

Create these two PNGs from your masthead and drop them in `public/`:

| File | Size | Notes |
|---|---|---|
| `public/icon-192.png` | 192×192 px | Square. Normal icon. |
| `public/icon-512.png` | 512×512 px | Square. Also used as the **maskable** icon — keep the logo inside the centre ~80% of the canvas (about 40 px clear on every side), because Android crops maskable icons into circles, squircles and rounded squares depending on the phone. |

**Why you and not me:** these are brand assets. Squeezing a wide masthead wordmark into
a 192 px square is a design decision with a visible wrong answer, and guessing the
maskable safe zone would ship a logo with its edges sliced off on half of Android.

**What is broken until you do:** the Android "Add to Home Screen" install prompt is
degraded, and the publisher logo in your Google rich results / Google News listing has
no image. Both files currently 404 in production.

**Already handled, needs nothing from you:** the browser tab favicon and the iOS
home-screen icon are now generated in code (`src/app/icon.tsx`, `src/app/apple-icon.tsx`)
from the masthead red and a white "उ", so those two surfaces are no longer broken.
Replace them later if you want the real logo there too.

---

## 🟡 5. Answer three questions I still need

These have been open since Phase 0.

1. **Is Google Search Console connected for this site?** If yes — is it a *Domain*
   property or a *URL-prefix* property? (It matters: apex vs `www` are different
   properties, and your apex redirects to `www`.) If no, connecting it is free and is
   the only way to see what Google actually thinks of the site.
2. **Can you create a free PageSpeed Insights API key?** Google Cloud Console → enable
   "PageSpeed Insights API" → create an API key. Without one I share a public quota
   that was already exhausted when I tried to measure performance.
3. **Do you want Google Analytics / GA4 connected?** Not required, but it is the only
   way to see whether any of this work produces readers.

---

## 🟡 6. Two performance decisions (reversible, one line each)

From Phase 5. I shipped sensible defaults; say the word and I'll change them.

1. **60-second cache on the homepage and article pages.** This is what turns a
   2.8-second server wait into a ~100 ms edge hit — the single biggest speed win
   available. The cost: a newly published article can take up to 60 seconds to appear.
   This brushes an earlier note in `next.config.mjs` saying "a news front page must
   never be stale", so I am flagging it rather than burying it. Alternatives: 30
   seconds, or exempt the homepage alone (keeping the win on article pages, which is
   where search traffic lands).
2. **Instant back-navigation.** Currently every in-site link click refetches the page
   from scratch, so pressing Back feels slow. A 30-second client cache would make it
   instant, with the same staleness tradeoff. Want it?

---

## 🟡 7. Five discovery decisions (from Phase 6)

Nothing here is broken. These are choices I deliberately did not make for you.

1. **Crawlable pagination.** Your category, section and state pages show 12 articles and
   then a "और खबरें लोड करें" button. That button is JavaScript — Google cannot click it.
   So article #13 onward in any section is invisible to search. **Zero impact today** (you
   have 2 articles), and it becomes invisible debt the moment a section fills up. The
   awkward part: the obvious fix (`?page=2` URLs) would undo the caching win from Phase 5
   on those pages. A `/shreni/indore/page/2` style fix keeps both but costs more code. Fix
   now, or wait until a section actually passes 12?
2. **Empty category and state pages.** 9 categories exist, at most 2 have an article. 28
   state pages exist and none is linked from any menu. They are all in the sitemap now.
   Keep them indexable, or hide them from Google until they have content? I did not change
   this — hiding already-published pages needs your call.
3. **`/polls` and `/search` are not linked from anywhere** on the site. Should they be in
   the menu or footer, or is `/polls` meant to be homepage-only?
4. **AI crawlers.** Your `robots.txt` currently says nothing about GPTBot, ClaudeBot,
   PerplexityBot and the rest — so they are free to crawl and train on your reporting.
   Allow, block, or leave as is? This is a business decision about your content, not an
   SEO one, so I left it untouched.
5. **Visible breadcrumbs.** Google now gets a breadcrumb trail for your articles via
   structured data (so search results can show "जनशक्ति उजाला › इंदौर › headline" instead of
   a raw URL). A breadcrumb visible to *readers* on the page is a design change — want it?

---

## 🟢 8. Editorial, not technical

Not my call, but it is the finding that no amount of metadata work can fix:

**The site currently has 2 published articles.** 29 were retired because they were demo
and seed content — an indexable corpus that is 94% filler is a thin-content and trust
problem, and a near-empty site is the honest signal. Google News and Discover both
require a consistent publishing cadence before they will consider a publisher at all.
Nothing in this SEO programme substitutes for the desk publishing original reporting
regularly.

---

## Post-deploy checklist

Run these **after** you deploy and after items 1 and 2 are done. In order.

```bash
# 1. Canonicals and sitemaps point at the real domain (expect: zero matches)
curl -s https://www.janshaktiujala.in/sitemap.xml | grep -c localhost

# 2. CDN caching is alive. Run this TWICE.
#    Expect on the second run: "x-vercel-cache: HIT" and "s-maxage=60"
curl -sI https://www.janshaktiujala.in/ | grep -i "cache"

# 3. Retired articles are gone, not missing (expect: 410)
curl -so /dev/null -w "%{http_code}\n" https://www.janshaktiujala.in/samachar/demo-draft-mela

# 4. Brand icons exist (expect: 200 200)
curl -so /dev/null -w "%{http_code} " https://www.janshaktiujala.in/icon-192.png
curl -so /dev/null -w "%{http_code}\n" https://www.janshaktiujala.in/icon-512.png
```

If step 2 still says `MISS` or `no-store` on the second run, something in the app is
reading request headers or cookies again and has re-disabled caching sitewide. Tell me
and I'll find it.

---

## What I have NOT done

- **Nothing is committed.** Every change is sitting in the working tree. You asked me
  to commit only when you ask.
- **Nothing is deployed.** The live site still runs the old code, so none of the
  Phase 5 or Phase 6 fixes are in effect yet.
- **The hosted database is untouched.** See item 2.
