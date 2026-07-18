"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getNewsroomClient } from "@/lib/supabase/newsroom";
import type { Profile } from "@/lib/supabase/types";

// Session + profile gate for /newsroom pages. Redirects to login when there is
// no session. RLS remains the real security boundary; this is UX only.
export function useNewsroomProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getNewsroomClient();
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/newsroom/login");
        return;
      }
      const { data: row } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      if (cancelled) return;
      if (!row) {
        // Authenticated user without a profiles row can do nothing under RLS —
        // send them back to login instead of an eternal spinner.
        await supabase.auth.signOut();
        router.replace("/newsroom/login");
        return;
      }
      setProfile(row as Profile);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return { profile, loading };
}
