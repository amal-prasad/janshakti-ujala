"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getNewsroomClient } from "@/lib/supabase/newsroom";
import { useNewsroomProfile } from "@/components/newsroom/useNewsroomProfile";
import { categoryName } from "@/lib/categories";
import { formatDate } from "@/lib/utils/format";
import type { Article } from "@/lib/supabase/types";

type Row = Pick<
  Article,
  | "id"
  | "slug"
  | "title"
  | "category"
  | "is_published"
  | "author_id"
  | "published_at"
  | "created_at"
  | "is_featured"
  | "is_breaking"
> &
  Partial<Pick<Article, "is_hero" | "is_trending">>;

const LIST_COLS =
  "id,slug,title,category,is_published,author_id,published_at,created_at,is_featured,is_breaking,is_hero,is_trending";
// Pre-017 hosted DB has no `is_hero`/`is_trending`; PostgREST rejects the whole
// select with 42703. Retry without them so the list still renders.
const LIST_COLS_PRE_017 = LIST_COLS.replace(",is_hero", "").replace(",is_trending", "");

type Filter = "all" | "draft" | "published";

// RLS scopes the query: reporters get only their own rows, editors get all.
export default function NewsroomListPage() {
  const { profile, loading } = useNewsroomProfile();
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!profile) return;
    const supabase = getNewsroomClient();
    const run = (cols: string) =>
      supabase.from("articles").select(cols).order("created_at", { ascending: false });

    (async () => {
      let { data, error } = await run(LIST_COLS);
      if (error?.code === "42703") ({ data, error } = await run(LIST_COLS_PRE_017));
      // Never fail silently — an empty list and a broken query look identical.
      setLoadError(error ? "लेख लोड नहीं हो सके।" : "");
      setRows((data as unknown as Row[]) ?? []);
    })();
  }, [profile]);

  if (loading || !profile) {
    return <div className="container-x py-16 text-center text-muted">लोड हो रहा है…</div>;
  }

  const visible = rows.filter((r) =>
    filter === "all" ? true : filter === "draft" ? !r.is_published : r.is_published,
  );

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "सभी" },
    { key: "draft", label: "ड्राफ्ट" },
    { key: "published", label: "प्रकाशित" },
  ];

  return (
    <div className="container-x py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="section-header">न्यूज़रूम</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            {profile.display_name} ({profile.role === "editor" ? "संपादक" : "संवाददाता"})
          </span>
          <Link
            href="/newsroom/new"
            className="bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            नया लेख
          </Link>
          {profile.role === "editor" && (
            <Link
              href="/newsroom/epaper"
              className="bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              ई-पेपर
            </Link>
          )}
          <button
            type="button"
            onClick={async () => {
              await getNewsroomClient().auth.signOut();
              window.location.href = "/newsroom/login";
            }}
            className="border border-border px-3 py-2 text-sm text-muted hover:border-primary hover:text-primary"
          >
            लॉगआउट
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-2 border-b border-border pb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className={
              filter === t.key
                ? "bg-primary px-3 py-1 text-sm font-semibold text-white"
                : "border border-border px-3 py-1 text-sm text-muted hover:border-primary hover:text-primary"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {loadError ? (
        <p className="mt-8 text-primary">{loadError}</p>
      ) : visible.length === 0 ? (
        <p className="mt-8 text-muted">कोई लेख नहीं मिला।</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {visible.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <Link
                  href={`/newsroom/edit/${r.id}`}
                  className="font-display text-lg font-bold hover:text-primary"
                >
                  {r.title}
                </Link>
                <p className="text-sm text-muted">
                  {categoryName(r.category)} • {formatDate(r.created_at)}
                </p>
                {(r.is_hero || r.is_featured || r.is_breaking || r.is_trending) && (
                  <p className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-primary">
                    {r.is_hero && <span>हीरो</span>}
                    {r.is_featured && <span>फीचर्ड</span>}
                    {r.is_breaking && <span>ब्रेकिंग</span>}
                    {r.is_trending && <span>ट्रेंडिंग</span>}
                  </p>
                )}
              </div>
              <span
                className={
                  r.is_published
                    ? "text-sm font-semibold text-primary"
                    : "text-sm text-muted"
                }
              >
                {r.is_published ? "प्रकाशित" : "ड्राफ्ट"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
