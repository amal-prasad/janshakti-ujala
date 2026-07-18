import Link from "next/link";
import type { ArticleCard as ArticleCardData } from "@/lib/api/articles";
import { categoryName } from "@/lib/categories";
import { ArticleCard } from "@/components/news/ArticleCard";

export function CategorySection({
  category,
  articles,
}: {
  category: string;
  articles: ArticleCardData[];
}) {
  if (articles.length === 0) return null;

  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="section-header">{categoryName(category)}</h2>
        <Link href={`/shreni/${category}`} className="text-sm font-semibold text-primary hover:underline">
          सभी देखें
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}
