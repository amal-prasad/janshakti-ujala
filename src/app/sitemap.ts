export const dynamic = "force-dynamic";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { getAllArticleSlugs } from "@/lib/api/articles";
import { getGalleries } from "@/lib/api/gallery";

export const revalidate = 3600;

// Public static routes only — /search (query-driven), /newsroom (auth) and
// /api/* are deliberately excluded.
const STATIC_ROUTES: {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}[] = [
  { path: "", changeFrequency: "hourly", priority: 1 },
  { path: "/samachar", changeFrequency: "hourly", priority: 0.9 },
  { path: "/rashifal", changeFrequency: "daily", priority: 0.8 },
  { path: "/epaper", changeFrequency: "daily", priority: 0.8 },
  { path: "/video", changeFrequency: "daily", priority: 0.7 },
  { path: "/gallery", changeFrequency: "daily", priority: 0.7 },
  { path: "/polls", changeFrequency: "weekly", priority: 0.5 },
  { path: "/newsletter", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, galleries] = await Promise.all([
    getAllArticleSlugs(),
    getGalleries(100),
  ]);

  return [
    ...STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency,
      priority,
    })),
    ...articles.map(({ slug, updated_at }) => ({
      url: `${siteConfig.url}/samachar/${slug}`,
      lastModified: new Date(updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...galleries.map(({ slug, published_at }) => ({
      url: `${siteConfig.url}/gallery/${slug}`,
      lastModified: new Date(published_at),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
