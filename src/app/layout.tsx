import type { Metadata, Viewport } from "next";
import { Halant } from "next/font/google";
import "./globals.css";
import { siteConfig, MAINTENANCE } from "@/lib/siteConfig";
import { getLiveNews } from "@/lib/api/liveNews";
import { Topbar } from "@/components/layout/Topbar";
import { Header } from "@/components/layout/Header";
import { Navbar } from "@/components/layout/Navbar";
import { BreakingNewsTicker } from "@/components/layout/BreakingNewsTicker";
import { Footer } from "@/components/layout/Footer";
import { AdSlot } from "@/components/AdSlot";
import { RefreshOnRestore } from "@/components/RefreshOnRestore";
import { headers } from "next/headers";

// Halant site-wide: display, body and hind Tailwind families all resolve to this one
// family, so it is declared ONCE. Three identical next/font calls used to emit three
// CSS variables for the same face; Tailwind now points all three at --font-display.
// Weights are limited to the three the codebase actually uses — font-normal (400),
// font-semibold (600) and font-bold (700). Loading 300 and 500 as well meant ten
// preloaded woff2 files (~235 kB) on every page, and Devanagari faces are ~39 kB each
// (SEO audit, issue F37).
const halant = Halant({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    locale: "hi_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.social.twitter,
  },
};

// Runs before paint: applies persisted reader font-size so there is no flash.
// Kept as a raw string so it is inlined in <head>.
const noFlashScript = `(function(){try{
  var f=localStorage.getItem('ju_font_size');
  if(f && f!=='normal') document.documentElement.setAttribute('data-font-size', f);
}catch(e){}})();`;

const swScript = `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`;

// Blocks right-click "save image" / drag-out on <img> tags site-wide (deterrent
// only — see globals.css comment on the same rule; devtools can still get bytes).
const noImageSaveScript = `document.addEventListener('contextmenu',function(e){if(e.target&&e.target.tagName==='IMG')e.preventDefault();});document.addEventListener('dragstart',function(e){if(e.target&&e.target.tagName==='IMG')e.preventDefault();});`;

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Set by middleware when the under-construction gate is on — render the page bare,
  // without nav/ticker/footer, so no article surface leaks through.
  // MAINTENANCE is checked FIRST and short-circuits: calling headers() opts the whole
  // app out of static rendering, which is why every route was served no-store with a
  // ~2.8s TTFB (SEO audit, issue F36). With the gate off, headers() is never reached.
  const maintenance = MAINTENANCE && headers().get("x-maintenance") === "1";
  const liveNews = maintenance ? [] : await getLiveNews();

  return (
    <html lang="hi" className={`${halant.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        {maintenance ? (
          <main>{children}</main>
        ) : (
          <>
            <RefreshOnRestore />
            <Topbar />
            <Header />
            <Navbar />
            <BreakingNewsTicker items={liveNews} />
            <main>{children}</main>
            <div className="container-x py-6">
              <AdSlot slot="footer" />
            </div>
            <Footer />
          </>
        )}
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
        <script dangerouslySetInnerHTML={{ __html: noImageSaveScript }} />
      </body>
    </html>
  );
}
