// The fixed sections. `slug` is the Roman URL segment under /shreni/[category];
// `name` is the Hindi label shown in nav, headers and cards. `indore` leads —
// regional coverage is the paper's home turf.
export type Category = {
  slug: string;
  name: string;
};

export const categories: Category[] = [
  { slug: "indore", name: "इंदौर" },
  { slug: "madhya-pradesh", name: "मध्य प्रदेश" },
  // States other than मध्य प्रदेश; the state itself is the `state` field.
  // राष्ट्रीय is kept for news of national importance.
  { slug: "anya-pradesh", name: "अन्य प्रदेश" },
  { slug: "rashtriya", name: "राष्ट्रीय" },
  { slug: "antarrashtriya", name: "अंतरराष्ट्रीय" },
  { slug: "rajneeti", name: "राजनीति" },
  { slug: "vyapar", name: "व्यापार" },
  { slug: "khel", name: "खेल" },
  { slug: "manoranjan", name: "मनोरंजन" },
  { slug: "praudyogiki", name: "प्रौद्योगिकी" },
  { slug: "swasthya", name: "स्वास्थ्य" },
  { slug: "shiksha-career", name: "शिक्षा और करियर" },
];

const bySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return bySlug.get(slug);
}

// Retired slugs still on old rows — label them in Hindi, never the raw slug.
const legacyNames: Record<string, string> = { pradesh: "प्रदेश" };

export function categoryName(slug: string): string {
  return bySlug.get(slug)?.name ?? legacyNames[slug] ?? slug;
}
