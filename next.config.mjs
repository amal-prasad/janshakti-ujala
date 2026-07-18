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
    ],
  },
};

export default nextConfig;
