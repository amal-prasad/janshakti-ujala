import { createServerClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/supabase/types";

// Dateline default — the paper's home city. Rows from a hosted DB that hasn't
// applied migrations/013_article_city.sql yet have no `city`; the fallback
// keeps every card rendering a dateline either way.
export const DEFAULT_CITY = "इंदौर";

// Columns needed by list cards — never fetch `body` for lists.
const CARD_COLS =
  "id,slug,title,dek,category,tags,cover_image_url,author,city,state,reading_minutes,is_breaking,is_featured,is_hero,is_trending,published_at,view_count";
// Pre-013/016/017 hosted DBs reject `city`/`state`/`is_hero`/`is_trending` with
// PostgREST 42703 (undefined column). The error doesn't say which, so the fallback
// drops all of them.
const CARD_COLS_PRE_013 = CARD_COLS.replace(",city", "")
  .replace(",state", "")
  .replace(",is_hero", "")
  .replace(",is_trending", "");

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
> & { city: string; state: string | null; is_hero: boolean; is_trending: boolean };

export type ArticlePage = {
  items: ArticleCard[];
  nextCursor: string | null;
};

type CardRow = Omit<ArticleCard, "city" | "state" | "is_hero" | "is_trending"> & {
  city?: string | null;
  state?: string | null;
  is_hero?: boolean;
  is_trending?: boolean;
};
type CardResult = PromiseLike<{ data: unknown; error: { code?: string } | null }>;

// Runs a card select; on 42703 (pre-013/016 DB, missing `city`/`state`) retries
// without them and stamps defaults, so lists work before and after the migration.
async function selectCards(
  run: (cols: string) => CardResult,
): Promise<ArticleCard[] | null> {
  let { data, error } = await run(CARD_COLS);
  if (error?.code === "42703") ({ data, error } = await run(CARD_COLS_PRE_013));
  if (error) return null;
  return ((data ?? []) as CardRow[]).map((r) => ({
    ...r,
    city: r.city ?? DEFAULT_CITY,
    state: r.state ?? null,
    is_hero: r.is_hero ?? false,
    is_trending: r.is_trending ?? false,
  }));
}

type ListOpts = {
  category?: string;
  tag?: string;
  state?: string;
  cursor?: string | null; // published_at of the last item from the previous page
  limit?: number;
};

// Keyset pagination on published_at (indexed). Returns one extra row to decide if
// there is a next page. RLS already restricts to published rows.
export async function getArticles(opts: ListOpts = {}): Promise<ArticlePage> {
  try {
    const { category, tag, state, cursor, limit = 12 } = opts;
    const supabase = createServerClient();
    const rows = await selectCards((cols) => {
      let q = supabase
        .from("articles")
        .select(cols)
        .order("published_at", { ascending: false })
        .limit(limit + 1);
      if (category) q = q.eq("category", category);
      if (tag) q = q.contains("tags", [tag]);
      if (state) q = q.eq("state", state);
      if (cursor) q = q.lt("published_at", cursor);
      return q;
    });
    if (!rows) return { items: [], nextCursor: null };

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
    const rows = await selectCards((cols) =>
      supabase
        .from("articles")
        .select(cols)
        .eq("category", article.category)
        .neq("id", article.id)
        .order("published_at", { ascending: false })
        .limit(limit),
    );
    return rows ?? [];
  } catch {
    return [];
  }
}

// The "featured" rail (4-up grid). `is_featured` is set in the newsroom editor UI.
export async function getFeaturedArticles(limit = 5): Promise<ArticleCard[]> {
  try {
    const supabase = createServerClient();
    const rows = await selectCards((cols) =>
      supabase
        .from("articles")
        .select(cols)
        .eq("is_featured", true)
        .order("published_at", { ascending: false })
        .limit(limit),
    );
    return rows ?? [];
  } catch {
    return [];
  }
}

// The one big hero card. Editor-picked via `is_hero`; falls back to the newest
// featured article, then the newest article overall, so the hero is never empty.
export async function getHeroArticle(): Promise<ArticleCard | null> {
  try {
    const supabase = createServerClient();
    const rows = await selectCards((cols) =>
      supabase
        .from("articles")
        .select(cols)
        .eq("is_hero", true)
        .order("published_at", { ascending: false })
        .limit(1),
    );
    if (rows?.[0]) return rows[0];

    // No explicit pick (or a pre-017 DB): newest featured, else newest article.
    const featured = await getFeaturedArticles(1);
    if (featured[0]) return featured[0];

    const { items } = await getArticles({ limit: 1 });
    return items[0] ?? null;
  } catch {
    return null;
  }
}

// Pinned (`is_trending`, published_at desc) first, then filled by view_count desc.
export async function getTrendingArticles(limit = 5): Promise<ArticleCard[]> {
  try {
    const supabase = createServerClient();
    const pinned =
      (await selectCards((cols) =>
        supabase
          .from("articles")
          .select(cols)
          .eq("is_trending", true)
          .order("published_at", { ascending: false })
          .limit(limit),
      )) ?? [];
    if (pinned.length >= limit) return pinned.slice(0, limit);

    const filler =
      (await selectCards((cols) =>
        supabase
          .from("articles")
          .select(cols)
          .order("view_count", { ascending: false })
          .limit(limit + pinned.length),
      )) ?? [];

    return dedupeById([...pinned, ...filler]).slice(0, limit);
  } catch {
    return [];
  }
}

function dedupeById<T extends { id: string }>(rows: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
  }
  return out;
}

export type BreakingItem = { headline: string; href: string; published_at: string };

// Ticker items sourced from `is_breaking` articles. Merged with `live_news` rows
// by src/lib/api/liveNews.ts.
export async function getBreakingArticles(limit = 6): Promise<BreakingItem[]> {
  try {
    const supabase = createServerClient();
    const rows = await selectCards((cols) =>
      supabase
        .from("articles")
        .select(cols)
        .eq("is_breaking", true)
        .order("published_at", { ascending: false })
        .limit(limit),
    );
    return (rows ?? []).map((r) => ({
      headline: r.title,
      href: `/samachar/${r.slug}`,
      published_at: r.published_at,
    }));
  } catch {
    return [];
  }
}

export async function searchArticles(query: string, limit = 20): Promise<ArticleCard[]> {
  // PostgREST filter-injection guard: the .or() string is parsed by PostgREST,
  // so commas/parens/colons/quotes/backslashes in user input could smuggle
  // extra filter clauses. Replace them with spaces before interpolating.
  const q = query.trim().replace(/[,()\\":]/g, " ").replace(/\s+/g, " ").trim();
  if (!q) return [];
  try {
    const supabase = createServerClient();
    const rows = await selectCards((cols) =>
      supabase
        .from("articles")
        .select(cols)
        .or(`title.ilike.%${q}%,dek.ilike.%${q}%`)
        .order("published_at", { ascending: false })
        .limit(limit),
    );
    return rows ?? [];
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
