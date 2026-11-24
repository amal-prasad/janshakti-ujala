// The fixed sections. `slug` is the Roman URL segment under /shreni/[category];
// This order drives navigation, homepage sections and the newsroom selector.
// Regional coverage leads, followed by national news and specialist sections.
export type Category = {
  slug: string;
  name: string;
};

export const categories: Category[] = [
  { slug: "antarrashtriya", name: "अन्तर्राष्ट्रीय" },
  { slug: "rashtriya", name: "राष्ट्रीय" },
  { slug: "rajneeti", name: "राजनीति" },
  { slug: "madhya-pradesh", name: "मध्यप्रदेश" },
  // States other than मध्य प्रदेश; the state itself is the `state` field.
  // राष्ट्रीय is kept for news of national importance.
  { slug: "anya-pradesh", name: "अन्य प्रदेश" },
  { slug: "vyapar", name: "व्यापार" },
  { slug: "khel", name: "खेल" },
  { slug: "manoranjan", name: "मनोरंजन" },
  { slug: "praudyogiki", name: "प्रौद्योगिकी" },
  { slug: "shiksha-career", name: "शिक्षा और करियर" },
  { slug: "swasthya", name: "स्वास्थ्य" },
  { slug: "dharm", name: "धर्म" },
];

const bySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return bySlug.get(slug === "indore" ? "madhya-pradesh" : slug);
}

export function normalizeArticleCategories(category: string, extra: string[] = []) {
  const primary = category === "indore" ? "madhya-pradesh" : category;
  return {
    category: primary,
    categories: Array.from(new Set([primary, ...extra.map((c) => c === "indore" ? "madhya-pradesh" : c)])),
  };
}

// Include legacy rows until every database has applied the Indore migration.
export function categoryFilter(slug: string): string | null {
  const category = getCategory(slug)?.slug;
  if (!category) return null;
  const aliases = category === "madhya-pradesh" ? [category, "indore"] : [category];
  return aliases.flatMap((c) => [`category.eq.${c}`, `categories.cs.{${c}}`]).join(",");
}

// Retired slugs still on old rows — label them in Hindi, never the raw slug.
const legacyNames: Record<string, string> = { pradesh: "प्रदेश" };

export function categoryName(slug: string): string {
  return getCategory(slug)?.name ?? legacyNames[slug] ?? slug;
}
