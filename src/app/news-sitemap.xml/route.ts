export const dynamic = "force-dynamic";
import { siteConfig } from "@/lib/siteConfig";
import { getRecentPublishedArticles } from "@/lib/api/articles";

// Google News only considers articles from the last 48h; refresh every 15 min.
export const revalidate = 900;

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
