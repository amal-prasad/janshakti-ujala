import { getAd, type AdSlotName } from "@/lib/api/ads";

// TODO: AdSense branch goes here after approval (fallback when no house ad is active).
export async function AdSlot({ slot }: { slot: AdSlotName }) {
  const ad = await getAd(slot);

  if (!ad) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <div className="flex h-24 items-center justify-center border border-dashed border-border text-xs text-muted">
          विज्ञापन स्थान — {slot}
        </div>
      );
    }
    return null;
  }

  return (
    <div>
      <span className="text-[10px] uppercase tracking-wider text-muted">विज्ञापन</span>
      <a href={ad.link_url} target="_blank" rel="noopener noreferrer sponsored">
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external ad domains, plain img keeps it simple */}
        <img src={ad.image_url} alt={ad.alt_text} className="w-full border border-border" loading="lazy" />
      </a>
    </div>
  );
}
