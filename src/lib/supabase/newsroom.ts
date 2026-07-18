"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

// Authenticated browser client for /newsroom only. Unlike getBrowserClient
// (persistSession: false), this one keeps the Supabase Auth session so RLS
// policies see auth.uid(). RLS is the security boundary — the UI only redirects.
let cached: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getNewsroomClient() {
  if (!cached) {
    cached = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    );
  }
  return cached;
}
