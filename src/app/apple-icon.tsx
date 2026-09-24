import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/siteConfig";

// iOS home-screen icon. Apple ignores manifest.ts icons entirely and needs
// this file convention (apple-touch-icon) — generated for the same reason
// as icon.tsx: no static brand asset exists yet.
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const data = await fetch(
    new URL("../assets/fonts/NotoSansDevanagari-Bold.ttf", import.meta.url)
  ).then((r) => r.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: siteConfig.themeColor,
          color: "#ffffff",
          fontFamily: "Noto Sans Devanagari",
          fontSize: 96,
          fontWeight: 700,
        }}
      >
        उ
      </div>
    ),
    { ...size, fonts: [{ name: "Noto Sans Devanagari", data, weight: 700 }] }
  );
}
