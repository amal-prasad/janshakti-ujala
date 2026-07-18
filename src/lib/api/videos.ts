import { createServerClient } from "@/lib/supabase/server";
import type { Video } from "@/lib/supabase/types";

export async function getLatestVideos(limit = 4): Promise<Video[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

// Full listing for the /video page (vs. the sidebar teaser above).
export async function getAllVideos(limit = 24): Promise<Video[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
