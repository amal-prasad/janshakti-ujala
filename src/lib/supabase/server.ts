import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
}

// Anon, RLS-restricted client for server-side reads (only published/public rows).
export function createServerClient() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  // Supabase's newer dashboard issues this as "publishable key" — same anon
  // role, new name. Support both so either key style works.
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });
}

// Service-role client — bypasses RLS. Cron + write APIs only. Never import this
// into a client component.
export function createAdminClient() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false },
  });
}
