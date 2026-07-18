import type { Metadata } from "next";
import Image from "next/image";
import { getEpaperEditions } from "@/lib/api/epaper";
import { formatDate } from "@/lib/utils/format";

// Reads live data per request (Supabase-backed).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ई-पेपर",
  description: "जनशक्ति उजाला के ई-पेपर संस्करण — PDF में पढ़ें।",
};

export default async function EpaperPage() {
  const editions = await getEpaperEditions();

  return (
    <div className="container-x py-8">
      <h1
        className="border-l-[3px] pl-3 font-display text-2xl font-bold md:text-3xl"
        style={{ borderColor: "var(--saffron)" }}
      >
        ई-पेपर
      </h1>
      {editions.length === 0 ? (
        <p className="mt-6 text-muted">अभी कोई संस्करण उपलब्ध नहीं है।</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {editions.map((e) => (
            <a
              key={e.id}
              href={e.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <span className="relative block aspect-[3/4] w-full overflow-hidden bg-surface">
                {e.thumbnail_url ? (
                  <Image
                    src={e.thumbnail_url}
                    alt={e.title}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-sm text-muted">
                    पीडीएफ
                  </span>
                )}
              </span>
              <p className="mt-2 font-display text-sm font-bold hover:text-primary">{e.title}</p>
              <p className="mt-1 text-xs text-muted">
                {e.city} · {formatDate(e.edition_date)}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
