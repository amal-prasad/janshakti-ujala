// Local panchang computation via mhah-panchang (no API, no cron, no DB).
// The package's built-in `name` field is Odia script and `name_en_IN` is
// English/IAST — neither is Hindi Devanagari, so we map the (small, fixed)
// index sets to Hindi ourselves.

// mhah-panchang ships no TS types — describe the shape we use inline.
interface PanchangCalendar {
  Tithi: { ino: number };
  Paksha: { ino: number };
  Nakshatra: { ino: number };
  Yoga: { ino: number };
  Karna: { ino: number };
  MoonMasa: { ino: number };
}
interface PanchangSun {
  sunRise: Date;
  sunSet: Date;
}
interface MhahPanchangInstance {
  calendar(dt: Date, lat: number, lng: number, height?: number): PanchangCalendar;
  sunTimer(date: Date, lat: number, lng: number, height?: number): PanchangSun;
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const MhahPanchang = require("mhah-panchang").MhahPanchang as new () => MhahPanchangInstance;

// Lucknow, UP — fixed reference point for the whole site (no user geolocation).
const LAT = 26.85;
const LNG = 80.95;

const TITHI_HI = [
  "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी",
  "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी",
  "पूर्णिमा", "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी",
  "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी",
  "चतुर्दशी", "अमावस्या",
];

const PAKSHA_HI = ["शुक्ल पक्ष", "कृष्ण पक्ष"];

const NAKSHATRA_HI = [
  "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु",
  "पुष्य", "आश्लेषा", "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी", "हस्त",
  "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा",
  "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वाभाद्रपद",
  "उत्तराभाद्रपद", "रेवती",
];

const YOGA_HI = [
  "विष्कुम्भ", "प्रीति", "आयुष्मान", "सौभाग्य", "शोभन", "अतिगण्ड", "सुकर्मा",
  "धृति", "शूल", "गण्ड", "वृद्धि", "ध्रुव", "व्याघात", "हर्षण", "वज्र",
  "सिद्धि", "व्यतीपात", "वरीयान", "परिघ", "शिव", "सिद्ध", "साध्य", "शुभ",
  "शुक्ल", "ब्रह्म", "इन्द्र", "वैधृति",
];

const KARANA_HI = [
  "किंस्तुघ्न", "बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टि",
  "शकुनि", "चतुष्पाद", "नाग",
];

// Order must match mhahConstant.Masa.name_en_IN: Baisakha, Jyestha, Asadha,
// Srabana, Bhadraba, Aswina, Karttika, Margasira, Pausa, Magha, Phalguna, Chaitra.
const MASA_HI = [
  "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक",
  "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन", "चैत्र",
];

export interface Panchang {
  dateLabel: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  masa: string;
  sunrise: string;
  sunset: string;
}

function istToday(): Date {
  // "Today" in Asia/Kolkata, not the server's local/UTC date.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return new Date(
    `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}+05:30`
  );
}

function formatIstTime(d: Date): string {
  return new Intl.DateTimeFormat("hi-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export async function getTodayPanchang(): Promise<Panchang | null> {
  try {
    const today = istToday();
    const panchang = new MhahPanchang();
    const cal = panchang.calendar(today, LAT, LNG);
    const sun = panchang.sunTimer(today, LAT, LNG);

    const dateLabel = new Intl.DateTimeFormat("hi-IN", {
      dateStyle: "full",
      timeZone: "Asia/Kolkata",
    }).format(today);

    return {
      dateLabel,
      tithi: TITHI_HI[cal.Tithi.ino] ?? "",
      paksha: PAKSHA_HI[cal.Paksha.ino] ?? "",
      nakshatra: NAKSHATRA_HI[cal.Nakshatra.ino] ?? "",
      yoga: YOGA_HI[cal.Yoga.ino] ?? "",
      karana: KARANA_HI[cal.Karna.ino] ?? "",
      masa: MASA_HI[cal.MoonMasa.ino] ?? "",
      sunrise: formatIstTime(sun.sunRise),
      sunset: formatIstTime(sun.sunSet),
    };
  } catch {
    return null;
  }
}
