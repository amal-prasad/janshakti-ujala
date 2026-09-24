import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/siteConfig";

// Browser tab favicon. Generated, not a static file — no brand asset exists
// yet (see OG image comment for why edge + fetch(import.meta.url) is required).
export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        उ
      </div>
    ),
    { ...size, fonts: [{ name: "Noto Sans Devanagari", data, weight: 700 }] }
  );
}
