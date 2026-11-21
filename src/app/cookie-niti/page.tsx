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

// Keep this description aligned with analytics, reader preferences and embeds.
export default function CookiePolicyPage() {
  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">कुकी नीति</h1>
      <div className="max-w-2xl space-y-6 text-sm leading-relaxed text-text">
        <p className="text-xs text-muted">अंतिम अद्यतन: 21 नवंबर 2026</p>

        <p>
          {siteConfig.name} का सार्वजनिक वेबसाइट भाग (जो आप सामान्यतः पढ़ते
          हैं) Google Analytics और लेखों में शामिल सोशल मीडिया पोस्ट के माध्यम से कुकी का उपयोग कर सकता है (नीचे देखें)। कुछ
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
            स्टाफ़ लॉगिन की कुकी
          </h2>
          <p>
            हमारे संपादकीय स्टाफ़ के लॉगिन पेज (/newsroom) पर Supabase Auth का एक
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
            सोशल मीडिया पोस्ट और वीडियो
          </h2>
          <p>
            लेखों में Instagram, X/Twitter और YouTube की पोस्ट या वीडियो शामिल हो सकते हैं।
            इनके लोड होने पर आपका ब्राउज़र संबंधित प्लेटफ़ॉर्म से जुड़ता है। वह प्लेटफ़ॉर्म
            अपने नियमों के अनुसार IP पता, ब्राउज़र संबंधी जानकारी और कुकी का उपयोग कर सकता है।
            YouTube वीडियो के लिए हम privacy-enhanced मोड उपयोग करते हैं।
            आप ब्राउज़र में तीसरे पक्ष की कुकी या सामग्री ब्लॉक कर सकते हैं; ऐसी स्थिति में
            पोस्ट यहाँ न दिखे तो उसके नीचे दिए गए मूल पोस्ट के लिंक से खोल सकते हैं।
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
