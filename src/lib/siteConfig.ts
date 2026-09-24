// ponytail: env vars can carry invisible whitespace/newlines from a dashboard
// paste — new URL() throws on that, which crashed the whole build (F1 follow-up).
// Trim + validate here, once, rather than at every call site.
function resolveSiteUrl(): string {
  const fallback =
    process.env.NODE_ENV === "production"
      ? "https://www.janshaktiujala.in"
      : "http://localhost:3000";
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return fallback;
  try {
    return new URL(raw).origin;
  } catch {
    return fallback;
  }
}

// Single source of truth for site identity. All user-facing strings are Hindi.
export const siteConfig = {
  name: "जनशक्ति उजाला",
  nameRoman: "Janshakti Ujala",
  tagline: "सच्ची खबर, जन की आवाज़",
  description:
    "जनशक्ति उजाला — ताज़ा समाचार, राजनीति, खेल, मनोरंजन, व्यापार, राशिफल और ई-पेपर। निष्पक्ष और विश्वसनीय हिंदी समाचार।",
  // Canonical origin. Feeds every canonical, og:url, sitemap, robots.txt and JSON-LD.
  // ponytail: localhost only in dev — a missing env var in prod must never emit
  // localhost URLs into the public discovery surface again (SEO audit F1).
  url: resolveSiteUrl(),
  locale: "hi-IN",
  themeColor: "#b5291d",
  social: {
    twitter: "@janshaktiujala",
    facebook: "https://facebook.com/janshaktiujala",
    youtube: "https://youtube.com/@janshaktiujala",
  },
  contactEmail: "janshaktiujala@gmail.com",
  contactPhone: "9009699993",
  // Channel invite links have a member cap — swap this when the channel fills up.
  whatsappChannel: "https://whatsapp.com/channel/REPLACE_ME",

  // Publisher identity. A news site is a YMYL surface: Google, readers and the
  // PIB/RNI framework all expect a named human to be accountable for what is
  // published. Every field below is a FACT ABOUT A REAL PERSON OR ENTITY and must
  // be supplied by the owner — nothing here may be invented.
  // ponytail: empty string = "not supplied yet". The trust pages and the
  // NewsMediaOrganization schema skip empty fields rather than printing a
  // placeholder; a fake address on a news site is worse than a missing one.
  publisher: {
    legalName: "", // e.g. "जनशक्ति उजाला मीडिया"  — registered/trading name
    editorInChief: "", // प्रधान संपादक — the named person responsible for content
    grievanceOfficer: "", // शिकायत निवारण अधिकारी (IT Rules 2021 requires one)
    grievanceEmail: "", // falls back to contactEmail if empty
    addressLine: "", // street / building
    city: "इंदौर",
    state: "मध्य प्रदेश",
    postalCode: "",
    country: "भारत",
    rniNumber: "", // RNI registration number, if the print edition is registered
    foundingYear: "", // e.g. "2024"
  },
} as const;

export type SiteConfig = typeof siteConfig;

// Site-wide "under construction" gate. Flip to true to take the public site down.
// ponytail: a const, not an env var — restoring needs a deploy anyway. It lives here
// rather than in middleware.ts so the root layout can read it without dragging the
// edge middleware bundle into the server render path.
export const MAINTENANCE = false;
