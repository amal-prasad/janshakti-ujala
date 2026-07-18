// Spin up a real embedded Postgres (no Docker needed), apply every migration +
// seed, then read back Hindi rows. Run with: npm run db:verify
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDir = path.join(projectRoot, "supabase", "migrations");
const seedFile = path.join(projectRoot, "supabase", "seed.sql");
const dataDir = path.join(os.tmpdir(), "ju-pgdata-" + Date.now());

const epUrl = pathToFileURL(
  path.join(projectRoot, "node_modules", "embedded-postgres", "dist", "index.js"),
).href;
const EmbeddedPostgres = (await import(epUrl)).default;

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "postgres",
  port: 5544,
  persistent: false,
  // Force UTF8 — a Windows codepage locale otherwise inits the cluster as WIN1252
  // and Devanagari can't be stored. Supabase is always UTF8.
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
});

await pg.initialise();
await pg.start();
const client = pg.getPgClient();
await client.connect();

try {
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files) {
    await client.query(fs.readFileSync(path.join(migrationsDir, f), "utf8"));
    console.log("applied migration:", f);
  }
  await client.query(fs.readFileSync(seedFile, "utf8"));
  console.log("applied seed.sql");

  const checks = {
    articles: "select count(*)::int n from articles",
    published: "select count(*)::int n from articles where is_published",
    live_news: "select count(*)::int n from live_news",
    rashifal_today:
      "select count(*)::int n from rashifal where date = current_date and is_published",
    poll_options: "select count(*)::int n from poll_options",
    galleries: "select count(*)::int n from gallery",
    epapers: "select count(*)::int n from epaper_editions",
    videos: "select count(*)::int n from videos",
  };
  console.log("\n--- counts ---");
  for (const [k, q] of Object.entries(checks)) {
    const r = await client.query(q);
    console.log(`${k}: ${r.rows[0].n}`);
  }

  const sample = await client.query(
    "select title, category, reading_minutes from articles order by published_at desc limit 3",
  );
  console.log("\n--- sample articles (trigger-computed reading_minutes) ---");
  for (const row of sample.rows) {
    console.log(`• [${row.category}] ${row.title} — ${row.reading_minutes} मिनट`);
  }

  await client.query("select increment_view_count($1)", ["share-bazaar-record"]);
  const v = await client.query(
    "select view_count from articles where slug='share-bazaar-record'",
  );
  console.log("\nincrement_view_count → views =", v.rows[0].view_count);

  console.log("\nOK: all migrations + seed applied and queried successfully.");
} finally {
  await client.end();
  await pg.stop();
  try {
    fs.rmSync(dataDir, { recursive: true, force: true });
  } catch {}
}
