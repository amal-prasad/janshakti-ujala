import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-surface">
      <div className="container-x flex justify-center pt-10">
        <Link href="/">
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={400}
            height={100}
            className="h-auto w-auto max-h-16 object-contain md:max-h-20"
          />
        </Link>
      </div>

      <div className="container-x grid gap-10 py-10 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="max-w-sm text-sm text-muted">{siteConfig.description}</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          {categories.slice(0, 6).map((c) => (
            <Link key={c.slug} href={`/shreni/${c.slug}`} className="text-text hover:text-primary">
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-sm">
          <Link href="/epaper" className="text-text hover:text-primary">ई-पेपर</Link>
          <Link href="/rashifal" className="text-text hover:text-primary">राशिफल</Link>
          <Link href="/gallery" className="text-text hover:text-primary">गैलरी</Link>
          <Link href="/contact" className="text-text hover:text-primary">संपर्क करें</Link>
          <a href={`mailto:${siteConfig.contactEmail}`} className="text-muted hover:text-primary">
            {siteConfig.contactEmail}
          </a>
        </div>
      </div>
      <div className="container-x border-t border-border py-4 text-xs text-muted">
        © {new Date().getFullYear()} {siteConfig.name}. सर्वाधिकार सुरक्षित।
      </div>
    </footer>
  );
}
