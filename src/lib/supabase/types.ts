// Hand-written DB types (no generated file — avoids a CLI round-trip against a live
// project). Keep in sync with supabase/migrations/*.

export type Article = {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  body: string;
  category: string;
  tags: string[];
  cover_image_url: string | null;
  author: string;
  // Dateline city (013). Optional because a hosted DB that hasn't run the
  // migration yet returns rows without it — readers fall back to इंदौर.
  city?: string;
  // State classification (016). Matches a `name` in src/lib/states.ts. Optional
  // for the same reason as `city`.
  state?: string | null;
  reading_minutes: number;
  is_breaking: boolean;
  is_featured: boolean;
  // Homepage placement (017): hero slot pick, trending-rail pin.
  is_hero: boolean;
  is_trending: boolean;
  is_published: boolean;
  view_count: number;
  author_id: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  role: "reporter" | "editor";
  display_name: string;
  created_at: string;
};

export type LiveNews = {
  id: string;
  headline: string;
  source_name: string | null;
  source_url: string;
  published_at: string;
  created_at: string;
};

export type EpaperEdition = {
  id: string;
  edition_date: string;
  title: string;
  city: string;
  pdf_url: string;
  thumbnail_url: string | null;
  created_at: string;
};

export type Rashifal = {
  id: string;
  sign: string;
  date: string;
  prediction: string;
  lucky_number: number | null;
  lucky_color: string | null;
  is_published: boolean;
  created_at: string;
};

export type Poll = {
  id: string;
  question: string;
  is_active: boolean;
  created_at: string;
};

export type PollOption = {
  id: string;
  poll_id: string;
  label: string;
  vote_count: number;
  sort_order: number;
};

export type GalleryImage = { url: string; caption?: string };

export type Gallery = {
  id: string;
  slug: string;
  title: string;
  cover_image_url: string | null;
  images: GalleryImage[];
  published_at: string;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  confirmed: boolean;
  created_at: string;
};

export type Ad = {
  id: string;
  slot: "sidebar" | "infeed" | "footer";
  image_url: string;
  link_url: string;
  alt_text: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
};

// Minimal shape consumed by supabase-js generics: per-table Row/Insert/Update.
// `Relationships: []` is required by postgrest-js's GenericTable constraint —
// none of our queries use FK embedding, so an empty tuple is accurate.
type TableFor<T> = { Row: T; Insert: Partial<T>; Update: Partial<T>; Relationships: [] };

export type Database = {
  public: {
    Tables: {
      articles: TableFor<Article>;
      profiles: TableFor<Profile>;
      live_news: TableFor<LiveNews>;
      epaper_editions: TableFor<EpaperEdition>;
      rashifal: TableFor<Rashifal>;
      polls: TableFor<Poll>;
      poll_options: TableFor<PollOption>;
      gallery: TableFor<Gallery>;
      newsletter_subscribers: TableFor<NewsletterSubscriber>;
      ads: TableFor<Ad>;
    };
    Views: Record<string, never>;
    Functions: {
      increment_view_count: { Args: { article_slug: string }; Returns: void };
      increment_poll_vote: { Args: { option_id: string }; Returns: void };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
