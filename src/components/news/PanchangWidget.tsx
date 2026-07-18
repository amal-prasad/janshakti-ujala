import { getDailyPanchang } from "@/lib/api/prokerala";

export async function PanchangWidget() {
  const p = await getDailyPanchang();
  if (!p) return null;

  const rows: [string, string][] = [
    ["तिथि", p.tithi],
    ["नक्षत्र", p.nakshatra],
    ["सूर्योदय", p.sunrise],
    ["सूर्यास्त", p.sunset],
  ];

  return (
    <section>
      <h2 className="section-header">आज का पंचांग</h2>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <span className="text-muted">{label}: </span>
            <span className="font-semibold text-text">{value}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted text-right italic">स्थान: इंदौर</p>
    </section>
  );
}
