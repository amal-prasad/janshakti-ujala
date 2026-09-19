/** @type {import('next').NextConfig} */
const nextConfig = {
  // Client-side Router Cache. Next 14.2 keeps a visited page's RSC payload for
  // 30s, so navigating back to "/" from an article served a stale homepage
  // (a reload was the only way to see a just-published article). A news front
  // page must never be stale — 0 makes every <Link> navigation refetch.
  experimental: {
    staleTimes: { dynamic: 0, static: 0 },
  },
  images: {
    remotePatterns: [
      // Dev seed imagery.
      { protocol: "https", hostname: "picsum.photos" },
      // Supabase Storage (cover images, og-cards, epaper thumbnails).
      { protocol: "https", hostname: "*.supabase.co" },
      // YouTube thumbnails for the video section.
      { protocol: "https", hostname: "i.ytimg.com" },
      // /rajya state landmark photos, hotlinked from Wikimedia Commons.
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
