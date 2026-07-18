import { createServerClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/supabase/types";

// Columns needed by list cards — never fetch `body` for lists.
const CARD_COLS =
  "id,slug,title,dek,category,tags,cover_image_url,author,reading_minutes,is_breaking,is_featured,published_at,view_count";

export type ArticleCard = Pick<
  Article,
  | "id"
  | "slug"
  | "title"
  | "dek"
  | "category"
  | "tags"
  | "cover_image_url"
  | "author"
  | "reading_minutes"
  | "is_breaking"
  | "is_featured"
  | "published_at"
  | "view_count"
>;

export type ArticlePage = {
  items: ArticleCard[];
  nextCursor: string | null;
};

type ListOpts = {
  category?: string;
  tag?: string;
  cursor?: string | null; // published_at of the last item from the previous page
  limit?: number;
};

// Keyset pagination on published_at (indexed). Returns one extra row to decide if
// there is a next page. RLS already restricts to published rows.
export async function getArticles(opts: ListOpts = {}): Promise<ArticlePage> {
  try {
    const { category, tag, cursor, limit = 12 } = opts;
    const supabase = createServerClient();
    let q = supabase
      .from("articles")
      .select(CARD_COLS)
      .order("published_at", { ascending: false })
      .limit(limit + 1);

    if (category) q = q.eq("category", category);
    if (tag) q = q.contains("tags", [tag]);
    if (cursor) q = q.lt("published_at", cursor);

    const { data, error } = await q;
    if (error) return { items: [], nextCursor: null };

    const rows = (data ?? []) as ArticleCard[];
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    return {
      items,
      nextCursor: hasMore ? items[items.length - 1].published_at : null,
    };
  } catch {
    return { items: [], nextCursor: null };
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) return null;
    return (data as Article | null) ?? null;
  } catch {
    return null;
  }
}

// Same category, newest first, excluding the current article.
export async function getRelatedArticles(
  article: Pick<Article, "id" | "category">,
  limit = 4,
): Promise<ArticleCard[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select(CARD_COLS)
      .eq("category", article.category)
      .neq("id", article.id)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []) as ArticleCard[];
  } catch {
    return [];
  }
}

// Hero + the "featured" rail just below it. `is_featured` is set in Studio.
export async function getFeaturedArticles(limit = 5): Promise<ArticleCard[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select(CARD_COLS)
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []) as ArticleCard[];
  } catch {
    return [];
  }
}

export async function getTrendingArticles(limit = 5): Promise<ArticleCard[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select(CARD_COLS)
      .order("view_count", { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []) as ArticleCard[];
  } catch {
    return [];
  }
}

// Header search form (`/search?q=`). ILIKE scan is fine at this scale; add Postgres
// full-text search only if the article corpus grows large enough to need it.
export async function searchArticles(query: string, limit = 20): Promise<ArticleCard[]> {
  const q = query.trim();
  if (!q) return [];
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select(CARD_COLS)
      .or(`title.ilike.%${q}%,dek.ilike.%${q}%`)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []) as ArticleCard[];
  } catch {
    return [];
  }
}

// Latest published articles with feed metadata — shared by /feed.xml and
// /news-sitemap.xml (P7). RLS restricts to published rows.
export async function getRecentPublishedArticles(limit = 20): Promise<
  {
    slug: string;
    title: string;
    dek: string | null;
    category: string;
    published_at: string;
    updated_at: string;
  }[]
> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select("slug,title,dek,category,published_at,updated_at")
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []) as {
      slug: string;
      title: string;
      dek: string | null;
      category: string;
      published_at: string;
      updated_at: string;
    }[];
  } catch {
    return [];
  }
}

// All published slugs — for sitemap / static params (P7).
export async function getAllArticleSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select("slug,updated_at")
      .order("published_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as { slug: string; updated_at: string }[];
  } catch {
    return [];
  }
}
