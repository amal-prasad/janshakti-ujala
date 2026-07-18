// Demo newsroom users + demo articles, created through the Supabase admin API
// (cleaner than the raw-SQL GoTrue bypass in supabase/seed-newsroom-users.sql).
// Run: node --env-file=.env.local scripts/seed-demo.mjs
// Idempotent: existing users/slugs are left alone.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

// Same credentials as supabase/seed-newsroom-users.sql documents.
const USERS = [
  { email: "editor@test.local", password: "editor-test-pw", role: "editor", display_name: "डेमो संपादक" },
  { email: "reporter@test.local", password: "reporter-test-pw", role: "reporter", display_name: "डेमो संवाददाता" },
];

async function ensureUser({ email, password, role, display_name }) {
  // ponytail: listUsers page 1 is plenty for a tiny demo project.
  const { data, error } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  let user = data.users.find((u) => u.email === email);
  if (!user) {
    const res = await db.auth.admin.createUser({ email, password, email_confirm: true });
    if (res.error) throw res.error;
    user = res.data.user;
    console.log(`created user ${email}`);
  } else {
    console.log(`user ${email} exists`);
  }
  const { error: pErr } = await db.from("profiles").upsert({ id: user.id, role, display_name });
  if (pErr) throw pErr;
  return user.id;
}

const body = (topic) =>
  `${topic} को लेकर आज महत्वपूर्ण घटनाक्रम सामने आया। अधिकारियों ने बताया कि स्थिति पर लगातार नज़र रखी जा रही है और आवश्यक कदम उठाए जा रहे हैं।

स्थानीय स्तर पर लोगों ने इस फैसले का स्वागत किया है। विशेषज्ञों का मानना है कि आने वाले दिनों में इसका व्यापक असर देखने को मिलेगा।

**मुख्य बिंदु**

- प्रशासन ने विस्तृत योजना जारी की
- अगले सप्ताह समीक्षा बैठक प्रस्तावित
- नागरिकों से सहयोग की अपील

यह एक डेमो लेख है, जिसे न्यूज़रूम परीक्षण के लिए जोड़ा गया है।`;

const img = (n) => `https://picsum.photos/seed/ju-demo-${n}/1200/675`;

async function main() {
  const editorId = await ensureUser(USERS[0]);
  const reporterId = await ensureUser(USERS[1]);

  const published = [
    { slug: "demo-up-vikas-yojana", title: "उत्तर प्रदेश में नई विकास योजना की घोषणा, हज़ारों को मिलेगा रोज़गार", category: "rashtriya", is_featured: true, is_breaking: false },
    { slug: "demo-sansad-satr", title: "संसद का मानसून सत्र शुरू, कई अहम विधेयक पेश होंगे", category: "rajneeti", is_featured: true, is_breaking: true },
    { slug: "demo-cricket-jeet", title: "भारतीय क्रिकेट टीम की शानदार जीत, श्रृंखला पर कब्ज़ा", category: "khel", is_featured: true, is_breaking: false },
    { slug: "demo-share-bazar", title: "शेयर बाज़ार में उछाल, सेंसेक्स नई ऊँचाई पर", category: "vyapar", is_featured: true, is_breaking: false },
    { slug: "demo-ai-takneek", title: "स्वदेशी एआई तकनीक से बदलेगी शिक्षा की तस्वीर", category: "praudyogiki", is_featured: true, is_breaking: false },
    { slug: "demo-swasthya-abhiyan", title: "ज़िले में स्वास्थ्य जाँच अभियान, हज़ारों ने कराई निःशुल्क जाँच", category: "swasthya", is_featured: true, is_breaking: false },
  ].map((a, i) => ({
    ...a,
    dek: "डेमो लेख — न्यूज़रूम परीक्षण के लिए।",
    body: body(a.title.split(",")[0]),
    cover_image_url: img(i + 1),
    author: "डेमो संपादक",
    author_id: editorId,
    is_published: true,
    published_at: new Date(Date.now() - i * 3600_000).toISOString(),
  }));

  const drafts = [
    { slug: "demo-draft-mela", title: "ड्राफ्ट: स्थानीय मेले की तैयारियाँ ज़ोरों पर", category: "manoranjan" },
    { slug: "demo-draft-videsh", title: "ड्राफ्ट: विदेश नीति पर विशेषज्ञों की राय", category: "antarrashtriya" },
  ].map((a, i) => ({
    ...a,
    dek: "डेमो ड्राफ्ट — संवाददाता के स्वामित्व में।",
    body: body(a.title),
    cover_image_url: img(10 + i),
    author: "डेमो संवाददाता",
    author_id: reporterId,
    is_published: false,
  }));

  const { error } = await db
    .from("articles")
    .upsert([...published, ...drafts], { onConflict: "slug", ignoreDuplicates: true });
  if (error) throw error;
  console.log(`seeded ${published.length} published + ${drafts.length} draft articles (existing slugs skipped)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
