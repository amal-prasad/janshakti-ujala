export const dynamic = "force-dynamic";
import { siteConfig } from "@/lib/siteConfig";
import { getRecentPublishedArticles } from "@/lib/api/articles";

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
  const articles = await getRecentPublishedArticles(20);

  const items = articles
    .map((a) => {
      const link = `${siteConfig.url}/samachar/${a.slug}`;
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
${a.dek ? `      <description>${escapeXml(a.dek)}</description>\n` : ""}      <category>${escapeXml(a.category)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>hi-IN</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
