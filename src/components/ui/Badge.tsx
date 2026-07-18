import Link from "next/link";
import { categoryName } from "@/lib/categories";

// Category label. Red text, no fill (design rule: no heavy chips). Links to the
// section when `slug` is a known category.
export function CategoryBadge({ slug }: { slug: string }) {
  return (
    <Link
      href={`/shreni/${slug}`}
      className="text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
    >
      {categoryName(slug)}
    </Link>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "breaking";
}) {
  const cls =
    tone === "breaking"
      ? "bg-primary text-white"
      : "bg-surface text-muted border border-border";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}
