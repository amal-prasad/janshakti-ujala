import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { states } from "@/lib/states";

export const metadata: Metadata = { title: "राज्य - जनशक्ति उजाला" };

// State index — every card is a button linking to /rajya/[slug], which lists
// articles tagged with that state. Major states (population-ranked, मध्य
// प्रदेश pinned first) render before the rest.
export default function RajyaPage() {
  const major = states.filter((s) => s.major);
  const minor = states.filter((s) => !s.major);

  return (
    <div className="container-x py-8">
      <h1 className="section-header text-2xl">राज्य</h1>

      <h2 className="mt-6 text-lg font-bold">प्रमुख राज्य</h2>
      <StateGrid items={major} />

      <h2 className="mt-8 text-lg font-bold">अन्य राज्य व केंद्र शासित प्रदेश</h2>
      <StateGrid items={minor} />
    </div>
  );
}

function StateGrid({ items }: { items: typeof states }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((s) => (
        <Link
          key={s.slug}
          href={`/rajya/${s.slug}`}
          className="group flex flex-col gap-2"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
            <Image
              src={s.image}
              alt={s.landmark}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div>
            <h3 className="font-display text-base font-bold group-hover:text-primary">
              {s.name}
            </h3>
            <p className="line-clamp-1 text-xs text-muted">
              {s.cities.slice(0, 3).join(", ")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
