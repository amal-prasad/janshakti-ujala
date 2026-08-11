import Link from "next/link";
import Image from "next/image";
import type { ArticleCard as ArticleCardData } from "@/lib/api/articles";
import { CategoryBadge, Badge, VerdictBadge } from "@/components/ui/Badge";
import { formatDate, readingTimeLabel } from "@/lib/utils/format";

// Default card: cover image, category, title, dek, reading time + date.
// No box-shadow, no gradient (design rule) — separation comes from the grid gap.
export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <article className="flex flex-col gap-2">
      <Link href={`/samachar/${article.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
          {article.cover_image_url && (
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          )}
          {article.is_breaking && (
            <span className="absolute left-0 top-0 m-2">
              <Badge tone="breaking">ताज़ा</Badge>
            </span>
          )}
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <CategoryBadge slug={article.category} />
        {article.verdict && <VerdictBadge verdict={article.verdict} />}
      </div>
      <h3 className="font-display text-lg font-bold leading-snug">
        <Link href={`/samachar/${article.slug}`} className="hover:text-primary">
          <span className="line-clamp-2">{article.title}</span>
        </Link>
      </h3>
      {article.dek && (
        <p className="line-clamp-2 text-sm text-muted">{article.dek}</p>
      )}
      <div className="mt-auto flex items-center gap-2 text-xs text-muted">
        <span className="font-semibold text-text">{article.city}</span>
        <span aria-hidden>•</span>
        <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
        <span aria-hidden>•</span>
        <span>{readingTimeLabel(article.reading_minutes)}</span>
      </div>
    </article>
  );
}
