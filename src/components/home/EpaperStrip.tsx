import Image from "next/image";
import Link from "next/link";
import { getEpaperEditions } from "@/lib/api/epaper";
import { formatDate } from "@/lib/utils/format";

// Homepage entry point to the latest ePaper edition. Renders nothing until the
// owner uploads a first edition — the homepage stays unchanged until then.
export async function EpaperStrip() {
  const [edition] = await getEpaperEditions(1);
  if (!edition) return null;

  return (
    <div
      className="flex items-center gap-4 border-l-[3px] bg-surface p-3"
      style={{ borderColor: "var(--saffron)" }}
    >
      <span className="relative block h-16 w-12 shrink-0 overflow-hidden bg-bg">
        {edition.thumbnail_url ? (
          <Image
            src={edition.thumbnail_url}
            alt={edition.title}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-[10px] text-muted">
            पीडीएफ
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-muted">ई-पेपर</p>
        <p className="truncate font-display text-sm font-bold">{edition.title}</p>
        <p className="text-xs text-muted">{formatDate(edition.edition_date)}</p>
      </div>
      <Link
        href={`/epaper/${edition.id}`}
        className="shrink-0 text-sm font-bold text-primary hover:underline"
      >
        आज का ई-पेपर पढ़ें
      </Link>
    </div>
  );
}
