import { getRelatedArticles } from "@/lib/api/articles";
import { ArticleCard } from "@/components/news/ArticleCard";
import type { Article } from "@/lib/supabase/types";

// Server component: same-category articles below the story.
export async function RelatedArticles({ article }: { article: Article }) {
  const related = await getRelatedArticles(article, 3);
  if (related.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="section-header mb-6">संबंधित खबरें</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
        {related.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}
