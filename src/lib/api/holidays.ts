// Calendarific API — request-cached, no DB table (no admin surface needed for
// a read-only external feed; regenerated daily via `next: { revalidate }`).

export type Holiday = {
  name: string;
  date: string; // ISO yyyy-mm-dd
  dateLabel: string; // Hindi via Intl
  type: "national" | "religious" | "regional";
};

type CalendarificHoliday = {
  name: string;
  date: { iso: string };
  type: string[];
  states?: string;
};

// English → Devanagari for major Indian holidays. Calendarific only returns
// English names. ponytail: unmapped holiday names fall back to Calendarific
// English; extend map when one shows up.
const HINDI_NAMES: Record<string, string> = {
  "diwali": "दीपावली",
  "deepavali": "दीपावली",
  "holi": "होली",
  "raksha bandhan": "रक्षा बंधन",
  "dussehra": "दशहरा",
  "vijayadashami": "दशहरा",
  "janmashtami": "जन्माष्टमी",
  "republic day": "गणतंत्र दिवस",
  "independence day": "स्वतंत्रता दिवस",
  "gandhi jayanti": "गांधी जयंती",
  "christmas": "क्रिसमस",
  "good friday": "गुड फ्राइडे",
  "eid al-fitr": "ईद-उल-फ़ित्र",
  "eid al-adha": "ईद-उल-अज़हा",
  "bakrid": "ईद-उल-अज़हा",
  "muharram": "मुहर्रम",
  "guru nanak jayanti": "गुरु नानक जयंती",
  "maha shivaratri": "महाशिवरात्रि",
  "ram navami": "राम नवमी",
  "hanuman jayanti": "हनुमान जयंती",
  "makar sankranti": "मकर संक्रांति",
  "vasant panchami": "वसंत पंचमी",
  "karva chauth": "करवा चौथ",
  "chhath puja": "छठ पूजा",
  "navratri": "नवरात्रि",
  "ganesh chaturthi": "गणेश चतुर्थी",
  "onam": "ओणम",
  "pongal": "पोंगल",
  "baisakhi": "बैसाखी",
  "vaisakhi": "बैसाखी",
  "buddha purnima": "बुद्ध पूर्णिमा",
  "mahavir jayanti": "महावीर जयंती",
  "ambedkar jayanti": "अंबेडकर जयंती",
  "new year's day": "नववर्ष",
  "children's day": "बाल दिवस",
  "teachers' day": "शिक्षक दिवस",
};

function toHindiName(englishName: string): string {
  const normalized = englishName.toLowerCase();
  for (const [key, hindi] of Object.entries(HINDI_NAMES)) {
    if (normalized.includes(key)) return hindi;
  }
  return englishName;
}

function toOurType(h: CalendarificHoliday): Holiday["type"] {
  if (h.type.includes("National holiday")) return "national";
  if (h.states && h.states !== "All") return "regional";
  return "religious";
}

const KEEP_TYPES = ["National holiday", "Hindu", "Religious", "Observance"];

async function fetchYear(key: string, year: number): Promise<CalendarificHoliday[]> {
  const res = await fetch(
    `https://calendarific.com/api/v2/holidays?api_key=${key}&country=IN&year=${year}`,
    { next: { revalidate: 86400 } },
  );
  if (!res.ok) return [];
  const json = await res.json();
  return (json?.response?.holidays ?? []) as CalendarificHoliday[];
}

export async function getUpcomingHolidays(limit = 6): Promise<Holiday[]> {
  const key = process.env.CALENDARIFIC_API_KEY;
  if (!key) return [];

  try {
    const now = new Date();
    const year = now.getFullYear();
    const todayIso = now.toISOString().slice(0, 10);

    const raw = await fetchYear(key, year);
    const filtered = raw.filter((h) => h.type.some((t) => KEEP_TYPES.includes(t)));
    let upcoming = filtered.filter((h) => h.date.iso >= todayIso);

    if (upcoming.length < limit) {
      const nextYearRaw = await fetchYear(key, year + 1);
      const nextYearFiltered = nextYearRaw.filter((h) =>
        h.type.some((t) => KEEP_TYPES.includes(t)),
      );
      upcoming = upcoming.concat(nextYearFiltered);
    }

    const seen = new Set<string>();
    const deduped = upcoming.filter((h) => {
      const key = `${h.name}|${h.date.iso}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    deduped.sort((a, b) => a.date.iso.localeCompare(b.date.iso));

    const hindiFormatter = new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "long" });
    return deduped.slice(0, limit).map((h) => ({
      name: toHindiName(h.name),
      date: h.date.iso,
      dateLabel: hindiFormatter.format(new Date(h.date.iso)),
      type: toOurType(h),
    }));
  } catch {
    return [];
  }
}
