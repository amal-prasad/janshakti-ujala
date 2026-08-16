import Link from "next/link";
import Image from "next/image";
import type { ArticleCard as ArticleCardData } from "@/lib/api/articles";
import { CategoryBadge, Badge } from "@/components/ui/Badge";
import { formatDate, readingTimeLabel } from "@/lib/utils/format";

// The lead story. Full-bleed image, commanding headline — the one place size
// is allowed to shout (clamp ceiling still respected).
export function HeroCard({ article }: { article: ArticleCardData }) {
  return (
    <article>
      <Link href={`/samachar/${article.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface md:aspect-[2/1]">
          {article.cover_image_url && (
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
            />
          )}
          {article.is_breaking && (
            <span className="absolute left-0 top-0 m-3">
              <Badge tone="breaking">ताज़ा</Badge>
            </span>
          )}
        </div>
      </Link>
      <div className="mt-4 max-w-3xl">
        <div className="flex items-center gap-2">
          <CategoryBadge slug={article.category} />
        </div>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-balance">
          <Link href={`/samachar/${article.slug}`} className="hover:text-primary">
            {article.title}
          </Link>
        </h1>
        {article.dek && (
          <p className="mt-3 text-balance text-lg text-muted">{article.dek}</p>
        )}
        <div className="mt-3 flex items-center gap-2 text-sm text-muted">
          <span className="font-semibold text-text">{article.city}</span>
          <span aria-hidden>•</span>
          <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
          <span aria-hidden>•</span>
          <span>{readingTimeLabel(article.reading_minutes)}</span>
        </div>
      </div>
    </article>
  );
}
