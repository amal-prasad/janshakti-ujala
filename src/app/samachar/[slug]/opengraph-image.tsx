import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/api/articles";
import { categoryName } from "@/lib/categories";
import { siteConfig } from "@/lib/siteConfig";

// Edge runtime + fetch(import.meta.url) is the documented next/og pattern for
// custom fonts (Satori has no Devanagari fallback — vendored Noto Sans
// Devanagari TTFs in src/assets/fonts). The nodejs runtime is unusable here:
// @vercel/og's compiled index.node.js crashes on Windows paths at import time.
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteConfig.name;

async function loadDevanagariFonts() {
  const [regular, bold] = await Promise.all([
    fetch(
      new URL("../../../assets/fonts/NotoSansDevanagari-Regular.ttf", import.meta.url)
    ).then((r) => r.arrayBuffer()),
    fetch(
      new URL("../../../assets/fonts/NotoSansDevanagari-Bold.ttf", import.meta.url)
    ).then((r) => r.arrayBuffer()),
  ]);
  return [
    { name: "Noto Sans Devanagari", data: regular, weight: 400 as const },
    { name: "Noto Sans Devanagari", data: bold, weight: 700 as const },
  ];
}

export default async function Image({ params }: { params: { slug: string } }) {
  const [article, fonts] = await Promise.all([
    getArticleBySlug(params.slug),
    loadDevanagariFonts(),
  ]);

  const hasCover = Boolean(article?.cover_image_url);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          backgroundColor: "#ffffff",
          fontFamily: "Noto Sans Devanagari",
          position: "relative",
        }}
      >
        {hasCover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article!.cover_image_url!}
            alt=""
            width={size.width}
            height={size.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        {hasCover && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              // Share card only: subtle darkening for text legibility (allowed
              // exception to the no-gradient card rule).
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.75) 100%)",
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "56px 64px",
          }}
        >
          {article && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 32,
                fontWeight: 700,
                color: hasCover ? "#ffffff" : siteConfig.themeColor,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 40,
                  marginRight: 20,
                  backgroundColor: siteConfig.themeColor,
                }}
              />
              {categoryName(article.category)}
            </div>
          )}
          <div
            style={{
              marginTop: 24,
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.25,
              color: hasCover ? "#ffffff" : "#1a1a1a",
              display: "block",
              lineClamp: 3,
            }}
          >
            {article ? article.title : siteConfig.tagline}
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 32,
              fontWeight: 700,
              color: hasCover ? "#ffffff" : siteConfig.themeColor,
            }}
          >
            {siteConfig.name}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
