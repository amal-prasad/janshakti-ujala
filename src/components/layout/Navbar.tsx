import Link from "next/link";
import { categories } from "@/lib/categories";
import { MobileMenu } from "@/components/layout/MobileMenu";

// Sticky category bar. `sticky top-0` + a z-index from the shared scale.
export function Navbar() {
  return (
    <div className="sticky top-0 z-sticky border-b border-border bg-bg">
      <div className="container-x flex h-12 items-center gap-6">
        <MobileMenu />
        <nav className="hidden gap-6 overflow-x-auto md:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shreni/${c.slug}`}
              className="whitespace-nowrap font-semibold text-text transition-colors hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/rashifal"
            className="whitespace-nowrap font-semibold text-text transition-colors hover:text-primary"
          >
            राशिफल
          </Link>
        </nav>
        <span className="font-display text-base font-bold text-text md:hidden">समाचार</span>
      </div>
    </div>
  );
}
