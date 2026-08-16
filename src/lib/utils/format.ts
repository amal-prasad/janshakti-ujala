// Pure formatting helpers. No DOM, no Supabase — unit-tested in scripts/test-utils.mjs.
import { slugify as romanize } from "transliteration";

// Hindi date, e.g. "24 जून 2026". Falls back gracefully on a bad input.
const dateFmt = new Intl.DateTimeFormat("hi-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

export function formatDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  return dateFmt.format(d);
}

// Relative-ish label for tickers/cards, e.g. "अभी", "5 मिनट पहले", "3 घंटे पहले".
export function timeAgo(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "अभी";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} मिनट पहले`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} घंटे पहले`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} दिन पहले`;
  return formatDate(d);
}

export function readingTimeLabel(minutes: number): string {
  return `${Math.max(1, minutes)} मिनट पढ़ें`;
}

// Hindi→Roman URL slug. Appends a short suffix when given an id to guarantee
// uniqueness (titles can repeat).
export function slugify(title: string, suffix?: string): string {
  const base = romanize(title, { lowercase: true, separator: "-" })
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const safe = base || "lekh";
  return suffix ? `${safe}-${suffix}` : safe;
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// First paragraph (blank-line separated) as a summary fallback when `dek` is null.
export function firstParagraph(body: string): string {
  return body.split(/\n\s*\n/)[0]?.trim() ?? "";
}
