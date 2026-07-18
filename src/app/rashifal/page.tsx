import type { Metadata } from "next";
import { getAllRashifalToday } from "@/lib/api/rashifal";
import { getZodiac } from "@/lib/zodiacSigns";

// Reads live data per request (Supabase-backed).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "आज का राशिफल",
  description: "जनशक्ति उजाला पर पढ़ें आज का राशिफल — सभी 12 राशियों के लिए।",
};

export default async function RashifalPage() {
  const signs = await getAllRashifalToday();

  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">आज का राशिफल</h1>
      {signs.length === 0 ? (
        <p className="text-muted">अभी राशिफल उपलब्ध नहीं है।</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {signs.map((r) => {
            const zodiac = getZodiac(r.sign);
            return (
              <div key={r.id} className="border border-border p-4">
                <span className="font-display text-4xl">{zodiac?.symbol}</span>
                <p className="mt-2 font-display text-lg font-bold">{zodiac?.name}</p>
                <p className="mt-2 text-sm text-muted">{r.prediction}</p>
                {(r.lucky_number != null || r.lucky_color) && (
                  <p className="mt-2 text-xs text-muted">
                    {r.lucky_number != null && `शुभ अंक: ${r.lucky_number}`}
                    {r.lucky_number != null && r.lucky_color && " · "}
                    {r.lucky_color && `शुभ रंग: ${r.lucky_color}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
