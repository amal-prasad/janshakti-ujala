// Adds 4 placeholder newsroom accounts (rename in Supabase Studio once real
// staff are assigned). Mirrors the ensureUser pattern in seed-demo.mjs.
// Run: node --env-file=.env.local scripts/add-newsroom-users.mjs
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

const genPassword = () => randomBytes(9).toString("base64url"); // 12 chars, strong

const USERS = [
  { email: "sanvaddata1@janshaktiujala.local", role: "reporter", display_name: "संवाददाता 1", password: genPassword() },
  { email: "sanvaddata2@janshaktiujala.local", role: "reporter", display_name: "संवाददाता 2", password: genPassword() },
  { email: "sampadak1@janshaktiujala.local", role: "editor", display_name: "संपादक 1", password: genPassword() },
  { email: "sampadak2@janshaktiujala.local", role: "editor", display_name: "संपादक 2", password: genPassword() },
];

async function ensureUser({ email, password, role, display_name }) {
  const { data, error } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  let user = data.users.find((u) => u.email === email);
  if (!user) {
    const res = await db.auth.admin.createUser({ email, password, email_confirm: true });
    if (res.error) throw res.error;
    user = res.data.user;
  } else {
    // Existing user keeps its current password — re-running the script won't
    // silently rotate credentials already handed out.
    console.warn(`user ${email} already exists — password NOT changed`);
  }
  const { error: pErr } = await db.from("profiles").upsert({ id: user.id, role, display_name });
  if (pErr) throw pErr;
}

for (const u of USERS) {
  await ensureUser(u);
}

console.log("\nनया newsroom accounts (URL: /newsroom/login):\n");
for (const u of USERS) {
  console.log(`${u.display_name} (${u.role})  ${u.email}  ${u.password}`);
}
