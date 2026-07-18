import { createServerClient } from "@/lib/supabase/server";
import type { Gallery } from "@/lib/supabase/types";

export async function getGalleries(limit = 20): Promise<Gallery[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getGalleryBySlug(slug: string): Promise<Gallery | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}
