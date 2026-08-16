/** @type {import('next').NextConfig} */
const nextConfig = {
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
