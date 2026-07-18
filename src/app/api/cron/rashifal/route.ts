import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { zodiacSigns } from "@/lib/zodiacSigns";

export const dynamic = "force-dynamic";

// Daily Gemini horoscope → rashifal table. Auto-published (is_published = true):
// manual Studio review was dropped 2026-07-05 in favor of the programmatic sanity
// checks below (reject empty/malformed output, reject a prediction identical to
// yesterday's for the same sign).
type GeminiRow = {
  sign: string;
  prediction: string;
  lucky_number: number | null;
  lucky_color: string | null;
};

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (req.headers.get("authorization") === `Bearer ${secret}`) return true;
  // Local dev only — query strings leak into server logs (see CLAUDE.md).
  return (
    process.env.NODE_ENV !== "production" &&
    req.nextUrl.searchParams.get("secret") === secret
  );
}

async function generateRashifal(dateLabel: string): Promise<GeminiRow[]> {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const slugs = zodiacSigns.map((z) => `${z.slug} (${z.name})`).join(", ");
  const prompt =
    `आज (${dateLabel}) के लिए 12 राशियों का दैनिक राशिफल हिंदी (देवनागरी) में लिखें। ` +
    `हर राशि के लिए 2-3 वाक्य का prediction, 1-9 का lucky_number, और एक lucky_color (हिंदी में) दें। ` +
    `sign फ़ील्ड में ये roman slug ही इस्तेमाल करें: ${slugs}. ` +
    `केवल JSON array लौटाएँ: [{"sign","prediction","lucky_number","lucky_color"}]`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return JSON.parse(text) as GeminiRow[];
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const supabase = createAdminClient();

  let rows: GeminiRow[];
  try {
    rows = await generateRashifal(today);
  } catch (e) {
    return NextResponse.json(
      { error: `gemini failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 502 },
    );
  }

  // Sanity check 1: exactly the 12 known signs, each with a non-empty prediction.
  const valid = new Set(zodiacSigns.map((z) => z.slug));
  const bySign = new Map(
    rows
      .filter((r) => valid.has(r.sign) && typeof r.prediction === "string" && r.prediction.trim())
      .map((r) => [r.sign, r]),
  );
  if (bySign.size !== zodiacSigns.length) {
    return NextResponse.json(
      { error: `rejected: expected 12 valid signs, got ${bySign.size}` },
      { status: 502 },
    );
  }

  // Sanity check 2: reject any prediction byte-identical to yesterday's for that sign
  // (stuck/cached model output). Whole batch is rejected — a half-day set is worse
  // than yesterday's set staying up.
  const { data: prev } = await supabase
    .from("rashifal")
    .select("sign,prediction")
    .eq("date", yesterday);
  const prevBySign = new Map((prev ?? []).map((r) => [r.sign, r.prediction]));
  const todayRows = Array.from(bySign.values());
  const stale = todayRows.filter(
    (r) => prevBySign.get(r.sign) === r.prediction,
  );
  if (stale.length > 0) {
    return NextResponse.json(
      { error: `rejected: ${stale.length} prediction(s) identical to yesterday` },
      { status: 502 },
    );
  }

  const { error } = await supabase.from("rashifal").upsert(
    todayRows.map((r) => ({
      sign: r.sign,
      date: today,
      prediction: r.prediction.trim(),
      lucky_number: Number.isInteger(r.lucky_number) ? r.lucky_number : null,
      lucky_color: r.lucky_color || null,
      is_published: true,
    })),
    { onConflict: "sign,date" },
  );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, date: today, count: bySign.size });
}
