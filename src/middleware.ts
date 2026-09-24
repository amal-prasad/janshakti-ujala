import { NextResponse, type NextRequest } from "next/server";
// Site-wide "under construction" gate — defined in siteConfig so the root layout can
// read the same flag without dragging this edge bundle into the server render path.
import { MAINTENANCE } from "@/lib/siteConfig";


// /newsroom stays open so the desk can keep writing while the public site is down.
// The discovery surfaces stay open too: rewriting them to the maintenance HTML would
// serve a 200 text/html body where Google expects XML, which Search Console reports as
// a malformed sitemap/feed rather than as a temporary outage (SEO audit, issue F46).
// robots.txt in particular must keep answering during a maintenance window — it is how
// a crawler is told what to do while the site is down.
const OPEN_PREFIXES = [
  "/newsroom",
  "/api",
  "/_next",
  "/logo.png",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/news-sitemap.xml",
  "/feed.xml",
];

// Seed/demo articles retired by the 2026-09-22 SEO cleanup. They were indexed, so
// they get 410 (permanently gone) rather than 404 — 410 drops out of the index faster
// and tells Google not to recrawl. Unpublishing alone would only ever yield a 404.
// Keep in sync with supabase/SEO_PHASE2.sql.
const GONE_ARTICLES = new Set([
  "demo-draft-mela",
  "demo-draft-videsh",
  "demo-sansad-satr",
  "demo-up-vikas-yojana",
  "demo-cricket-jeet",
  "demo-share-bazar",
  "demo-ai-takneek",
  "demo-swasthya-abhiyan",
  "demo-indore-metro",
  "demo-indore-swachhta",
  "demo-indore-rajwada",
  "demo-indore-sarafa",
  "a1",
  "ap",
  "fb",
  "cjp",
  "Janshakti Ujala",
  // Generic seed articles — not demo-named, but never reported by the desk.
  // Retired 2026-09-22 on the user's instruction.
  "sansad-shiksha-vidheyak-charcha",
  "kisan-sinchai-yojana",
  "monsoon-dengue-satark",
  "paanch-takniki-kendra",
  "nai-film-sau-crore",
  "share-bazaar-record",
  "jalvayu-sammelan-bharat-bhumika",
  "rajya-chunav-gathbandhan-ranniti",
  "bharat-cricket-shrinkhla-badhat",
  "sangeet-samaroh-kalakar",
  "laghu-udyog-rin-yojana",
  "yuva-khiladi-record",
]);

export function middleware(req: NextRequest) {
  const { pathname: reqPath } = req.nextUrl;
  if (reqPath.startsWith("/samachar/")) {
    const raw = reqPath.slice("/samachar/".length);
    // decodeURIComponent throws on a malformed %-sequence; middleware runs on every
    // request, so a throw here would 500 the whole site. Fall back to the raw value.
    let slug = raw;
    try {
      slug = decodeURIComponent(raw);
    } catch {
      /* keep raw */
    }
    if (GONE_ARTICLES.has(slug)) return new NextResponse(null, { status: 410 });
  }

  if (!MAINTENANCE) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (OPEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }
  if (pathname === "/nirmanadhin") return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/nirmanadhin";
  const headers = new Headers(req.headers);
  headers.set("x-maintenance", "1");
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
