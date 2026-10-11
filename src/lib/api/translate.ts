// One Gemini call translates the whole batch to Hindi (free-tier Flash-Lite,
// 1 request/day). Throws on any quota/shape/script problem so the cron rejects
// the batch instead of publishing English or garbled text.
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

export async function translateToHindi(texts: string[]): Promise<string[]> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is missing");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "Translate each daily horoscope below into natural Hindi (Devanagari). " +
                  "Keep meaning and tone; do not add or remove advice. " +
                  `Return a JSON array of exactly ${texts.length} strings in the same order.\n\n` +
                  JSON.stringify(texts),
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);

  const data = await res.json();
  const out = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "null");
  if (
    !Array.isArray(out) ||
    out.length !== texts.length ||
    out.some((t) => typeof t !== "string" || t.trim().length < 20 || !/[ऀ-ॿ]/.test(t))
  ) {
    throw new Error("Gemini returned a malformed or non-Hindi translation");
  }
  return out.map((t) => t.trim());
}
