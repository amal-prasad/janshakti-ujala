export const dynamic = "force-dynamic";
import type { Metadata, Viewport } from "next";
import { Tiro_Devanagari_Hindi, Noto_Sans_Devanagari, Hind } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { getLiveNews } from "@/lib/api/liveNews";
import { Topbar } from "@/components/layout/Topbar";
import { Header } from "@/components/layout/Header";
import { Navbar } from "@/components/layout/Navbar";
import { BreakingNewsTicker } from "@/components/layout/BreakingNewsTicker";
import { Footer } from "@/components/layout/Footer";
import { AdSlot } from "@/components/AdSlot";

// Display = headlines; Body = running text. Both Devanagari-first.
const display = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});
const body = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const hind = Hind({
  subsets: ["devanagari"],
  weight: ["400", "700"],
  variable: "--font-hind",
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
  const liveNews = await getLiveNews();

  return (
    <html lang="hi" className={`${display.variable} ${body.variable} ${hind.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <Topbar />
        <Header />
        <Navbar />
        <BreakingNewsTicker items={liveNews} />
        <main>{children}</main>
        <div className="container-x py-6">
          <AdSlot slot="footer" />
        </div>
        <Footer />
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
        <script dangerouslySetInnerHTML={{ __html: noImageSaveScript }} />
      </body>
    </html>
  );
}
