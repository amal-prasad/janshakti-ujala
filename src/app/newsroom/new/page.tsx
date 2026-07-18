export const dynamic = "force-dynamic";
"use client";
import { useNewsroomProfile } from "@/components/newsroom/useNewsroomProfile";
import { ArticleForm } from "@/components/newsroom/ArticleForm";

export default function NewArticlePage() {
  const { profile, loading } = useNewsroomProfile();
  if (loading || !profile) {
    return <div className="container-x py-16 text-center text-muted">लोड हो रहा है…</div>;
  }
  return (
    <div className="container-x py-8">
      <h1 className="section-header">नया लेख</h1>
      <ArticleForm article={null} profile={profile} />
    </div>
  );
}
