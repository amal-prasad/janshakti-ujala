import assert from "node:assert/strict";
import { categories, categoryFilter, categoryName, getCategory } from "../src/lib/categories.ts";

assert.equal(getCategory("indore")?.slug, "madhya-pradesh");
assert.equal(categoryName("indore"), "मध्य प्रदेश");
assert.ok(!categories.some((c) => c.slug === "indore"));
assert.equal(new Set(categories.map((c) => c.slug)).size, categories.length);
assert.equal(categoryFilter("indore"), categoryFilter("madhya-pradesh"));
assert.ok(categoryFilter("madhya-pradesh")?.includes("categories.cs.{indore}"));
assert.equal(categoryFilter("indore,category.neq.secret"), null);

const { normalizeArticleCategories } = await import("../src/lib/categories.ts");
assert.deepEqual(normalizeArticleCategories("indore", ["indore", "rajneeti", "madhya-pradesh"]), {
  category: "madhya-pradesh", categories: ["madhya-pradesh", "rajneeti"],
});
assert.deepEqual(normalizeArticleCategories("khel", ["indore", "khel"]), {
  category: "khel", categories: ["khel", "madhya-pradesh"],
});

const { parseSocialPost, insertSocialPost } = await import("../src/lib/utils/socialPosts.ts");
assert.deepEqual(parseSocialPost("https://x.com/NewsDesk/status/123456789?s=20"), {
  provider: "twitter", id: "123456789", url: "https://twitter.com/NewsDesk/status/123456789",
});
assert.equal(parseSocialPost("https://mobile.twitter.com/desk/status/123/photo/1")?.id, "123");
assert.equal(parseSocialPost("https://x.com/i/web/status/123")?.id, "123");
assert.equal(parseSocialPost("https://www.instagram.com/reel/Ab_c-12/?igsh=tracking")?.url, "https://www.instagram.com/reel/Ab_c-12/");
assert.equal(parseSocialPost("https://instagram.com/p/Abc123/")?.provider, "instagram");
assert.equal(parseSocialPost("https://youtu.be/dQw4w9WgXcQ?si=tracking")?.id, "dQw4w9WgXcQ");
assert.equal(parseSocialPost("https://www.youtube.com/shorts/dQw4w9WgXcQ")?.provider, "youtube");
for (const url of [
  "javascript:alert(1)", "https://x.com.evil.test/desk/status/123", "https://x.com@evil.test/desk/status/123",
  "https://evil.test@x.com/desk/status/123", "http://x.com/desk/status/123", "https://x.com:444/desk/status/123",
  "https://instagram.com/someprofile/", "https://instagram.com/stories/person/123/", "https://x.com/desk",
  "https://x.com/desk/status/abc", "<script>alert(1)</script>", "https://youtube.com/watch?v=bad",
]) assert.equal(parseSocialPost(url), null, url);

const inserted = insertSocialPost("पहला पैराग्राफ\n\nदूसरा पैराग्राफ", "https://instagram.com/p/Abc123/", 14, 14);
assert.ok(inserted.body.includes("\n\nhttps://www.instagram.com/p/Abc123/\n\n"));
assert.ok(inserted.body.endsWith("दूसरा पैराग्राफ"));
assert.equal(insertSocialPost("", "https://x.com/desk/status/123", 0, 0).body, "https://twitter.com/desk/status/123\n\n");
assert.throws(() => insertSocialPost("body", "https://evil.test", 0, 0));
assert.equal(insertSocialPost("पहला\n\nचयन\n\nअंत", "https://x.com/desk/status/123", 6, 10).body,
  "पहला\n\nhttps://twitter.com/desk/status/123\n\n\nअंत");
console.log("OK: social URLs and category regressions passed");
