import { createServerClient } from "@/lib/supabase/server";
import type { Rashifal } from "@/lib/supabase/types";

// One sign's prediction as a homepage-sidebar teaser. Gated: only is_published
// rows are readable (RLS) — the Prokerala cron auto-publishes after sanity checks;
// rows added by hand in Studio default to false (CLAUDE.md hard rule).
export async function getRashifalTeaser(): Promise<Rashifal | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rashifal")
    .select("*")
    .eq("date", istToday())
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

// Today's date in IST, as stored by the cron (YYYY-MM-DD).
export function istToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// All signs for TODAY — the /rashifal listing page. It used to take the latest
// date in the table, so a failed cron left last week's predictions rendering
// under the heading "आज का राशिफल" indefinitely (SEO audit, issue F31). An
// empty result is the honest answer; the page says so.
export async function getAllRashifalToday(): Promise<Rashifal[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("rashifal")
    .select("*")
    .eq("date", istToday())
    .order("sign")
    .limit(12);
  if (error) throw error;
  return data ?? [];
}
