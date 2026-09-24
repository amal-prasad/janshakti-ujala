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

const SLUG_MAX = 80;

// Hindi→Roman URL slug. Appends a short suffix when given an id to guarantee
// uniqueness (titles can repeat). Capped at SLUG_MAX, truncated on a "-"
// boundary so words aren't cut mid-way; the suffix is appended after the cap
// so it always survives.
export function slugify(title: string, suffix?: string): string {
  const base = romanize(title, { lowercase: true, separator: "-" })
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  let safe = base || "lekh";
  const cap = suffix ? SLUG_MAX - suffix.length - 1 : SLUG_MAX;
  if (safe.length > cap) {
    safe = safe.slice(0, Math.max(cap, 0)).replace(/-+$/, "") || "lekh";
  }
  return suffix ? `${safe}-${suffix}` : safe;
}

// Validation for slugs typed/edited by hand in the newsroom form (auto-derived
// slugs already satisfy this, but a hand-edited slug can be anything).
export function isValidSlug(s: string): boolean {
  return s.length >= 3 && s.length <= SLUG_MAX && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s);
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// First paragraph (blank-line separated) as a summary fallback when `dek` is null.
export function firstParagraph(body: string): string {
  return body.split(/\n\s*\n/)[0]?.trim() ?? "";
}
