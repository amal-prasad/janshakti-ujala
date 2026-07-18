import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "उजाला",
    description: siteConfig.description,
    lang: "hi",
    dir: "ltr",
    start_url: "/",
    display: "standalone",
    theme_color: siteConfig.themeColor,
    background_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
