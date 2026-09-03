import { createServerClient } from "@/lib/supabase/server";
import { getBreakingArticles, type BreakingItem } from "@/lib/api/articles";

// `live_news` has no automated feed (ingestion dropped 2026-07-05 — CLAUDE.md
// hard rule); the table renders whatever is in it, merged with `is_breaking`
// articles below. Never copy external news bodies into `articles`.
async function getLiveNewsRows(limit: number): Promise<BreakingItem[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("live_news")
      .select("headline,source_url,published_at")
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []).map((r) => ({
      headline: r.headline,
      href: r.source_url,
      published_at: r.published_at,
    }));
  } catch {
    return [];
  }
}

// Merged ticker feed: `live_news` rows + `is_breaking` articles, newest first.
export async function getLiveNews(limit = 12): Promise<BreakingItem[]> {
  const [liveRows, articleRows] = await Promise.all([
    getLiveNewsRows(limit),
    getBreakingArticles(limit),
  ]);
  return [...liveRows, ...articleRows]
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .slice(0, limit);
}
