// Self-check for the pure formatting helpers. Run: npm run test:utils
// Node strips the TS types; no test framework needed.
import assert from "node:assert/strict";
import {
  slugify,
  truncate,
  firstParagraph,
  readingTimeLabel,
} from "../src/lib/utils/format.ts";
import { shareLinks } from "../src/lib/utils/share.ts";

// Hindi → Roman slug, ASCII-only, hyphenated, no leading/trailing dashes.
const s = slugify("संसद के मानसून सत्र में नए शिक्षा विधेयक पर चर्चा");
assert.match(s, /^[a-z0-9-]+$/, "slug must be ascii kebab-case");
assert.ok(!s.startsWith("-") && !s.endsWith("-"), "no edge dashes");

// Suffix is appended for uniqueness.
assert.equal(slugify("खेल", "ab12"), `${slugify("खेल")}-ab12`);

// Empty/symbol-only title falls back, never empty.
assert.equal(slugify("!!!"), "lekh");

// truncate respects max and adds an ellipsis on cut, leaves short strings alone.
assert.equal(truncate("छोटा", 100), "छोटा");
const t = truncate("एक दो तीन चार पांच छह सात आठ नौ दस", 10);
assert.ok(t.endsWith("…") && t.length <= 12);

// firstParagraph returns text before the first blank line.
assert.equal(firstParagraph("पहला\n\nदूसरा"), "पहला");

assert.equal(readingTimeLabel(0), "1 मिनट पढ़ें");
assert.equal(readingTimeLabel(4), "4 मिनट पढ़ें");

// shareLinks encodes url + title into each network target.
const links = shareLinks("https://x.in/a", "शीर्षक");
assert.ok(links.whatsapp.includes(encodeURIComponent("शीर्षक")));
assert.ok(links.twitter.includes(encodeURIComponent("https://x.in/a")));

console.log("OK: utils self-check passed");
