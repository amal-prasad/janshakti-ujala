import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { formatDate } from "@/lib/utils/format";

// Thin identity strip above the masthead: today's date + ePaper + social. No
// search/profile here — those live in Header.
export function Topbar() {
  return (
    <div className="border-b border-border bg-surface text-xs text-muted">
      <div className="container-x flex h-9 items-center justify-between">
        <time dateTime={new Date().toISOString()}>{formatDate(new Date())}</time>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            हमारे व्हाट्सएप चैनल से जुड़ें
          </a>
          <Link href="/epaper" className="font-semibold text-primary hover:underline">
            ई-पेपर
          </Link>
          <div className="hidden items-center gap-3 sm:flex">
            <a href={siteConfig.social.facebook} className="hover:text-primary" aria-label="Facebook">
              Facebook
            </a>
            <a href={siteConfig.social.youtube} className="hover:text-primary" aria-label="YouTube">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
