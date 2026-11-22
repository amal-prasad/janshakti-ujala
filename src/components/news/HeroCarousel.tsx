"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ArticleCard } from "@/lib/api/articles";
import { HeroCard } from "./HeroCard";

const INTERVAL_MS = 5000;

// Scroll-snap slider: native swipe on touch, JS only drives autoplay/buttons/dots.
// Slide 0 is server-rendered like any client component, so LCP is unaffected.
export function HeroCarousel({ articles }: { articles: ArticleCard[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true); // true until checked: no autoplay pre-hydration
  const n = articles.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = (i + n) % n;
      el.scrollTo({ left: next * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
    },
    [n, reduced],
  );

  useEffect(() => {
    if (n < 2 || paused || reduced) return;
    const t = setInterval(() => goTo(index + 1), INTERVAL_MS);
    return () => clearInterval(t);
  }, [n, paused, reduced, index, goTo]);

  if (n === 0) return null;
  if (n === 1) return <HeroCard article={articles[0]} />;

  const btn =
    "flex h-9 w-9 items-center justify-center border border-border bg-surface text-text hover:text-primary";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="मुख्य समाचार"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        ref={track}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((a, i) => (
          <div
            key={a.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${n}`}
            className="w-full shrink-0 snap-start"
          >
            <HeroCard article={a} first={i === 0} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="button" className={btn} aria-label="पिछली खबर" onClick={() => goTo(index - 1)}>
          ‹
        </button>
        <div className="flex items-center gap-2">
          {articles.map((a, i) => (
            <button
              key={a.id}
              type="button"
              aria-label={`खबर ${i + 1} पर जाएँ`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
        <button type="button" className={btn} aria-label="अगली खबर" onClick={() => goTo(index + 1)}>
          ›
        </button>
      </div>
    </section>
  );
}
