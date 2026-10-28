// ISR — static prose, no live data. See the note on the homepage.
export const revalidate = 3600;
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "कुकी नीति",
  description:
    "जनशक्ति उजाला पर localStorage और कुकी का उपयोग कैसे होता है, और उन्हें कैसे साफ़ या ब्लॉक करें।",
  alternates: { canonical: `${siteConfig.url}/cookie-niti` },
};

const grievanceEmail = siteConfig.publisher.grievanceEmail || siteConfig.contactEmail;

// ponytail: truthful to what's actually in the code — public site has no cookies at
// all (localStorage only); Supabase auth cookies exist only on the staff-only
// /newsroom path. No third-party embeds (YouTube etc.) exist anywhere in the
// codebase — the ePaper viewer iframe points at our own Supabase storage PDF, not a
// third party — so nothing is claimed about them.
export default function CookiePolicyPage() {
  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">कुकी नीति</h1>
      <div className="max-w-2xl space-y-6 text-sm leading-relaxed text-text">
        <p className="text-xs text-muted">अंतिम अद्यतन: 26 अक्टूबर 2026</p>

        <p>
          {siteConfig.name} का सार्वजनिक वेबसाइट भाग (जो आप सामान्यतः पढ़ते
          हैं) केवल Google Analytics की कुकी का उपयोग करता है (नीचे देखें)। कुछ
          प्राथमिकताएं आपके ब्राउज़र के <strong>localStorage</strong> में
          संग्रहित होती हैं — यह कुकी नहीं है और न ही हमारे सर्वर तक भेजी
          जाती है, केवल आपके डिवाइस पर रहती है।
        </p>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            localStorage में क्या रखा जाता है
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>पढ़ने का फ़ॉन्ट आकार (reader font-size)</li>
            <li>सहेजे गए/बुकमार्क किए गए लेख</li>
            <li>किसी पोल में आपका वोट, दोबारा वोट रोकने के लिए</li>
          </ul>
          <p>
            यह जानकारी केवल आपके ब्राउज़र में रहती है और किसी तीसरे पक्ष के
            साथ साझा नहीं होती।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            कुकी — केवल /newsroom (स्टाफ़) के लिए
          </h2>
          <p>
            Google Analytics के अलावा सामान्य पाठकों के लिए कोई कुकी सेट नहीं होती। हमारे
            संपादकीय स्टाफ़ के लॉगिन पेज (/newsroom) पर Supabase Auth का एक
            सत्र कुकी सेट होता है, ताकि स्टाफ़ लॉग-इन बना रहे। यह कुकी केवल
            लॉगिन किए हुए स्टाफ़ सदस्यों के लिए है, सामान्य पाठकों पर लागू
            नहीं होती।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            Google Analytics
          </h2>
          <p>
            यह समझने के लिए कि कितने पाठक आते हैं और कौन-से लेख पढ़े जाते हैं,
            हम Google Analytics का उपयोग करते हैं। यह आपके ब्राउज़र में _ga
            नाम की कुकी सेट करता है और पेज-विज़िट, डिवाइस व अनुमानित स्थान
            जैसी जानकारी Google को भेजता है। हम कोई विज्ञापन-ट्रैकिंग कुकी या
            सोशल मीडिया ट्रैकिंग पिक्सेल उपयोग नहीं करते। Google Analytics से
            बाहर रहने के लिए Google का ऑप्ट-आउट ब्राउज़र ऐड-ऑन
            (tools.google.com/dlpage/gaoptout) या ब्राउज़र में कुकी ब्लॉक
            करें।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            कैसे साफ़ या ब्लॉक करें
          </h2>
          <p>
            आप अपने ब्राउज़र की सेटिंग्स से localStorage और कुकी किसी भी समय
            साफ़ कर सकते हैं (आमतौर पर &quot;सेटिंग्स → गोपनीयता → ब्राउज़िंग
            डेटा साफ़ करें&quot; के अंतर्गत)। localStorage साफ़ करने पर आपका
            फ़ॉन्ट आकार और बुकमार्क डिफ़ॉल्ट पर लौट आएंगे।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">संपर्क</h2>
          <p>
            इस नीति से जुड़े किसी भी सवाल के लिए:{" "}
            <a
              href={`mailto:${grievanceEmail}`}
              className="font-semibold text-primary"
            >
              {grievanceEmail}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
