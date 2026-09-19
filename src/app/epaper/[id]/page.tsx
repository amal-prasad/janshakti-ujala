import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEpaperEdition } from "@/lib/api/epaper";
import { formatDate } from "@/lib/utils/format";

// Reads live data per request (Supabase-backed).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const edition = await getEpaperEdition(params.id);
  if (!edition) {
    return { title: "ई-पेपर" };
  }
  return {
    title: `${edition.title} — ई-पेपर`,
    description: `${edition.city} · ${formatDate(edition.edition_date)} का ई-पेपर संस्करण।`,
  };
}

export default async function EpaperEditionPage({ params }: { params: { id: string } }) {
  const edition = await getEpaperEdition(params.id);
  if (!edition) {
    notFound();
  }

  return (
    <div className="container-x py-8">
      <Link href="/epaper" className="text-sm text-muted hover:text-primary">
        ← सभी संस्करण
      </Link>
      <h1
        className="mt-4 border-l-[3px] pl-3 font-display text-2xl font-bold md:text-3xl"
        style={{ borderColor: "var(--saffron)" }}
      >
        {edition.title}
      </h1>
      <p className="mt-1 pl-3 text-sm text-muted">
        {edition.city} · {formatDate(edition.edition_date)}
      </p>

      <div className="mt-6">
        <iframe src={edition.pdf_url} className="h-[80vh] w-full" title={edition.title} />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <a
          href={edition.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-primary hover:underline"
        >
          नए टैब में खोलें
        </a>
        <a href={edition.pdf_url} download className="font-bold text-primary hover:underline">
          डाउनलोड करें
        </a>
      </div>
    </div>
  );
}
