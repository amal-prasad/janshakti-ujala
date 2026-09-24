import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { zodiacSigns } from "@/lib/zodiacSigns";
import { fetchProkeralaRashifal } from "@/lib/api/prokerala";

export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (req.headers.get("authorization") === `Bearer ${secret}`) return true;
  // Local dev only
  return (
    process.env.NODE_ENV !== "production" &&
    req.nextUrl.searchParams.get("secret") === secret
  );
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Use Prokerala API instead of Gemini
  if (!process.env.PROKERALA_CLIENT_ID || !process.env.PROKERALA_CLIENT_SECRET) {
    return NextResponse.json({ error: "Prokerala credentials missing" }, { status: 500 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const supabase = createAdminClient();

  const todayRows = [];

  try {
    for (const z of zodiacSigns) {
      const prediction = await fetchProkeralaRashifal(z.slug, today);
      todayRows.push({
        sign: z.slug,
        date: today,
        prediction: prediction.trim(),
        lucky_number: null, // Not standard in Prokerala default response
        lucky_color: null,  // Not standard in Prokerala default response
        is_published: true,
      });
      // sleep a little bit to avoid rate limits on free tier (5/sec)
      await new Promise(r => setTimeout(r, 250));
    }
  } catch (e) {
    return NextResponse.json(
      { error: `Prokerala failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 502 },
    );
  }

  // Sanity checks before auto-publishing (CLAUDE.md hard rule). Individual
  // predictions are already validated non-empty by fetchProkeralaRashifal; what
  // is checked here is the batch: all 12 signs present, and not a byte-for-byte
  // repeat of yesterday (which means the upstream API is serving a cached or
  // demo day). A failed check rejects the WHOLE batch — a partial day of
  // horoscopes is worse than yesterday's still showing (SEO audit, issue F32).
  if (todayRows.length !== zodiacSigns.length) {
    return NextResponse.json(
      { error: `expected ${zodiacSigns.length} signs, got ${todayRows.length}` },
      { status: 502 },
    );
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const { data: prev } = await supabase
    .from("rashifal")
    .select("sign,prediction")
    .eq("date", yesterday);

  if (prev && prev.length === todayRows.length) {
    const prevBySign = new Map(prev.map((r) => [r.sign, r.prediction]));
    const allIdentical = todayRows.every(
      (r) => prevBySign.get(r.sign) === r.prediction,
    );
    if (allIdentical) {
      return NextResponse.json(
        { error: "every sign is identical to yesterday; batch rejected" },
        { status: 502 },
      );
    }
  }

  const { error } = await supabase.from("rashifal").upsert(
    todayRows,
    { onConflict: "sign,date" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, date: today, count: todayRows.length });
}
