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
  "id" | "slug" | "title" | "category" | "is_published" | "author_id" | "published_at" | "created_at"
>;

type Filter = "all" | "draft" | "published";

// RLS scopes the query: reporters get only their own rows, editors get all.
export default function NewsroomListPage() {
  const { profile, loading } = useNewsroomProfile();
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!profile) return;
    getNewsroomClient()
      .from("articles")
      .select("id,slug,title,category,is_published,author_id,published_at,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as Row[]) ?? []));
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

      {visible.length === 0 ? (
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
