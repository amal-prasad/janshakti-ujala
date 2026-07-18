import { createServerClient } from "@/lib/supabase/server";
import type { Ad } from "@/lib/supabase/types";

export type AdSlotName = "sidebar" | "infeed" | "footer";

// RLS already filters to active rows within their date window; pick a random
// one in JS since a slot can have multiple active ads. ponytail: fine at this
// scale, add weighting only if paid placements need it.
export async function getAd(slot: AdSlotName): Promise<Ad | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("ads").select("*").eq("slot", slot);
  if (error || !data || data.length === 0) return null;
  return data[Math.floor(Math.random() * data.length)];
}
