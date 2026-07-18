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
  if (notFound) {
    return <div className="container-x py-16 text-center text-muted">लेख नहीं मिला।</div>;
  }
  return (
    <div className="container-x py-8">
      <h1 className="section-header">लेख संपादित करें</h1>
      <ArticleForm article={article} profile={profile} />
    </div>
  );
}
