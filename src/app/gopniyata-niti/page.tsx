// ISR — static prose, no live data. See the note on the homepage.
export const revalidate = 3600;
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "गोपनीयता नीति",
  description:
    "जनशक्ति उजाला किस तरह की जानकारी एकत्र करता है, उसका उपयोग कैसे होता है, कहाँ संग्रहित होती है और उपयोगकर्ता के अधिकार क्या हैं।",
  alternates: { canonical: `${siteConfig.url}/gopniyata-niti` },
};

const grievanceEmail = siteConfig.publisher.grievanceEmail || siteConfig.contactEmail;

// ponytail: this page describes only what the code actually does — verified against
// /newsletter, /polls, /contact (mailto links, no form) and the newsroom auth path
// before writing a word of it. No analytics/ad trackers exist in the codebase, so
// none are claimed here.
export default function PrivacyPolicyPage() {
  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">गोपनीयता नीति</h1>
      <div className="max-w-2xl space-y-6 text-sm leading-relaxed text-text">
        <p className="text-xs text-muted">अंतिम अद्यतन: 1 अक्टूबर 2026</p>

        <p>
          {siteConfig.name} आपकी निजता का सम्मान करता है। यह नीति बताती है कि
          हमारी वेबसाइट का उपयोग करते समय हम कौन-सी जानकारी एकत्र करते हैं,
          उसका उपयोग कैसे करते हैं, और उसे कैसे सुरक्षित रखते हैं। यह नीति
          भारत के डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (DPDP Act, 2023)
          के अनुरूप है।
        </p>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">हम क्या एकत्र करते हैं</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>न्यूज़लेटर सदस्यता:</strong> केवल आपका ईमेल पता, जब आप{" "}
              <Link href="/newsletter" className="font-semibold text-primary">
                न्यूज़लेटर
              </Link>{" "}
              सब्सक्राइब करते हैं।
            </li>
            <li>
              <strong>पोल/सर्वे में वोट:</strong> आपका चुना हुआ विकल्प संग्रहित
              होता है। वोट को आपसे जोड़ने वाली कोई पहचान (नाम, ईमेल, आईपी)
              सर्वर पर नहीं रखी जाती — दोबारा वोट रोकने की जाँच आपके ब्राउज़र
              में ही (localStorage में) होती है।
            </li>
            <li>
              <strong>संपर्क करें:</strong>{" "}
              <Link href="/contact" className="font-semibold text-primary">
                /contact
              </Link>{" "}
              पेज पर कोई फ़ॉर्म नहीं है — वहाँ दिए गए ईमेल/फ़ोन लिंक सीधे
              आपके स्वयं के मेल/डायलर ऐप में खुलते हैं, इसलिए उस पेज के
              ज़रिए हमारे सर्वर पर कोई जानकारी दर्ज नहीं होती।
            </li>
            <li>
              <strong>/newsroom (स्टाफ़ लॉगिन):</strong> केवल हमारे संपादकीय
              स्टाफ़ के लिए — Supabase Auth से ईमेल/पासवर्ड लॉगिन, जो एक
              सुरक्षित सत्र कुकी सेट करता है। यह सार्वजनिक पाठकों पर लागू
              नहीं होता।
            </li>
          </ul>
          <p>
            हम कोई विज्ञापन-ट्रैकर, तीसरे-पक्ष एनालिटिक्स (जैसे Google
            Analytics) या कुकी-आधारित ट्रैकिंग स्क्रिप्ट उपयोग नहीं करते। हमारी
            साइट पर रीडिंग थीम, फ़ॉन्ट आकार और बुकमार्क जैसी प्राथमिकताएं
            केवल आपके ब्राउज़र के localStorage में, आपके डिवाइस पर ही संग्रहित
            होती हैं — वे हमारे सर्वर तक नहीं भेजी जातीं। विवरण हमारी{" "}
            <Link href="/cookie-niti" className="font-semibold text-primary">
              कुकी नीति
            </Link>{" "}
            में है।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            हम इसका उपयोग क्यों करते हैं
          </h2>
          <p>
            ईमेल पता केवल न्यूज़लेटर भेजने के लिए उपयोग होता है। पोल के परिणाम
            सामूहिक रूप से (कुल गिनती के रूप में) वेबसाइट पर दिखाए जाते हैं।
            इनमें से किसी भी जानकारी का उपयोग विज्ञापन लक्ष्यीकरण (targeted
            advertising) के लिए नहीं किया जाता।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            संग्रहण और सुरक्षा
          </h2>
          <p>
            डेटा Supabase (डेटाबेस) और Vercel (होस्टिंग) की सेवाओं पर
            संग्रहित होता है, जो उद्योग-मानक सुरक्षा उपाय अपनाते हैं। एक्सेस
            पहुँच (Row Level Security) केवल अधिकृत स्टाफ़ तक सीमित है।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            साझाकरण — हम डेटा नहीं बेचते
          </h2>
          <p>
            हम आपकी व्यक्तिगत जानकारी किसी तीसरे पक्ष को न तो बेचते हैं और न
            ही विज्ञापन के उद्देश्य से साझा करते हैं। जानकारी केवल कानूनी
            बाध्यता होने पर ही सक्षम प्राधिकारी के साथ साझा की जा सकती है।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">प्रतिधारण (Retention)</h2>
          <p>
            न्यूज़लेटर ईमेल तब तक रखा जाता है जब तक आप सदस्यता समाप्त करने का
            अनुरोध नहीं करते। पोल वोट बेनाम होने के कारण अनिश्चित काल तक
            सांख्यिकीय रूप में रखे जा सकते हैं।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            आपके अधिकार
          </h2>
          <p>
            आप अपनी जानकारी देखने, उसमें सुधार कराने, या उसे हटवाने का
            अनुरोध कर सकते हैं — जैसे न्यूज़लेटर से नाम हटाना। ऐसे किसी भी
            अनुरोध के लिए नीचे दिए गए ईमेल पर संपर्क करें।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">बच्चों की निजता</h2>
          <p>
            यह वेबसाइट सामान्य समाचार पाठकों के लिए है और जानबूझकर 18 वर्ष से
            कम आयु के बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करती।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">नीति में बदलाव</h2>
          <p>
            इस गोपनीयता नीति को समय-समय पर अद्यतन किया जा सकता है। किसी भी
            बदलाव के बाद नई तारीख इस पेज पर दर्ज की जाएगी।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">संपर्क</h2>
          <p>
            गोपनीयता संबंधी किसी भी प्रश्न या शिकायत के लिए:{" "}
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
