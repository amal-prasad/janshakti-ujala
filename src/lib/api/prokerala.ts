let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getProkeralaToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  const clientId = process.env.PROKERALA_CLIENT_ID;
  const clientSecret = process.env.PROKERALA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PROKERALA_CLIENT_ID or PROKERALA_CLIENT_SECRET is missing");
  }

  const response = await fetch("https://api.prokerala.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store", // tokens shouldn't be statically cached
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Prokerala token: ${await response.text()}`);
  }

  const data = await response.json();
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000 - 60000, // expire 1 min early
  };

  return data.access_token;
}

export async function fetchProkeralaRashifal(sign: string, date: string, isRetry = false): Promise<string> {
  const token = await getProkeralaToken();
  const datetime = isRetry ? "2026-01-01T00:00:00Z" : `${date}T00:00:00Z`;

  const url = new URL("https://api.prokerala.com/v2/astrology/horoscope/daily");
  url.searchParams.append("sign", sign);
  url.searchParams.append("datetime", datetime);
  url.searchParams.append("la", "hi"); // Hindi language
  url.searchParams.append("ayanamsa", "1"); // 1 = Lahiri

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (!isRetry && errorText.includes("sandbox mode")) {
      return fetchProkeralaRashifal(sign, date, true);
    }
    throw new Error(`Failed to fetch rashifal for ${sign}: ${errorText}`);
  }

  const data = await response.json();
  return data.data?.daily_horoscope?.horoscope || "राशिफल उपलब्ध नहीं है।";
}

export type PanchangData = {
  tithi: string;
  nakshatra: string;
  sunrise: string;
  sunset: string;
};

export async function getDailyPanchang(isRetry = false): Promise<PanchangData | null> {
  try {
    const token = await getProkeralaToken();
    const datetime = isRetry ? "2026-01-01T00:00:00Z" : new Date().toISOString();
    
    // Coordinates for Indore
    const coordinates = "22.7196,75.8577";

    const url = new URL("https://api.prokerala.com/v2/astrology/panchang");
    url.searchParams.append("datetime", datetime);
    url.searchParams.append("coordinates", coordinates);
    url.searchParams.append("la", "hi");
    url.searchParams.append("ayanamsa", "1");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 21600 }, // Cache for 6 hours
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (!isRetry && errorText.includes("sandbox mode")) {
        return getDailyPanchang(true);
      }
      console.error("Prokerala Panchang API error", errorText);
      return null;
    }

    const json = await response.json();
    const data = json.data;

    const tithi = data?.panchang?.tithi?.[0]?.name ?? "उपलब्ध नहीं";
    const nakshatra = data?.panchang?.nakshatra?.[0]?.name ?? "उपलब्ध नहीं";
    
    const formatTime = (isoString: string) => {
      if (!isoString) return "";
      return new Date(isoString).toLocaleTimeString("hi-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      });
    };

    const sunrise = formatTime(data?.panchang?.sunrise);
    const sunset = formatTime(data?.panchang?.sunset);

    return {
      tithi,
      nakshatra,
      sunrise,
      sunset,
    };
  } catch (error) {
    console.error("Failed to fetch Panchang:", error);
    return null;
  }
}
