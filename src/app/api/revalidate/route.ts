import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

// Called by /newsroom after a save or delete. Public pages are ISR (revalidate
// = 60), and newsroom writes go straight from the browser to Supabase, so
// without this the change only appears after the cache expires AND someone
// visits. Staff session required so anonymous callers can't force rebuilds.
export async function POST() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response(null, { status: 401 });

  // ponytail: purge every page — an article shows on home, category, state,
  // listing, sitemap and feed; per-path targeting isn't worth the bookkeeping.
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true });
}
