import type { Metadata } from "next";
import { getArticles } from "@/lib/api/articles";
import { LoadMoreArticles } from "@/components/news/LoadMoreArticles";

// Reads live data per request (Supabase-backed).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ताज़ा समाचार",
  description: "जनशक्ति उजाला पर पढ़ें देश-दुनिया की ताज़ा खबरें।",
};

export default async function SamacharPage() {
  const initial = await getArticles({ limit: 12 });
  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">ताज़ा समाचार</h1>
      <LoadMoreArticles initial={initial} />
    </div>
  );
}
