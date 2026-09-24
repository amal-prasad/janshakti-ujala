import type { Metadata } from "next";
import { getArticles } from "@/lib/api/articles";
import { LoadMoreArticles } from "@/components/news/LoadMoreArticles";

// Reads live data per request (Supabase-backed).
// ISR, not per-request SSR. Every public route used to be force-dynamic, so Vercel
// served no-store on every hit and TTFB was ~2.8s on mobile — 80% of a 3.5s LCP
// (SEO audit, issue F36). 60s gives a CDN hit for almost every reader; a newly
// published article appears within a minute.
export const revalidate = 60;

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
