export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticles } from "@/lib/api/articles";
import { getCategory } from "@/lib/categories";
import { LoadMoreArticles } from "@/components/news/LoadMoreArticles";

type Params = { params: { category: string } };

export function generateMetadata({ params }: Params): Metadata {
  const cat = getCategory(params.category);
  return { title: cat ? `${cat.name} की खबरें` : "श्रेणी" };
}

// Category hub — every nav/"सभी देखें" link lands here. Server-renders the
// first page, then the load-more button appends via /api/articles.
export default async function CategoryPage({ params }: Params) {
  const cat = getCategory(params.category);
  if (!cat) notFound();

  const page = await getArticles({ category: cat.slug, limit: 12 });

  return (
    <div className="container-x py-8">
      <h1 className="section-header text-2xl">{cat.name}</h1>
      {page.items.length === 0 ? (
        <p className="py-16 text-center text-muted">
          इस श्रेणी में अभी कोई खबर प्रकाशित नहीं है।
        </p>
      ) : (
        <div className="mt-6">
          <LoadMoreArticles initial={page} category={cat.slug} />
        </div>
      )}
    </div>
  );
}
