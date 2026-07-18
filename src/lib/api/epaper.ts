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
