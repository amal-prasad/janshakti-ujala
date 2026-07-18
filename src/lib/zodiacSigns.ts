// 12 zodiac signs (राशि). `slug` is the Roman URL/key used in the `rashifal`
// table; `name` is the Hindi label; `symbol` is the Unicode glyph.
export type ZodiacSign = {
  slug: string;
  name: string;
  symbol: string;
};

export const zodiacSigns: ZodiacSign[] = [
  { slug: "mesh", name: "मेष", symbol: "♈" },
  { slug: "vrishabh", name: "वृषभ", symbol: "♉" },
  { slug: "mithun", name: "मिथुन", symbol: "♊" },
  { slug: "kark", name: "कर्क", symbol: "♋" },
  { slug: "sinh", name: "सिंह", symbol: "♌" },
  { slug: "kanya", name: "कन्या", symbol: "♍" },
  { slug: "tula", name: "तुला", symbol: "♎" },
  { slug: "vrishchik", name: "वृश्चिक", symbol: "♏" },
  { slug: "dhanu", name: "धनु", symbol: "♐" },
  { slug: "makar", name: "मकर", symbol: "♑" },
  { slug: "kumbh", name: "कुंभ", symbol: "♒" },
  { slug: "meen", name: "मीन", symbol: "♓" },
];

const bySlug = new Map(zodiacSigns.map((z) => [z.slug, z]));

export function getZodiac(slug: string): ZodiacSign | undefined {
  return bySlug.get(slug);
}
