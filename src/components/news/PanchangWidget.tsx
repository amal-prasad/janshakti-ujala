import { getTodayPanchang } from "@/lib/panchang";

// Server component — computed locally, no client JS, no API call.
export async function PanchangWidget() {
  const p = await getTodayPanchang();
  if (!p) return null;

  const rows: [string, string][] = [
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
    <section>
      <h2 className="section-header">आज का पंचांग</h2>
      <p className="mt-2 text-sm text-muted">{p.dateLabel}</p>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <span className="text-muted">{label}: </span>
            <span className="font-semibold text-text">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
