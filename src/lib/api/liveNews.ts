import { createServerClient } from "@/lib/supabase/server";
import type { LiveNews } from "@/lib/supabase/types";

// GNews-sourced headlines for the breaking-news ticker. Leads-only — links out,
// never copied into articles (CLAUDE.md hard rule).
export async function getLiveNews(limit = 12): Promise<LiveNews[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("live_news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
