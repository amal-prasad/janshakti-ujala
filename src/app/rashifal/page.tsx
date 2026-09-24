import type { Metadata } from "next";
import { getAllRashifalToday } from "@/lib/api/rashifal";
import { getZodiac } from "@/lib/zodiacSigns";
import { siteConfig } from "@/lib/siteConfig";

// Scoped to today's IST date, so it must not be cached indefinitely — but a 60s
// revalidate bounds the staleness at the midnight rollover to one minute, which is
// cheaper than per-request SSR on every hit (SEO audit, issue F36).
export const revalidate = 60;

export const metadata: Metadata = {
  title: "आज का राशिफल",
  description: "जनशक्ति उजाला पर पढ़ें आज का राशिफल — सभी 12 राशियों के लिए।",
  alternates: { canonical: `${siteConfig.url}/rashifal` },
};

export default async function RashifalPage() {
  const signs = await getAllRashifalToday();
  const dateLabel = new Intl.DateTimeFormat("hi-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-2">आज का राशिफल</h1>
      {/* The date is load-bearing, not decoration: a reader must be able to tell
          whether what they are reading is actually today's. */}
      <p className="mb-6 text-sm text-muted">{dateLabel}</p>
      {signs.length === 0 ? (
        <p className="text-muted">आज का राशिफल अभी उपलब्ध नहीं है। कृपया कुछ देर बाद देखें।</p>
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

      {/* Syndicated third-party content. Saying so is the honest signal — and it
          is what keeps the page from reading as original reporting it is not. */}
      <p className="mt-8 border-t border-border pt-4 text-xs text-muted">
        राशिफल ज्योतिषीय गणना पर आधारित एक बाहरी सेवा से प्रतिदिन स्वतः प्राप्त होता
        है। यह हमारी संपादकीय रिपोर्टिंग नहीं है और इसे किसी चिकित्सीय, कानूनी या
        वित्तीय सलाह के रूप में न लें।
      </p>
    </div>
  );
}
