import { createServerClient } from "@/lib/supabase/server";
import type { Poll, PollOption } from "@/lib/supabase/types";

// No FK-embedding used anywhere in this codebase (kept consistent) — two queries.
export async function getActivePoll(): Promise<{ poll: Poll; options: PollOption[] } | null> {
  const supabase = createServerClient();
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (pollError) throw pollError;
  if (!poll) return null;

  const { data: options, error: optionsError } = await supabase
    .from("poll_options")
    .select("*")
    .eq("poll_id", poll.id)
    .order("sort_order", { ascending: true });
  if (optionsError) throw optionsError;

  return { poll, options: options ?? [] };
}
