import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "संपादकीय नीति",
  description:
    "जनशक्ति उजाला की संपादकीय नीति — खबर कैसे चुनी, जाँची और प्रकाशित की जाती है, स्रोतों का उपयोग, विज्ञापन और संपादकीय सामग्री का अलगाव, और हितों के टकराव पर हमारा रुख।",
  alternates: { canonical: `${siteConfig.url}/sampadakiya-niti` },
};

// ponytail: static prose — no DB, no props. These are commitments about process,
// which we can state truthfully; identity facts (who the editor is, the address)
// live in siteConfig.publisher and are rendered on /prakashak, not invented here.
export default function EditorialPolicyPage() {
  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">संपादकीय नीति</h1>
      <div className="max-w-2xl space-y-6 text-sm leading-relaxed text-text">
        <p>
          {siteConfig.name} का एक ही मापदंड है — पाठक तक वही पहुँचे जो सत्यापित हो।
          यह पृष्ठ बताता है कि हमारी खबर किन नियमों से बनती है, ताकि आप हमारी
          रिपोर्टिंग को परख सकें।
        </p>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">खबर का चयन</h2>
          <p>
            हम उन खबरों को प्राथमिकता देते हैं जो इंदौर और मध्य प्रदेश के पाठकों के
            रोज़मर्रा के जीवन पर सीधा असर डालती हैं — नागरिक सुविधाएँ, प्रशासन, शिक्षा,
            स्वास्थ्य, रोज़गार, खेल और स्थानीय संस्कृति। खबर का चयन उसके जनहित से तय
            होता है, किसी विज्ञापनदाता, राजनीतिक दल या संस्था के दबाव से नहीं।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">सत्यापन और स्रोत</h2>
          <p>
            कोई भी तथ्यात्मक दावा प्रकाशित होने से पहले कम से कम एक प्रत्यक्ष स्रोत से
            पुष्ट किया जाता है। विवादित या गंभीर आरोप वाली खबरों में हम दो स्वतंत्र
            स्रोतों पर ज़ोर देते हैं और संबंधित पक्ष को अपना पक्ष रखने का अवसर देते हैं।
            जहाँ स्रोत का नाम सार्वजनिक नहीं किया जा सकता, वहाँ खबर में यह स्पष्ट लिखा
            जाता है कि जानकारी किस प्रकार के स्रोत से आई है।
          </p>
          <p>
            हम किसी अन्य समाचार संस्थान की खबर का मूल पाठ अपनी वेबसाइट पर प्रकाशित
            नहीं करते। किसी रिपोर्ट का उल्लेख करने पर मूल संस्थान का नाम दिया जाता है।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">बायलाइन और डेटलाइन</h2>
          <p>
            हर खबर पर उसे लिखने वाले संवाददाता का नाम और वह शहर दर्ज होता है जहाँ से
            खबर रिपोर्ट की गई। एजेंसी या प्रेस विज्ञप्ति पर आधारित सामग्री को उसी रूप
            में चिह्नित किया जाता है।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">विज्ञापन और संपादकीय सामग्री</h2>
          <p>
            विज्ञापन और प्रायोजित सामग्री को खबर से अलग और स्पष्ट रूप से चिह्नित किया
            जाता है। कोई विज्ञापनदाता यह तय नहीं करता कि कौन-सी खबर छपेगी या नहीं छपेगी।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">हितों का टकराव</h2>
          <p>
            यदि किसी खबर से हमारे संपादकीय सदस्य या प्रकाशक का कोई व्यक्तिगत या
            व्यावसायिक हित जुड़ा है, तो यह खबर के भीतर ही घोषित किया जाता है।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">कृत्रिम बुद्धिमत्ता (AI)</h2>
          <p>
            हमारी खबरें मनुष्य लिखते हैं। किसी समाचार का मूल पाठ AI से नहीं लिखवाया
            जाता। दैनिक राशिफल और पंचांग जैसी नियमित सामग्री स्वचालित रूप से तैयार होती
            है और उसे उसी रूप में प्रस्तुत किया जाता है — वह समाचार रिपोर्टिंग नहीं है।
          </p>
        </section>

        <p>
          गलती होने पर हम उसे सुधारते हैं और सुधार को दर्ज करते हैं — देखें{" "}
          <Link href="/sanshodhan-niti" className="font-semibold text-primary">
            संशोधन नीति
          </Link>
          । प्रकाशक और स्वामित्व की जानकारी{" "}
          <Link href="/prakashak" className="font-semibold text-primary">
            यहाँ
          </Link>{" "}
          उपलब्ध है।
        </p>
      </div>
    </div>
  );
}
