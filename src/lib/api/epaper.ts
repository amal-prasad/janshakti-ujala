import { createServerClient } from "@/lib/supabase/server";
import type { EpaperEdition } from "@/lib/supabase/types";

// Editions for the /epaper listing page, newest first.
export async function getEpaperEditions(limit = 30): Promise<EpaperEdition[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("epaper_editions")
    .select("*")
    .order("edition_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

// Single edition for the reader page. Returns null when missing (caller should 404).
export async function getEpaperEdition(id: string): Promise<EpaperEdition | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("epaper_editions")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
}
