// Self-check for local panchang computation. Run: npx tsx scripts/test-panchang.mts
import assert from "node:assert/strict";
import { getTodayPanchang } from "../src/lib/panchang.ts";

const p = await getTodayPanchang();
assert.ok(p, "panchang must not be null");

const fields = [
  "dateLabel", "tithi", "paksha", "nakshatra", "yoga", "karana", "masa",
  "sunrise", "sunset",
] as const;

for (const f of fields) {
  assert.ok(typeof p![f] === "string" && p![f].length > 0, `${f} must be a non-empty string`);
}

const devanagari = /[ऀ-ॿ]/;
assert.match(p!.tithi, devanagari, "tithi must contain Devanagari");
assert.match(p!.nakshatra, devanagari, "nakshatra must contain Devanagari");

console.log("OK: panchang self-check passed", p);
