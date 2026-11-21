// Read-only unless --apply is passed. Uses the project's existing service role
// without printing secrets. SQL migration provides the equivalent DB operation.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { normalizeArticleCategories } from "../src/lib/categories.ts";

process.loadEnvFile(".env.local");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const filter = "category.eq.indore,categories.cs.{indore}";
const rows: Record<string, any>[] = [];
for (let offset = 0; ; offset += 500) {
  const { data, error } = await db.from("articles").select("*").or(filter).order("id").range(offset, offset + 499);
  if (error) throw new Error(`Could not read articles: ${error.message}`);
  rows.push(...data);
  if (data.length < 500) break;
}
console.log(`Indore articles: ${rows.length}; published: ${rows.filter((r) => r.is_published).length}; drafts: ${rows.filter((r) => !r.is_published).length}`);
if (!process.argv.includes("--apply")) {
  console.log("Read-only check. Pass --apply to migrate these rows.");
} else if (rows.length) {
  const directory = path.resolve(".codex/backups");
  fs.mkdirSync(directory, { recursive: true });
  const backup = path.join(directory, `indore-${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(rows, null, 2), { flag: "wx", mode: 0o600 });
  console.log(`Backup saved: ${backup}`);
  let changed = 0;
  for (const row of rows) {
    const fields = {
      ...normalizeArticleCategories(row.category, row.categories),
      state: row.category === "indore" || !row.state?.trim() ? "मध्य प्रदेश" : row.state,
    };
    // Compare all category fields and the edit timestamp to avoid overwriting a
    // concurrent newsroom edit. A conflict stops the run; a rerun is safe.
    let update = db.from("articles").update(fields).eq("id", row.id)
      .eq("category", row.category).eq("updated_at", row.updated_at)
      .filter("categories", "eq", `{${row.categories.map((c: string) => JSON.stringify(c)).join(",")}}`);
    update = row.state === null ? update.is("state", null) : update.eq("state", row.state);
    const { data, error } = await update.select("*").single();
    if (error) throw new Error(`Migration stopped after ${changed} rows: ${error.message}. Backup: ${backup}`);
    assert.deepEqual(data, { ...row, ...fields }, "Migration unexpectedly changed another article field");
    changed++;
  }
  const { count, error } = await db.from("articles").select("id", { count: "exact", head: true }).or(filter);
  if (error) throw error;
  assert.equal(count, 0, "Indore rows remain; rerun after checking concurrent edits");
  console.log(`Migrated ${changed} articles; no Indore category rows remain. Article URLs and publication metadata preserved.`);
}
