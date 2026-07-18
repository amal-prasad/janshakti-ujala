// Single source of truth for site identity. All user-facing strings are Hindi.
export const siteConfig = {
  name: "जनशक्ति उजाला",
  nameRoman: "Janshakti Ujala",
  tagline: "सच्ची खबर, जन की आवाज़",
  description:
    "जनशक्ति उजाला — ताज़ा समाचार, राजनीति, खेल, मनोरंजन, व्यापार, राशिफल और ई-पेपर। निष्पक्ष और विश्वसनीय हिंदी समाचार।",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "hi-IN",
  themeColor: "#b5291d",
  social: {
    twitter: "@janshaktiujala",
    facebook: "https://facebook.com/janshaktiujala",
    youtube: "https://youtube.com/@janshaktiujala",
  },
  contactEmail: "sampark@janshaktiujala.in",
} as const;

export type SiteConfig = typeof siteConfig;
