import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/siteConfig";

// Edge runtime + fetch(import.meta.url) is the documented next/og pattern for
// custom fonts (Satori has no Devanagari fallback — vendored Noto Sans
// Devanagari TTFs in src/assets/fonts). The nodejs runtime is unusable here:
// @vercel/og's compiled index.node.js crashes on Windows paths at import time.
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

async function loadDevanagariFonts() {
  const [regular, bold] = await Promise.all([
    fetch(
      new URL("../assets/fonts/NotoSansDevanagari-Regular.ttf", import.meta.url)
    ).then((r) => r.arrayBuffer()),
    fetch(
      new URL("../assets/fonts/NotoSansDevanagari-Bold.ttf", import.meta.url)
    ).then((r) => r.arrayBuffer()),
  ]);
  return [
    { name: "Noto Sans Devanagari", data: regular, weight: 400 as const },
    { name: "Noto Sans Devanagari", data: bold, weight: 700 as const },
  ];
}

export default async function Image() {
  const fonts = await loadDevanagariFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "Noto Sans Devanagari",
        }}
      >
        <div style={{ width: 160, height: 8, backgroundColor: siteConfig.themeColor }} />
        <div
          style={{
            marginTop: 40,
            fontSize: 96,
            fontWeight: 700,
            color: "#1a1a1a",
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ marginTop: 24, fontSize: 40, color: "#555555" }}>
          {siteConfig.tagline}
        </div>
        <div style={{ marginTop: 48, width: 160, height: 8, backgroundColor: siteConfig.themeColor }} />
      </div>
    ),
    { ...size, fonts }
  );
}
