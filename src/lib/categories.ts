// The 8 fixed sections. `slug` is the Roman URL segment under /shreni/[category];
// `name` is the Hindi label shown in nav, headers and cards.
export type Category = {
  slug: string;
  name: string;
};

export const categories: Category[] = [
  { slug: "rashtriya", name: "राष्ट्रीय" },
  { slug: "antarrashtriya", name: "अंतरराष्ट्रीय" },
  { slug: "rajneeti", name: "राजनीति" },
  { slug: "vyapar", name: "व्यापार" },
  { slug: "khel", name: "खेल" },
  { slug: "manoranjan", name: "मनोरंजन" },
  { slug: "praudyogiki", name: "प्रौद्योगिकी" },
  { slug: "swasthya", name: "स्वास्थ्य" },
];

const bySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return bySlug.get(slug);
}

export function categoryName(slug: string): string {
  return bySlug.get(slug)?.name ?? slug;
}
