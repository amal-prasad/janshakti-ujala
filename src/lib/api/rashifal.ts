import { createServerClient } from "@/lib/supabase/server";
import type { Rashifal } from "@/lib/supabase/types";

// One sign's prediction as a homepage-sidebar teaser. Gated: only is_published
// rows are readable (RLS) — the Gemini cron auto-publishes after sanity checks;
// rows added by hand in Studio default to false (CLAUDE.md hard rule).
export async function getRashifalTeaser(): Promise<Rashifal | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rashifal")
    .select("*")
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

// All signs for the latest date — the /rashifal listing page. ponytail: assumes
// ≤12 rows share the latest date (one row per sign per day, per seed/cron pattern).
export async function getAllRashifalToday(): Promise<Rashifal[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rashifal")
    .select("*")
    .order("date", { ascending: false })
    .order("sign")
    .limit(12);
  if (error) throw error;
  return data ?? [];
}
