// Sanity check for the pin-then-fill dedupe logic in getTrendingArticles.
// Not a framework test — asserts against fixture arrays mirroring what
// selectCards() would return for the two queries.
import assert from "node:assert/strict";

function dedupeById(rows) {
  const seen = new Set();
  const out = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
  }
  return out;
}

function trendingFromFixtures(pinned, filler, limit) {
  if (pinned.length >= limit) return pinned.slice(0, limit);
  return dedupeById([...pinned, ...filler]).slice(0, limit);
}

// Case 1: pinned articles alone satisfy the limit.
{
  const pinned = [{ id: "p1" }, { id: "p2" }, { id: "p3" }];
  const filler = [{ id: "f1" }, { id: "f2" }];
  const result = trendingFromFixtures(pinned, filler, 2);
  assert.deepEqual(result, [{ id: "p1" }, { id: "p2" }]);
}

// Case 2: pinned + filler, filler overlaps a pinned id (also returned by the
// view_count query) — must not duplicate.
{
  const pinned = [{ id: "p1" }];
  const filler = [{ id: "p1" }, { id: "f1" }, { id: "f2" }];
  const result = trendingFromFixtures(pinned, filler, 3);
  assert.deepEqual(result, [{ id: "p1" }, { id: "f1" }, { id: "f2" }]);
}

// Case 3: no pinned articles at all — pure view_count fill.
{
  const pinned = [];
  const filler = [{ id: "f1" }, { id: "f2" }, { id: "f3" }];
  const result = trendingFromFixtures(pinned, filler, 2);
  assert.deepEqual(result, [{ id: "f1" }, { id: "f2" }]);
}

console.log("check-placement: ok");
