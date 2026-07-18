"use client";

import { useState } from "react";
import type { Holiday } from "@/lib/api/holidays";

const TYPE_LABEL: Record<string, string> = {
  national: "राष्ट्रीय अवकाश",
  religious: "धार्मिक",
  regional: "क्षेत्रीय",
};

export function HolidaysClientWidget({ holidays }: { holidays: Holiday[] }) {
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

  // Check if today matches any holiday
  const todayIso = new Date().toISOString().slice(0, 10);
  const todayFormatter = new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
  });
  const todayLabel = todayFormatter.format(new Date());
  
  const todayHolidays = holidays.filter((h) => h.date === todayIso);

  return (
    <section>
      <div className="mb-4">
        <h2 className="section-header">आगामी अवकाश एवं त्योहार</h2>
        <p className="mt-2 text-sm font-semibold text-primary">
          आज {todayLabel} है
          {todayHolidays.length > 0 && ` - ${todayHolidays.map(h => h.name).join(" और ")} की शुभकामनाएँ!`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {holidays.map((h) => (
          <button
            key={`${h.name}-${h.date}`}
            onClick={() => setSelectedHoliday(h)}
            className="flex flex-col items-start border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            title="अधिक जानकारी के लिए क्लिक करें"
          >
            <div className="font-display text-lg font-bold text-primary">
              {h.dateLabel}
            </div>
            <div className="mt-1 font-display font-bold">{h.name}</div>
            <div className="mt-1 text-xs text-muted">{TYPE_LABEL[h.type]}</div>
          </button>
        ))}
      </div>

      {selectedHoliday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm border border-border bg-background p-6 shadow-xl">
            <button
              onClick={() => setSelectedHoliday(null)}
              className="absolute right-4 top-4 p-1 text-muted hover:text-text"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <h3 className="font-display text-2xl font-bold text-primary">
              {selectedHoliday.name}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {selectedHoliday.dateLabel} • {TYPE_LABEL[selectedHoliday.type]}
            </p>
            <div className="mt-4 text-sm leading-relaxed">
              {selectedHoliday.description ? (
                <p>{selectedHoliday.description}</p>
              ) : (
                <p className="italic text-muted">इस अवकाश के लिए अधिक जानकारी उपलब्ध नहीं है।</p>
              )}
            </div>
            <button
              onClick={() => setSelectedHoliday(null)}
              className="mt-6 w-full bg-primary py-2 text-white font-bold hover:bg-primary/90"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
