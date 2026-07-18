export const dynamic = "force-dynamic";
import { getArticles, getFeaturedArticles, getTrendingArticles } from "@/lib/api/articles";
import { buildOrganizationSchema, buildWebSiteSchema, jsonLdScript } from "@/lib/utils/structuredData";
import { getRashifalTeaser } from "@/lib/api/rashifal";
import { getLatestVideos } from "@/lib/api/videos";
import { HeroCard } from "@/components/news/HeroCard";
import { ArticleCard } from "@/components/news/ArticleCard";
import { ArticleCardSmall } from "@/components/news/ArticleCardSmall";
import { CategorySection } from "@/components/news/CategorySection";
import { Sidebar } from "@/components/news/Sidebar";
import { HolidaysWidget } from "@/components/news/HolidaysWidget";
import { AdSlot } from "@/components/AdSlot";

export default async function Home() {
  const [featured, rashtriya, rajneeti, latest, trending, rashifal, videos] = await Promise.all([
    getFeaturedArticles(6),
    getArticles({ category: "rashtriya", limit: 4 }),
    getArticles({ category: "rajneeti", limit: 4 }),
    getArticles({ limit: 6 }),
    getTrendingArticles(5),
    getRashifalTeaser(),
    getLatestVideos(4),
  ]);

  const [hero, ...rest] = featured;
  const gridFour = rest.slice(0, 4);

  if (!hero) {
    return (
      <div className="container-x py-20 text-center text-muted">
        अभी कोई समाचार प्रकाशित नहीं है।
      </div>
    );
  }

  return (
    <div className="container-x grid grid-cols-1 gap-12 py-8 lg:grid-cols-12 lg:gap-x-12">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(buildOrganizationSchema()) }}
      />
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(buildWebSiteSchema()) }}
      />
      <div className="flex flex-col gap-12 lg:col-span-8">
        <HeroCard article={hero} />

        {gridFour.length > 0 && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
            {gridFour.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}

        <CategorySection category="rashtriya" articles={rashtriya.items} />

        <AdSlot slot="infeed" />

        <section>
          <h2 className="section-header">अन्य खबरें</h2>
          <div className="mt-4 flex flex-col gap-5">
            {latest.items.map((a) => (
              <div key={a.id} className="border-b border-border pb-5 last:border-0 last:pb-0">
                <ArticleCardSmall article={a} />
              </div>
            ))}
          </div>
        </section>

        <CategorySection category="rajneeti" articles={rajneeti.items} />

        <HolidaysWidget />
      </div>

      <div className="lg:col-span-4">
        <Sidebar trending={trending} rashifal={rashifal} videos={videos} />
      </div>
    </div>
  );
}
