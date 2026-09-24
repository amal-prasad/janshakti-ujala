// Self-check for the pure formatting helpers. Run: npm run test:utils
// Node strips the TS types; no test framework needed.
import assert from "node:assert/strict";
import {
  slugify,
  isValidSlug,
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

// slugify caps length at 80 and the suffix still survives the cap.
const longTitle =
  "महिला एशिया कप फाइनल में श्रीलंका को रौंदकर रिकॉर्ड आठवीं बार चैंपियन बना भारत चमकीं शेफाली विवाद के चलते बेटियों ने 72 रनों की धमाकेदार जीत के साथ बिना ट्रॉफी के मनाया जश्न";
const long = slugify(longTitle);
assert.ok(long.length <= 80, "slug must not exceed 80 chars");
assert.ok(!long.endsWith("-"), "capped slug must not end with a dash");
const longWithSuffix = slugify(longTitle, "ab12");
assert.ok(longWithSuffix.length <= 80, "slug+suffix must not exceed 80 chars");
assert.ok(longWithSuffix.endsWith("-ab12"), "suffix must survive the cap");

// isValidSlug: length + kebab-case rules.
assert.ok(isValidSlug("ab-cd"));
assert.ok(!isValidSlug("ap"), "too short");
assert.ok(!isValidSlug("a".repeat(81)), "too long");
assert.ok(!isValidSlug("Janshakti Ujala"), "no spaces/uppercase");

assert.equal(readingTimeLabel(0), "1 मिनट पढ़ें");
assert.equal(readingTimeLabel(4), "4 मिनट पढ़ें");

// shareLinks encodes url + title into each network target.
const links = shareLinks("https://x.in/a", "शीर्षक");
assert.ok(links.whatsapp.includes(encodeURIComponent("शीर्षक")));
assert.ok(links.twitter.includes(encodeURIComponent("https://x.in/a")));

console.log("OK: utils self-check passed");
