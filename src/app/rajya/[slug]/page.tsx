export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticles } from "@/lib/api/articles";
import { getState } from "@/lib/states";
import { LoadMoreArticles } from "@/components/news/LoadMoreArticles";

type Params = { params: { slug: string } };

export function generateMetadata({ params }: Params): Metadata {
  const state = getState(params.slug);
  return { title: state ? `${state.name} की खबरें` : "राज्य" };
}

export default async function StatePage({ params }: Params) {
  const state = getState(params.slug);
  if (!state) notFound();

  const page = await getArticles({ state: state.name, limit: 12 });

  return (
    <div className="container-x py-8">
      <h1 className="section-header text-2xl">{state.name}</h1>
      <p className="mt-1 text-sm text-muted">
        प्रमुख शहर: {state.cities.join(", ")}
      </p>
      {page.items.length === 0 ? (
        <p className="py-16 text-center text-muted">
          {state.name} से जुड़ी अभी कोई खबर प्रकाशित नहीं है।
        </p>
      ) : (
        <div className="mt-6">
          <LoadMoreArticles initial={page} state={state.name} />
        </div>
      )}
    </div>
  );
}
