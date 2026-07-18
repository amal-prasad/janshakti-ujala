// Calendarific API — request-cached, no DB table (no admin surface needed for
// a read-only external feed; regenerated daily via `next: { revalidate }`).

export type Holiday = {
  name: string;
  date: string; // ISO yyyy-mm-dd
  dateLabel: string; // Hindi via Intl
  type: "national" | "religious" | "regional";
  description?: string;
};

type CalendarificHoliday = {
  name: string;
  description?: string;
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

// Static fallback — published 2026-27 dates for the major festivals, so the
// widget never renders empty when CALENDARIFIC_API_KEY is missing or the API
// is down. ponytail: dates end at Republic Day 2027; extend yearly.
const FALLBACK_HOLIDAYS: { name: string; date: string; type: Holiday["type"]; description: string }[] = [
  { name: "मकर संक्रांति", date: "2026-01-14", type: "religious", description: "सूर्य के मकर राशि में प्रवेश का पर्व। इस दिन लोग पवित्र नदियों में स्नान करते हैं, दान देते हैं और पतंग उड़ाते हैं।" },
  { name: "वसंत पंचमी", date: "2026-01-23", type: "religious", description: "ज्ञान, कला और संगीत की देवी सरस्वती की पूजा का दिन। इस दिन से वसंत ऋतु का आगमन माना जाता है।" },
  { name: "गणतंत्र दिवस", date: "2026-01-26", type: "national", description: "26 जनवरी 1950 को भारत का संविधान लागू होने के उपलक्ष्य में मनाया जाने वाला राष्ट्रीय पर्व। इस दिन नई दिल्ली में राजपथ पर भव्य परेड होती है।" },
  { name: "महाशिवरात्रि", date: "2026-02-15", type: "religious", description: "भगवान शिव और माता पार्वती के विवाह का पावन पर्व। भक्त इस दिन व्रत रखते हैं और शिवलिंग पर जल-अभिषेक करते हैं।" },
  { name: "होली", date: "2026-03-04", type: "religious", description: "रंगों और उल्लास का त्योहार। यह बुराई पर अच्छाई की जीत (होलिका दहन) और वसंत के आगमन का प्रतीक है।" },
  { name: "राम नवमी", date: "2026-03-26", type: "religious", description: "मर्यादा पुरुषोत्तम भगवान श्री राम के जन्म का उत्सव। इस दिन मंदिरों में विशेष पूजा-अर्चना और भजन-कीर्तन होते हैं।" },
  { name: "हनुमान जयंती", date: "2026-04-02", type: "religious", description: "भगवान हनुमान जी का जन्मोत्सव। भक्त हनुमान चालीसा का पाठ करते हैं और मंदिरों में सिंदूर चढ़ाते हैं।" },
  { name: "अंबेडकर जयंती", date: "2026-04-14", type: "national", description: "भारतीय संविधान के निर्माता डॉ. बी.आर. अंबेडकर की जयंती। इस दिन समानता और न्याय के उनके संदेश को याद किया जाता है।" },
  { name: "बुद्ध पूर्णिमा", date: "2026-05-01", type: "religious", description: "भगवान गौतम बुद्ध का जन्म, ज्ञान प्राप्ति और महापरिनिर्वाण दिवस। यह शांति और अहिंसा का संदेश देता है।" },
  { name: "स्वतंत्रता दिवस", date: "2026-08-15", type: "national", description: "15 अगस्त 1947 को ब्रिटिश शासन से भारत को मिली आज़ादी का जश्न। इस दिन लाल किले से तिरंगा फहराया जाता है।" },
  { name: "रक्षा बंधन", date: "2026-08-28", type: "religious", description: "भाई-बहन के पवित्र प्रेम का प्रतीक। बहनें भाइयों की कलाई पर राखी बांधकर उनकी लंबी उम्र की कामना करती हैं।" },
  { name: "जन्माष्टमी", date: "2026-09-04", type: "religious", description: "भगवान श्रीकृष्ण के जन्म का उत्सव। मंदिरों को सजाया जाता है और रात में 12 बजे जन्मोत्सव मनाया जाता है।" },
  { name: "गणेश चतुर्थी", date: "2026-09-14", type: "religious", description: "विघ्नहर्ता भगवान गणेश का जन्मोत्सव। भक्त 10 दिनों तक गणेश जी की प्रतिमा स्थापित कर उनकी पूजा करते हैं।" },
  { name: "गांधी जयंती", date: "2026-10-02", type: "national", description: "राष्ट्रपिता महात्मा गांधी का जन्म दिवस। इस दिन उनके सत्य और अहिंसा के सिद्धांतों को याद किया जाता है।" },
  { name: "दशहरा", date: "2026-10-20", type: "religious", description: "बुराई पर अच्छाई की जीत का पर्व। इसी दिन भगवान राम ने रावण का वध किया था और माँ दुर्गा ने महिषासुर का संहार किया था।" },
  { name: "दीपावली", date: "2026-11-08", type: "religious", description: "रोशनी और दीपों का महापर्व। भगवान राम के 14 वर्ष के वनवास के बाद अयोध्या लौटने की खुशी में मनाया जाता है।" },
  { name: "छठ पूजा", date: "2026-11-15", type: "religious", description: "सूर्य देव और छठी मैया की उपासना का महापर्व। मुख्य रूप से बिहार और यूपी में यह चार दिनों तक मनाया जाता है।" },
  { name: "गुरु नानक जयंती", date: "2026-11-24", type: "religious", description: "सिख धर्म के संस्थापक गुरु नानक देव जी का प्रकाश पर्व। इस दिन गुरुद्वारों में लंगर और शबद कीर्तन का आयोजन होता है।" },
  { name: "क्रिसमस", date: "2026-12-25", type: "religious", description: "प्रभु यीशु मसीह (Jesus Christ) का जन्म दिवस। लोग इस दिन चर्च जाते हैं और एक-दूसरे को उपहार देते हैं।" },
  { name: "नववर्ष", date: "2027-01-01", type: "national", description: "ग्रेगोरियन कैलेंडर के अनुसार नए साल का पहला दिन। लोग नई उम्मीदों के साथ इसका जश्न मनाते हैं।" },
  { name: "गणतंत्र दिवस", date: "2027-01-26", type: "national", description: "26 जनवरी 1950 को भारत का संविधान लागू होने के उपलक्ष्य में मनाया जाने वाला राष्ट्रीय पर्व। इस दिन नई दिल्ली में राजपथ पर भव्य परेड होती है।" },
];

function fallbackUpcoming(limit: number): Holiday[] {
  const todayIso = new Date().toISOString().slice(0, 10);
  const fmt = new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "long" });
  return FALLBACK_HOLIDAYS.filter((h) => h.date >= todayIso)
    .slice(0, limit)
    .map((h) => ({ ...h, dateLabel: fmt.format(new Date(h.date)) }));
}

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
  if (!key) return fallbackUpcoming(limit);

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
    const list = deduped.slice(0, limit).map((h) => ({
      name: toHindiName(h.name),
      date: h.date.iso,
      dateLabel: hindiFormatter.format(new Date(h.date.iso)),
      type: toOurType(h),
      description: h.description,
    }));
    return list.length > 0 ? list : fallbackUpcoming(limit);
  } catch {
    return fallbackUpcoming(limit);
  }
}
