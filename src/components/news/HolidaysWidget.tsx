import { getUpcomingHolidays } from "@/lib/api/holidays";

const TYPE_LABEL: Record<string, string> = {
  national: "राष्ट्रीय अवकाश",
  religious: "धार्मिक",
  regional: "क्षेत्रीय",
};

export async function HolidaysWidget() {
  const holidays = await getUpcomingHolidays(6);
  if (holidays.length === 0) return null;

  return (
    <section>
      <h2 className="section-header">आगामी अवकाश एवं त्योहार</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
        {holidays.map((h) => (
          <div key={`${h.name}-${h.date}`} className="border border-border p-4">
            <div className="font-display text-lg font-bold text-primary">{h.dateLabel}</div>
            <div className="mt-1 font-display font-bold">{h.name}</div>
            <div className="mt-1 text-xs text-muted">{TYPE_LABEL[h.type]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
