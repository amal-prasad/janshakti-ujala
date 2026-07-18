import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// newsletter_subscribers has no anon RLS policy (service-role writes only),
// so this thin route is the only insert path. Confirmation email is P6.
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "अमान्य ईमेल" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, confirmed: false });
  // 23505 = unique_violation — already subscribed, treat as success.
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "कुछ गड़बड़ हुई" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
