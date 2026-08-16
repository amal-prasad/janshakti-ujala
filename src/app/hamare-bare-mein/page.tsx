export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "हमारे बारे में",
};

// ponytail: placeholder copy — owner has not yet supplied the real founding
// date, staff names, or history. Written to read naturally but every fact
// below is fabricated and must be swapped before launch.
export default function AboutPage() {
  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">हमारे बारे में</h1>
      <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-text">
        <p>
          {siteConfig.name} एक स्वतंत्र हिंदी समाचार मंच है, जिसकी शुरुआत आम पाठकों तक
          सही, सत्यापित और समय पर खबर पहुँचाने के उद्देश्य से हुई। हम राजनीति, समाज,
          खेल, व्यापार और मनोरंजन से जुड़ी खबरें सरल और स्पष्ट भाषा में प्रस्तुत करते हैं।
        </p>
        <p>
          हमारी संपादकीय टीम हर खबर को प्रकाशित करने से पहले तथ्यों की जाँच करती है।
          हम किसी राजनीतिक दल या संगठन से जुड़े नहीं हैं — हमारी प्राथमिकता केवल
          निष्पक्ष और भरोसेमंद पत्रकारिता है।
        </p>
        <p>
          {siteConfig.tagline} — यही सोच हमें हर दिन बेहतर खबर देने के लिए प्रेरित करती है।
        </p>
        <p>
          सुझाव, शिकायत या सुधार से जुड़ी किसी भी जानकारी के लिए हमसे{" "}
          <a href="/contact" className="font-semibold text-primary hover:underline">
            संपर्क करें
          </a>{" "}
          पृष्ठ के माध्यम से जुड़ सकते हैं।
        </p>
      </div>
    </div>
  );
}
