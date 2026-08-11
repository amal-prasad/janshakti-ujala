import Link from "next/link";
import Image from "next/image";


// Masthead. Centered logo image carries the authority — no text title, no profile
// icon (public read-only site, no auth).
export function Header() {
  return (
    <header className="border-b border-border bg-bg">
      {/* 1fr/auto/1fr keeps the masthead visually centered regardless of what
          sits in the side columns (the classic centered-header grid trick). */}
      <div className="container-x grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3 md:py-4">
        <form action="/search" className="hidden w-40 md:block">
          <input
            type="search"
            name="q"
            placeholder="खोजें…"
            aria-label="खबर खोजें"
            className="w-full border-b border-border bg-transparent py-1 text-sm text-text outline-none placeholder:text-muted focus:border-primary"
          />
        </form>

        {/* col-start-2 pins the logo to the centre column even on mobile, where
            the search form is display:none and would otherwise let auto-placement
            slide the logo into column 1. */}
        <Link href="/" className="col-start-2 text-center">
          <Image
            src="/logo.png"
            alt="जनशक्ति उजाला"
            width={400}
            height={100}
            priority
            className="h-auto w-auto max-h-20 md:max-h-28 object-contain"
          />
        </Link>


      </div>
    </header>
  );
}
