import type { Article } from "@/lib/supabase/types";
import { siteConfig } from "@/lib/siteConfig";

// Serialize a schema object for injection into a <script type="application/ld+json">
// via dangerouslySetInnerHTML. JSON.stringify does NOT escape `<`, so a `</script>`
// inside user-authored data (article title/dek) would break out of the tag — XSS.
// Escaping these to \uXXXX keeps the JSON valid (Google still parses it) while
// making a script breakout impossible. U+2028/U+2029 are escaped too: they're
// legal in JSON strings but break inline <script> parsing. (split/join with
// fromCharCode avoids ever placing those raw separators in this source file.)
export function jsonLdScript(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .split(String.fromCharCode(0x2028)).join("\\u2028")
    .split(String.fromCharCode(0x2029)).join("\\u2029");
}

// NewsArticle JSON-LD for /samachar/[slug]. Returned as a plain object; the page
// stringifies it into a <script type="application/ld+json">.
export function buildNewsArticleSchema(article: Article, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.dek ?? undefined,
    image: article.cover_image_url ? [article.cover_image_url] : undefined,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon-512.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "hi",
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/icon-512.png`,
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.youtube,
      `https://twitter.com/${siteConfig.social.twitter.replace(/^@/, "")}`,
    ],
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "hi",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
