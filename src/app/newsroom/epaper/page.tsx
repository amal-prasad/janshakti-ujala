"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getNewsroomClient } from "@/lib/supabase/newsroom";
import { useNewsroomProfile } from "@/components/newsroom/useNewsroomProfile";
import { formatDate } from "@/lib/utils/format";
import type { EpaperEdition } from "@/lib/supabase/types";

const inputCls =
  "w-full border border-border bg-bg px-3 py-2 text-sm text-text outline-none placeholder:text-muted focus:border-primary";

const MAX_BYTES = 25 * 1024 * 1024;

// ePaper upload. Editor-only in the UI; RLS (015) is the real boundary.
// ponytail: no thumbnail generation — thumbnail_url stays null and the public
// /epaper page already falls back gracefully.
export default function NewsroomEpaperPage() {
  const { profile, loading } = useNewsroomProfile();
  const [rows, setRows] = useState<EpaperEdition[]>([]);
  const [editionDate, setEditionDate] = useState("");
  const [title, setTitle] = useState("मुख्य संस्करण");
  const [city, setCity] = useState("मुख्य");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!profile) return;
    getNewsroomClient()
      .from("epaper_editions")
      .select("*")
      .order("edition_date", { ascending: false })
      .then(({ data }) => setRows((data as EpaperEdition[]) ?? []));
  }, [profile]);

  if (loading || !profile) {
    return <div className="container-x py-16 text-center text-muted">लोड हो रहा है…</div>;
  }

  if (profile.role !== "editor") {
    return (
      <div className="container-x py-16 text-center">
        <p className="text-muted">अनुमति नहीं — ई-पेपर केवल संपादक अपलोड कर सकते हैं।</p>
        <Link href="/newsroom" className="mt-4 inline-block text-sm text-primary">
          न्यूज़रूम पर वापस
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    // Trust boundary: validate type + size before anything is uploaded.
    if (!file) {
      setErrorMsg("PDF फ़ाइल चुनें।");
      setStatus("error");
      return;
    }
    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("केवल PDF फ़ाइल स्वीकार्य है।");
      setStatus("error");
      return;
    }
    if (file.size > MAX_BYTES) {
      setErrorMsg("फ़ाइल 25 MB से बड़ी है।");
      setStatus("error");
      return;
    }

    const supabase = getNewsroomClient();
    setStatus("uploading");
    const path = `${editionDate}-${Date.now()}.pdf`;
    const { error: upErr } = await supabase.storage
      .from("epaper-pdfs")
      .upload(path, file, { contentType: "application/pdf" });
    if (upErr) {
      setErrorMsg("PDF अपलोड नहीं हो सका।");
      setStatus("error");
      return;
    }
    const { data: pub } = supabase.storage.from("epaper-pdfs").getPublicUrl(path);

    setStatus("saving");
    const { data, error } = await supabase
      .from("epaper_editions")
      .insert({
        edition_date: editionDate,
        title: title.trim() || "मुख्य संस्करण",
        city: city.trim() || "मुख्य",
        pdf_url: pub.publicUrl,
      })
      .select()
      .single();
    if (error) {
      setErrorMsg(
        error.code === "23505"
          ? "इस तारीख और शहर का संस्करण पहले से मौजूद है।"
          : "संस्करण सहेजा नहीं जा सका।",
      );
      setStatus("error");
      return;
    }
    setRows((prev) => [data as EpaperEdition, ...prev]);
    setFile(null);
    setEditionDate("");
    setStatus("idle");
  }

  return (
    <div className="container-x py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="section-header">ई-पेपर अपलोड</h1>
        <Link href="/newsroom" className="text-sm text-muted hover:text-primary">
          न्यूज़रूम पर वापस
        </Link>
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex max-w-lg flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          संस्करण तिथि
          <input
            required
            type="date"
            value={editionDate}
            onChange={(e) => setEditionDate(e.target.value)}
            className={inputCls}
            dir="ltr"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          शीर्षक
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          शहर
          <input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          PDF फ़ाइल (अधिकतम 25 MB)
          <input
            required
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === "uploading" || status === "saving"}
            className="bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {status === "uploading"
              ? "अपलोड हो रहा है…"
              : status === "saving"
                ? "सहेजा जा रहा है…"
                : "अपलोड करें"}
          </button>
          {errorMsg && <span className="text-sm text-primary">{errorMsg}</span>}
        </div>
      </form>

      <h2 className="section-header mt-10 text-lg">मौजूदा संस्करण</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-muted">कोई संस्करण नहीं मिला।</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-display text-lg font-bold">{r.title}</p>
                <p className="text-sm text-muted">
                  {formatDate(r.edition_date)} • {r.city}
                </p>
              </div>
              <a
                href={r.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline"
              >
                PDF देखें
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
