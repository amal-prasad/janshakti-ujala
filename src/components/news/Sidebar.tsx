import Link from "next/link";
import type { ArticleCard as ArticleCardData } from "@/lib/api/articles";
import type { Rashifal } from "@/lib/supabase/types";
import { ArticleCardSmall } from "@/components/news/ArticleCardSmall";
import { NewsletterForm } from "@/components/news/NewsletterForm";
import { HolidaysWidget } from "@/components/news/HolidaysWidget";
import { PanchangWidget } from "@/components/news/PanchangWidget";
import { AdSlot } from "@/components/AdSlot";
import { getZodiac } from "@/lib/zodiacSigns";
import { truncate } from "@/lib/utils/format";

// Dense, high-utility right column. Sticky on desktop only — on mobile it
// flows after the main column (no fixed/sticky chrome competing with reading).
export function Sidebar({
  trending,
  rashifal,
}: {
  trending: ArticleCardData[];
  rashifal: Rashifal | null;
}) {
  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-16 lg:self-start">
      <AdSlot slot="sidebar" />

      {trending.length > 0 && (
        <section>
          <h2 className="section-header">ट्रेंडिंग</h2>
          <div className="mt-4 flex flex-col gap-4">
            {trending.map((a, i) => (
              <ArticleCardSmall key={a.id} article={a} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {rashifal && (
        <section>
          <h2 className="section-header">आज का राशिफल</h2>
          <Link href="/rashifal" className="mt-4 block">
            <span className="font-display text-3xl">{getZodiac(rashifal.sign)?.symbol}</span>
            <p className="mt-1 font-display text-base font-bold text-text hover:text-primary">
              {getZodiac(rashifal.sign)?.name}
            </p>
            <p className="mt-1 text-sm text-muted">{truncate(rashifal.prediction, 110)}</p>
            <span className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
              सभी राशियाँ देखें →
            </span>
          </Link>
        </section>
      )}

      <HolidaysWidget />
      <PanchangWidget />

      <section className="bg-surface p-5">
        <h2 className="font-display text-lg font-bold">न्यूज़लेटर सब्सक्राइब करें</h2>
        <p className="mt-1 text-sm text-muted">रोज़ की मुख्य खबरें सीधे आपके ईमेल पर।</p>
        <div className="mt-3">
          <NewsletterForm />
        </div>
      </section>
    </aside>
  );
}
