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
    // Sandbox plans only serve a fixed demo date. Retrying against 2026-01-01 and
    // storing the result as TODAY's horoscope publishes content for the wrong day,
    // so that path is now opt-in and must never be enabled in production
    // (SEO audit, issue F32).
    if (!isRetry && errorText.includes("sandbox mode")) {
      if (process.env.PROKERALA_SANDBOX !== "1") {
        throw new Error(
          `Prokerala account is in sandbox mode; refusing to publish demo-dated ` +
            `rashifal as today's. Upgrade the plan, or set PROKERALA_SANDBOX=1 ` +
            `in a non-production environment to accept demo data.`,
        );
      }
      return fetchProkeralaRashifal(sign, date, true);
    }
    throw new Error(`Failed to fetch rashifal for ${sign}: ${errorText}`);
  }

  const data = await response.json();
  const horoscope = data.data?.daily_horoscope?.horoscope;
  // An empty response used to fall through to a placeholder string, which the cron
  // then published as that sign's prediction. Throw instead: the cron rejects the
  // whole batch rather than shipping "राशिफल उपलब्ध नहीं है।" as editorial content.
  if (typeof horoscope !== "string" || horoscope.trim().length < 20) {
    throw new Error(`Empty or too-short rashifal for ${sign}`);
  }
  return horoscope;
}

