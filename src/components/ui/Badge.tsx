import Link from "next/link";
import { categoryName } from "@/lib/categories";
import { verdictLabels, type FactCheckVerdict } from "@/lib/supabase/types";

// Fact-check verdict. No green/amber token exists in globals.css and inventing
// hex literals is banned, so the three verdicts are separated by weight + fill:
// झूठ = solid red, भ्रामक = red outline, सच = neutral outline.
const verdictCls: Record<FactCheckVerdict, string> = {
  false: "bg-primary text-white",
  misleading: "border border-primary text-primary",
  true: "border border-border bg-surface text-text",
};

export function VerdictBadge({ verdict }: { verdict: FactCheckVerdict }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${verdictCls[verdict]}`}
    >
      {verdictLabels[verdict]}
    </span>
  );
}

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
