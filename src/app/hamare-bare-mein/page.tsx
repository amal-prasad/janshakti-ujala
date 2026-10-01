// ISR — static prose, no live data. See the note on the homepage.
export const revalidate = 3600;
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "हमारे बारे में",
  description:
    "जनशक्ति उजाला — इंदौर से संचालित हिंदी साप्ताहिक समाचार पत्र और डिजिटल न्यूज़ पोर्टल। हमारा दृष्टिकोण, कवरेज और संपर्क सूत्र।",
  alternates: { canonical: `${siteConfig.url}/hamare-bare-mein` },
};

const p = siteConfig.publisher;
const siteHost = siteConfig.url.replace(/^https?:\/\//, "");

export default function AboutPage() {
  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">हमारे बारे में</h1>
      <div className="max-w-2xl space-y-6 text-sm leading-relaxed text-text">
        <p>
          {siteConfig.name} ({siteConfig.tagline}) भारत का एक विश्वसनीय डिजिटल
          समाचार पोर्टल और साप्ताहिक समाचार पत्र है। मध्य प्रदेश की व्यावसायिक
          राजधानी इंदौर से संचालित &apos;{siteConfig.name}&apos; का मुख्य उद्देश्य
          ज़मीनी हक़ीक़त को सामने लाना और आम जनता की समस्याओं, विचारों व अधिकारों
          को एक सशक्त मंच प्रदान करना है।
        </p>
        <p>
          हम ज़मीनी हक़ीक़त से जुड़े विश्वसनीय समाचारों को प्रिंट की प्रामाणिकता
          और डिजिटल पोर्टल की गति के साथ पाठकों के समक्ष प्रस्तुत करते हैं।
          डिजिटल युग में जब सूचनाओं की भरमार है, तब जनशक्ति उजाला बिना किसी
          लाग-लपेट के निष्पक्ष, तथ्यपरक और संतुलित पत्रकारिता के सिद्धांतों पर
          अडिग रहता है।
        </p>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            हमारा दृष्टिकोण एवं उद्देश्य
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>ज़मीनी हक़ीक़त:</strong> काग़ज़ी दावों से इतर ज़मीन पर
              मौजूद वास्तविक परिस्थितियों की पड़ताल और जनसरोकार से जुड़ी
              ख़बरों को प्राथमिकता देना।
            </li>
            <li>
              <strong>प्रिंट की प्रामाणिकता:</strong> इंदौर से प्रकाशित होने
              वाले हमारे साप्ताहिक समाचार पत्र के ज़रिए गंभीर विश्लेषण, खोजी
              रिपोर्ट और प्रामाणिक आलेख प्रस्तुत करना।
            </li>
            <li>
              <strong>डिजिटल गति:</strong> अपनी आधिकारिक वेबसाइट और सोशल मीडिया
              माध्यमों के ज़रिए 24x7 ताज़ा घटनाओं का त्वरित और सटीक विश्लेषण
              जन-जन तक पहुँचाना।
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">हमारा कवरेज</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>राजनीति और शासन:</strong> देश, मध्य प्रदेश और क्षेत्रीय
              राजनीतिक घटनाक्रमों का निष्पक्ष एवं तथ्यपरक विश्लेषण।
            </li>
            <li>
              <strong>जनसमस्याएं और समाज:</strong> आम नागरिकों की बुनियादी
              परेशानियां, प्रशासनिक व्यवस्था की पड़ताल और जनहित के मुद्दे।
            </li>
            <li>
              <strong>अर्थव्यवस्था और व्यापार:</strong> स्थानीय व्यापार,
              बाज़ार और रोज़गार से जुड़े ताज़ा अपडेट।
            </li>
            <li>
              <strong>शिक्षा, खेल और संस्कृति:</strong> युवा वर्ग से जुड़ी
              खबरें, खेल जगत के अहम पड़ाव और सांस्कृतिक गतिविधियों की विशेष
              कवरेज।
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            डिजिटल और मल्टीमीडिया विस्तार
          </h2>
          <p>
            वेब पोर्टल के साथ-साथ &apos;{siteConfig.name}&apos; प्रमुख सोशल
            मीडिया प्लेटफॉर्म्स पर सक्रिय है। यूट्यूब, फेसबुक, इंस्टाग्राम और X
            (पूर्व में ट्विटर) के माध्यम से हम वीडियो रिपोर्टिंग, लाइव
            अपडेट्स, त्वरित बुलेटिन और विश्लेषणात्मक सामग्री पाठकों और दर्शकों
            तक पहुंचाते हैं।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">संपर्क सूत्र</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              प्रकाशन: {siteConfig.name} (साप्ताहिक समाचार पत्र एवं डिजिटल
              न्यूज़ पोर्टल)
            </li>
            <li>
              मुख्यालय / प्रकाशन केंद्र: {p.city} ({p.state})
            </li>
            <li>
              वेबसाइट:{" "}
              <a
                href={siteConfig.url}
                className="font-semibold text-primary hover:underline"
              >
                {siteHost}
              </a>
            </li>
            <li>
              सोशल मीडिया: फेसबुक, इंस्टाग्राम, X (ट्विटर), और यूट्यूब पर
              उपलब्ध ({siteConfig.social.twitter})
            </li>
            <li>
              ईमेल:{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-semibold text-primary hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
