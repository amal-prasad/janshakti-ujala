"use client";
import { useState } from "react";
import { ArticleCard } from "@/components/news/ArticleCard";
import type { ArticleCard as ArticleCardData, ArticlePage } from "@/lib/api/articles";

// Renders an initial server-fetched page, then appends more via /api/articles.
export function LoadMoreArticles({
  initial,
  category,
  tag,
}: {
  initial: ArticlePage;
  category?: string;
  tag?: string;
}) {
  const [items, setItems] = useState<ArticleCardData[]>(initial.items);
  const [cursor, setCursor] = useState<string | null>(initial.nextCursor);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!cursor) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (tag) params.set("tag", tag);
      params.set("cursor", cursor);
      const res = await fetch(`/api/articles?${params}`);
      const page: ArticlePage = await res.json();
      setItems((prev) => [...prev, ...page.items]);
      setCursor(page.nextCursor);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
        {items.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
      {cursor && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="border border-primary px-6 py-2 font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
          >
            {loading ? "लोड हो रहा है…" : "और खबरें लोड करें"}
          </button>
        </div>
      )}
    </>
  );
}
