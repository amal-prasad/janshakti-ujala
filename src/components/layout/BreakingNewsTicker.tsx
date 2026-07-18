import type { LiveNews } from "@/lib/supabase/types";

// GNews leads-only ticker: links out to source, never copies bodies (CLAUDE.md
// hard rule). Track is duplicated so the marquee loops seamlessly.
export function BreakingNewsTicker({ items }: { items: LiveNews[] }) {
  if (items.length === 0) return null;

  return (
    <div className="relative flex h-10 items-center overflow-hidden border-b border-border bg-primary text-white">
      {/* Fixed "LIVE" badge — sits above the scroll layer */}
      <span className="relative z-10 flex shrink-0 items-center gap-1.5 bg-primary px-4 text-xs font-bold uppercase tracking-wide shadow-[4px_0_8px_0_rgba(0,0,0,0.25)]">
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot" aria-hidden />
        लाइव
      </span>

      {/* Scroll area fills the rest of the row */}
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="ticker-track flex gap-16 whitespace-nowrap text-sm">
          {[...items, ...items].map((item, i) => (
            <a
              key={`${item.id}-${i}`}
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 hover:underline"
            >
              ● &nbsp;{item.headline}
              {item.source_name && (
                <span className="ml-2 text-white/70">— {item.source_name}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
