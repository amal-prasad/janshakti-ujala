import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "वेबसाइट निर्माणाधीन",
  description: "जनशक्ति उजाला की वेबसाइट अभी निर्माणाधीन है।",
  robots: { index: false, follow: false },
};

export default function UnderConstructionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <Image src="/logo.png" alt={siteConfig.name} width={220} height={80} priority />

      <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[color:var(--primary)]">
        वेबसाइट निर्माणाधीन है
      </h1>

      <p className="max-w-md text-base leading-relaxed opacity-80">
        हम अपनी वेबसाइट पर काम कर रहे हैं। जल्द ही नए रूप में आपकी सेवा में
        उपस्थित होंगे। असुविधा के लिए खेद है।
      </p>

      <p className="text-sm opacity-70">
        संपर्क:{" "}
        <a className="underline" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>{" "}
        · {siteConfig.contactPhone}
      </p>
    </div>
  );
}
