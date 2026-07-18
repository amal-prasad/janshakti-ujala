import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Supabase's newer dashboard issues this as "publishable key" — same anon
// role, new name. Support both so either key style works.
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!;

// Anon, RLS-restricted client for server-side reads (only published/public rows).
export function createServerClient() {
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });
}

// Service-role client — bypasses RLS. Cron + write APIs only. Never import this
// into a client component.
export function createAdminClient() {
  return createClient<Database>(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}
