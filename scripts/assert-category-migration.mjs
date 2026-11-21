import assert from "node:assert/strict";

export async function assertCategoryMigration(client, sql) {
  await client.query("begin");
  try {
    await client.query(`insert into public.articles
      (slug, title, body, category, categories, state, city, is_published, published_at)
      values
      ('test-indore-primary', 'इंदौर', 'मूल खबर', 'indore', '{indore,madhya-pradesh,rajneeti}', null, 'इंदौर', true, '2026-01-01'),
      ('test-indore-extra', 'खेल', 'मूल खबर', 'khel', '{khel,indore}', null, 'इंदौर', false, '2026-01-02'),
      ('test-indore-empty', 'खबर', 'मूल खबर', 'indore', '{}', 'राजस्थान', 'इंदौर', false, '2026-01-03'),
      ('test-unrelated', 'अन्य खबर', 'मूल खबर', 'rashtriya', '{rashtriya}', 'राजस्थान', 'जयपुर', true, '2026-01-04')`);
    const query = "select * from public.articles where slug like 'test-%' order by slug";
    const before = (await client.query(query)).rows;
    await client.query(sql);
    const after = (await client.query(query)).rows;
    const primary = after.find((r) => r.slug === "test-indore-primary");
    assert.equal(primary.category, "madhya-pradesh");
    assert.deepEqual(primary.categories, ["madhya-pradesh", "rajneeti"]);
    assert.equal(primary.state, "मध्य प्रदेश");
    const extra = after.find((r) => r.slug === "test-indore-extra");
    assert.equal(extra.category, "khel");
    assert.deepEqual(extra.categories, ["khel", "madhya-pradesh"]);
    assert.equal(extra.state, "मध्य प्रदेश");
    const empty = after.find((r) => r.slug === "test-indore-empty");
    assert.deepEqual(empty.categories, ["madhya-pradesh"]);
    assert.equal(empty.state, "मध्य प्रदेश");
    for (let i = 0; i < before.length; i++) {
      const { category: _c, categories: _cs, state: _s, ...oldFields } = before[i];
      const { category: _c2, categories: _cs2, state: _s2, ...newFields } = after[i];
      assert.deepEqual(newFields, oldFields, "Only category membership and state may change");
    }
    assert.deepEqual(after.find((r) => r.slug === "test-unrelated"), before.find((r) => r.slug === "test-unrelated"));
    await client.query(sql);
    assert.deepEqual((await client.query(query)).rows, after, "Migration must be idempotent");
    console.log("OK: Indore migration preserves stories, drafts, extra sections and timestamps");
  } finally {
    await client.query("rollback");
  }
}
