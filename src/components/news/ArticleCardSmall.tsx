import Link from "next/link";
import Image from "next/image";
import type { ArticleCard as ArticleCardData } from "@/lib/api/articles";
import { readingTimeLabel } from "@/lib/utils/format";

// Compact row: small thumbnail + headline + reading time. Used in the sidebar
// trending rail and the text-heavy headline rows in the main column.
export function ArticleCardSmall({
  article,
  rank,
}: {
  article: ArticleCardData;
  rank?: number;
}) {
  return (
    <article className="flex items-start gap-3">
      {rank && (
        <span className="font-display text-2xl font-bold leading-none text-border">
          {String(rank).padStart(2, "0")}
        </span>
      )}
      {article.cover_image_url && (
        <Link href={`/samachar/${article.slug}`} className="relative block aspect-[4/3] w-20 shrink-0 overflow-hidden bg-surface">
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-sm font-bold leading-snug">
          <Link href={`/samachar/${article.slug}`} className="hover:text-primary">
            <span className="line-clamp-2">{article.title}</span>
          </Link>
        </h3>
        <span className="mt-1 block text-xs text-muted">
          <span className="font-semibold text-text">{article.city}</span>
          {" • "}
          {readingTimeLabel(article.reading_minutes)}
        </span>
      </div>
    </article>
  );
}
