// The fixed sections. `slug` is the Roman URL segment under /shreni/[category];
// `name` is the Hindi label shown in nav, headers and cards. `indore` leads —
// regional coverage is the paper's home turf.
export type Category = {
  slug: string;
  name: string;
};

export const categories: Category[] = [
  { slug: "indore", name: "इंदौर" },
  { slug: "rashtriya", name: "राष्ट्रीय" },
  { slug: "antarrashtriya", name: "अंतरराष्ट्रीय" },
  { slug: "rajneeti", name: "राजनीति" },
  { slug: "vyapar", name: "व्यापार" },
  { slug: "khel", name: "खेल" },
  { slug: "manoranjan", name: "मनोरंजन" },
  { slug: "praudyogiki", name: "प्रौद्योगिकी" },
  { slug: "swasthya", name: "स्वास्थ्य" },
  // Fact-check desk. Articles here carry a `verdict` (सच / झूठ / भ्रामक).
  { slug: "fact-check", name: "सच या झूठ" },
];

// Fact-check desk: articles in this category get a verdict badge.
export const FACT_CHECK_SLUG = "fact-check";

const bySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return bySlug.get(slug);
}

export function categoryName(slug: string): string {
  return bySlug.get(slug)?.name ?? slug;
}
