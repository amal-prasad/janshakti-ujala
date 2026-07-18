import { getTodayPanchang } from "@/lib/panchang";

// Slim single-line panchang bar for the top of the homepage — the daily-utility
// hook every big Hindi daily runs, without spending vertical space. Scrolls
// horizontally on small screens. Server component, no client JS.
export async function PanchangStrip() {
  const p = await getTodayPanchang();
  if (!p) return null;

  const items: [string, string][] = [
    ["तिथि", p.tithi],
    ["पक्ष", p.paksha],
    ["नक्षत्र", p.nakshatra],
    ["योग", p.yoga],
    ["करण", p.karana],
    ["मास", p.masa],
    ["सूर्योदय", p.sunrise],
    ["सूर्यास्त", p.sunset],
  ];

  return (
    <section aria-label="आज का पंचांग" className="border-b border-border bg-surface">
      <div className="container-x flex items-center gap-x-4 overflow-x-auto whitespace-nowrap py-2 text-xs md:text-sm">
        <span className="shrink-0 font-display font-bold text-primary">आज का पंचांग</span>
        <span className="shrink-0 text-muted">{p.dateLabel}</span>
        {items.map(([label, value]) => (
          <span key={label} className="shrink-0">
            <span className="text-muted">{label}: </span>
            <span className="font-semibold text-text">{value}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
