"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getNewsroomClient } from "@/lib/supabase/newsroom";
import { useNewsroomProfile } from "@/components/newsroom/useNewsroomProfile";
import { ArticleForm } from "@/components/newsroom/ArticleForm";
import type { Article } from "@/lib/supabase/types";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { profile, loading } = useNewsroomProfile();
  const [article, setArticle] = useState<Article | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!profile) return;
    getNewsroomClient()
      .from("articles")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setArticle(data as Article);
        else setNotFound(true);
      });
  }, [profile, id]);

  if (loading || !profile || (!article && !notFound)) {
    return <div className="container-x py-16 text-center text-muted">लोड हो रहा है…</div>;
  }
  if (notFound || !article) {
    return <div className="container-x py-16 text-center text-muted">लेख नहीं मिला।</div>;
  }

  // Mirrors the "articles staff delete" RLS policy (019). UX only — RLS enforces.
  const canDelete =
    profile.role === "editor" || (article.author_id === profile.id && !article.is_published);

  async function handleDelete() {
    if (!article) return;
    const warning = article.is_published
      ? "यह लेख प्रकाशित है। हटाने पर यह वेबसाइट से तुरंत गायब हो जाएगा और वापस नहीं आएगा। क्या आप निश्चित हैं?"
      : "यह ड्राफ्ट स्थायी रूप से हट जाएगा। क्या आप निश्चित हैं?";
    if (!window.confirm(warning)) return;
    setDeleting(true);
    setDeleteError("");
    // .select() so an RLS-blocked delete (0 rows, no error) is not reported as success.
    const { data, error } = await getNewsroomClient()
      .from("articles")
      .delete()
      .eq("id", article.id)
      .select("id");
    if (error || !data?.length) {
      setDeleting(false);
      setDeleteError("लेख हटाया नहीं जा सका।");
      return;
    }
    window.location.href = "/newsroom";
  }

  return (
    <div className="container-x py-8">
      <h1 className="section-header">लेख संपादित करें</h1>
      <ArticleForm article={article} profile={profile} />
      {canDelete && (
        <div className="mt-10 border-t border-border pt-6">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white disabled:opacity-50"
          >
            {deleting ? "हटाया जा रहा है…" : "लेख हटाएँ"}
          </button>
          {deleteError && <p className="mt-2 text-sm text-primary">{deleteError}</p>}
        </div>
      )}
    </div>
  );
}
