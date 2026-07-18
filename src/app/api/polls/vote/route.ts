import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// poll_options has no anon write policy (service-role only), so this thin route is
// the only vote path. Double-voting is guarded best-effort client-side (localStorage).
export async function POST(req: NextRequest) {
  const { optionId } = await req.json();
  if (typeof optionId !== "string" || optionId.length === 0) {
    return NextResponse.json({ error: "अमान्य विकल्प" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.rpc("increment_poll_vote", { option_id: optionId });
  if (error) {
    return NextResponse.json({ error: "कुछ गड़बड़ हुई" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
