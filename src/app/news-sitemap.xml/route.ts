import { siteConfig } from "@/lib/siteConfig";
import { getRecentPublishedArticles } from "@/lib/api/articles";

// Google News only considers articles from the last 48h.
// 5 minutes, not 15: this is the surface that decides how fast a breaking story
// reaches Google News, so staleness here costs indexation time directly. The number
// used to be dead anyway — `export const dynamic = "force-dynamic"` sat above it and
// takes precedence over `revalidate`, so every crawler hit re-queried Supabase
// (SEO audit, issue F47).
export const revalidate = 300;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await getRecentPublishedArticles(100);
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const recent = articles.filter(
    (a) => new Date(a.published_at).getTime() >= cutoff,
  );

  const urls = recent
    .map(
      (a) => `  <url>
    <loc>${siteConfig.url}/samachar/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(siteConfig.name)}</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.published_at).toISOString()}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
