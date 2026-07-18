import type { Metadata } from "next";
import { searchArticles } from "@/lib/api/articles";
import { ArticleCard } from "@/components/news/ArticleCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "खोज परिणाम",
};

type Props = { searchParams: { q?: string } };

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q ?? "").trim();

  if (!q) {
    return (
      <div className="container-x py-8">
        <h1 className="section-header mb-6">खोज परिणाम</h1>
        <p className="text-muted">कृपया कोई शब्द खोजें।</p>
      </div>
    );
  }

  const results = await searchArticles(q);

  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">खोज परिणाम</h1>
      <p className="mb-6 text-sm text-muted">
        &quot;{q}&quot; के लिए {results.length} परिणाम
      </p>
      {results.length === 0 ? (
        <p className="text-muted">कोई परिणाम नहीं मिला।</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
          {results.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
