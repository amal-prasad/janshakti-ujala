// ISR — static prose, no live data. See the note on the homepage.
export const revalidate = 3600;
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { categories } from "@/lib/categories";
import { states } from "@/lib/states";

export const metadata: Metadata = {
  title: "साइट मानचित्र",
  description: "जनशक्ति उजाला की सभी मुख्य श्रेणियों, राज्यों और पेजों की सूची।",
  alternates: { canonical: `${siteConfig.url}/site-map` },
};

const MAIN_PAGES: { href: string; label: string }[] = [
  { href: "/", label: "मुखपृष्ठ" },
  { href: "/samachar", label: "समाचार" },
  { href: "/rashifal", label: "राशिफल" },
  { href: "/epaper", label: "ई-पेपर" },
  { href: "/gallery", label: "गैलरी" },
  { href: "/polls", label: "पोल" },
  { href: "/newsletter", label: "न्यूज़लेटर" },
  { href: "/search", label: "खोजें" },
  { href: "/contact", label: "संपर्क करें" },
];

const POLICY_PAGES: { href: string; label: string }[] = [
  { href: "/hamare-bare-mein", label: "हमारे बारे में" },
  { href: "/prakashak", label: "प्रकाशक और स्वामित्व" },
  { href: "/sampadakiya-niti", label: "संपादकीय नीति" },
  { href: "/sanshodhan-niti", label: "संशोधन नीति" },
  { href: "/niyam-evam-sharten", label: "नियम एवं शर्तें" },
  { href: "/gopniyata-niti", label: "गोपनीयता नीति" },
  { href: "/cookie-niti", label: "कुकी नीति" },
];

function LinkList({ items }: { items: { href: string; label: string }[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="font-semibold text-primary hover:underline">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function SiteMapPage() {
  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">साइट मानचित्र</h1>
      <div className="max-w-2xl space-y-6 text-sm leading-relaxed text-text">
        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">मुख्य पेज</h2>
          <LinkList items={MAIN_PAGES} />
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">श्रेणियाँ</h2>
          <LinkList
            items={categories.map((c) => ({ href: `/shreni/${c.slug}`, label: c.name }))}
          />
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">राज्य</h2>
          <LinkList
            items={[
              { href: "/rajya", label: "सभी राज्य" },
              ...states.map((s) => ({ href: `/rajya/${s.slug}`, label: s.name })),
            ]}
          />
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">नीति एवं जानकारी</h2>
          <LinkList items={POLICY_PAGES} />
        </section>
      </div>
    </div>
  );
}
