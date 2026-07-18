"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getNewsroomClient } from "@/lib/supabase/newsroom";
import { Markdown } from "@/components/news/Markdown";
import { categories } from "@/lib/categories";
import { slugify } from "@/lib/utils/format";
import type { Article, Profile } from "@/lib/supabase/types";

const inputCls =
  "w-full border border-border bg-bg px-3 py-2 text-sm text-text outline-none placeholder:text-muted focus:border-primary";

// Shared by /newsroom/new (article = null) and /newsroom/edit/[id].
// Slug auto-follows the title until touched by hand; locked after first publish.
// Publish toggle is editor-only — RLS blocks reporters from flipping it anyway.
export function ArticleForm({
  article,
  profile,
}: {
  article: Article | null;
  profile: Profile;
}) {
  const router = useRouter();
  const isEditor = profile.role === "editor";
  const slugLocked = article?.is_published ?? false;

  const [title, setTitle] = useState(article?.title ?? "");
  const [dek, setDek] = useState(article?.dek ?? "");
  const [category, setCategory] = useState(article?.category ?? categories[0].slug);
  const [body, setBody] = useState(article?.body ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [coverUrl, setCoverUrl] = useState(article?.cover_image_url ?? null);
  const [published, setPublished] = useState(article?.is_published ?? false);
  const [status, setStatus] = useState<"idle" | "saving" | "uploading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function onTitleChange(next: string) {
    setTitle(next);
    if (!slugTouched && !slugLocked) setSlug(slugify(next));
  }

  async function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    const supabase = getNewsroomClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${slugify(title) || "image"}.${ext}`;
    const { error } = await supabase.storage.from("article-images").upload(path, file);
    if (error) {
      setErrorMsg("इमेज अपलोड नहीं हो सकी।");
      setStatus("error");
      return;
    }
    const { data } = supabase.storage.from("article-images").getPublicUrl(path);
    setCoverUrl(data.publicUrl);
    setStatus("idle");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");
    const supabase = getNewsroomClient();
    const fields = {
      title,
      dek: dek || null,
      category,
      body,
      slug: slug || slugify(title) || `lekh-${Date.now()}`,
      cover_image_url: coverUrl,
      author: profile.display_name,
      ...(isEditor
        ? {
            is_published: published,
            // Stamp publish time on the draft→published flip only.
            ...(published && !article?.is_published
              ? { published_at: new Date().toISOString() }
              : {}),
          }
        : {}),
    };

    const { error } = article
      ? await supabase.from("articles").update(fields).eq("id", article.id)
      : await supabase
          .from("articles")
          .insert({ ...fields, author_id: profile.id, is_published: isEditor && published });

    if (error) {
      setErrorMsg(
        error.code === "23505" ? "यह स्लग पहले से मौजूद है।" : "सहेजा नहीं जा सका।",
      );
      setStatus("error");
      return;
    }
    router.push("/newsroom");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          शीर्षक
          <input
            required
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          उपशीर्षक (डेक)
          <input value={dek} onChange={(e) => setDek(e.target.value)} className={inputCls} />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            श्रेणी
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            स्लग {slugLocked && <span className="font-normal text-muted">(प्रकाशित — लॉक)</span>}
            <input
              required
              value={slug}
              disabled={slugLocked}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={`${inputCls} disabled:opacity-50`}
              dir="ltr"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          कवर इमेज
          <input type="file" accept="image/*" onChange={onImageChange} className="text-sm" />
        </label>
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="कवर इमेज" className="max-h-40 w-auto border border-border" />
        )}

        <label className="flex flex-col gap-1 text-sm font-semibold">
          लेख (Markdown)
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={18}
            className={`${inputCls} font-mono`}
          />
        </label>

        {isEditor ? (
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            प्रकाशित करें
          </label>
        ) : (
          <p className="text-sm text-muted">
            {article?.is_published ? "प्रकाशित (संपादक द्वारा)" : "समीक्षा हेतु प्रतीक्षारत — प्रकाशन संपादक करेंगे।"}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === "saving" || status === "uploading"}
            className="bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {status === "saving" ? "सहेजा जा रहा है…" : "सहेजें"}
          </button>
          {status === "uploading" && <span className="text-sm text-muted">इमेज अपलोड हो रही है…</span>}
          {errorMsg && <span className="text-sm text-primary">{errorMsg}</span>}
        </div>
      </div>

      <div>
        <h2 className="section-header text-lg">पूर्वावलोकन</h2>
        <div className="mt-4 border border-border p-4">
          {title && <h3 className="font-display text-2xl font-bold leading-tight">{title}</h3>}
          {dek && <p className="mt-2 text-muted">{dek}</p>}
          <div className="mt-4">
            <Markdown>{body || "*यहाँ पूर्वावलोकन दिखेगा…*"}</Markdown>
          </div>
        </div>
      </div>
    </form>
  );
}
