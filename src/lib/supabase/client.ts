"use client";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Browser singleton (anon key, RLS-restricted) for the few client-side reads that
// don't go through an /api route.
let cached: ReturnType<typeof createClient<Database>> | undefined;

export function getBrowserClient() {
  if (!cached) {
    cached = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      // Supabase's newer dashboard issues this as "publishable key" — same anon
      // role, new name. Support both so either key style works.
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
      { auth: { persistSession: false } },
    );
  }
  return cached;
}
