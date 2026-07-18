"use client";
import { useState } from "react";
import Link from "next/link";
import { categories } from "@/lib/categories";

// Top-level fixed panel (not nested in an overflow container) so it never
// needs the dialog/popover escape hatch.
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="मेन्यू खोलें"
        className="flex h-9 w-9 items-center justify-center text-text md:hidden"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-modal bg-bg md:hidden">
          <div className="container-x flex h-14 items-center justify-end border-b border-border">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="मेन्यू बंद करें"
              className="flex h-9 w-9 items-center justify-center text-text"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="container-x flex flex-col py-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shreni/${c.slug}`}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 font-display text-lg text-text hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/rashifal"
              onClick={() => setOpen(false)}
              className="border-b border-border py-3 font-display text-lg text-text hover:text-primary"
            >
              राशिफल
            </Link>
            <Link
              href="/epaper"
              onClick={() => setOpen(false)}
              className="py-3 font-display text-lg text-text hover:text-primary"
            >
              ई-पेपर
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
