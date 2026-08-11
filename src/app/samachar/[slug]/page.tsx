export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug, DEFAULT_CITY } from "@/lib/api/articles";
import { RelatedArticles } from "@/components/news/RelatedArticles";
import { ArticleBody } from "@/components/news/ArticleBody";
import { CategoryBadge, VerdictBadge } from "@/components/ui/Badge";
import { formatDate, readingTimeLabel } from "@/lib/utils/format";
import { buildNewsArticleSchema, jsonLdScript } from "@/lib/utils/structuredData";
import { siteConfig } from "@/lib/siteConfig";


type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "खबर नहीं मिली" };
  const url = `${siteConfig.url}/samachar/${article.slug}`;
  const description = article.dek ?? undefined;
  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const url = `${siteConfig.url}/samachar/${article.slug}`;
  const schema = buildNewsArticleSchema(article, url);

  return (
    <div className="container-x py-8">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}
      />
      <article className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge slug={article.category} />
          {article.verdict && <VerdictBadge verdict={article.verdict} />}
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl">
          {article.title}
        </h1>
        {article.dek && (
          <p className="mt-3 text-lg text-muted">{article.dek}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-y border-border py-3 text-sm text-muted">
          <span className="font-semibold text-text">{article.city ?? DEFAULT_CITY}</span>
          <span aria-hidden>•</span>
          <span>{article.author}</span>
          <span aria-hidden>•</span>
          <time dateTime={article.published_at}>
            {formatDate(article.published_at)}
          </time>
          <span aria-hidden>•</span>
          <span>{readingTimeLabel(article.reading_minutes)}</span>
        </div>

        {article.cover_image_url && (
          <div className="relative my-6 aspect-[16/9] w-full overflow-hidden bg-surface">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <ArticleBody article={article} />

        {article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <a
                key={t}
                href={`/vishay/${encodeURIComponent(t)}`}
                className="border border-border px-3 py-1 text-sm text-muted hover:border-primary hover:text-primary"
              >
                #{t}
              </a>
            ))}
          </div>
        )}
      </article>

      <div className="mx-auto max-w-3xl">
        <RelatedArticles article={article} />
      </div>
    </div>
  );
}
