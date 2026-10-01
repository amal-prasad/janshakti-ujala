// ISR — static prose, no live data. See the note on the homepage.
export const revalidate = 3600;
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "नियम एवं शर्तें",
  description:
    "जनशक्ति उजाला वेबसाइट और सेवाओं के उपयोग की शर्तें — बौद्धिक संपदा, उपयोगकर्ता आचरण, सामग्री अस्वीकरण और शिकायत निवारण तंत्र।",
  alternates: { canonical: `${siteConfig.url}/niyam-evam-sharten` },
};

const p = siteConfig.publisher;
const grievanceEmail = p.grievanceEmail || siteConfig.contactEmail;
const siteHost = siteConfig.url.replace(/^https?:\/\//, "");
const officeAddress = p.postalCode
  ? `${p.addressLine} - ${p.postalCode}`
  : p.addressLine;

export default function TermsPage() {
  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">नियम एवं शर्तें</h1>
      <div className="max-w-2xl space-y-6 text-sm leading-relaxed text-text">
        <p className="text-xs text-muted">अंतिम अद्यतन: 1 अक्टूबर 2026</p>

        <p>
          &apos;{siteConfig.name}&apos; (वेबसाइट: {siteHost}, साप्ताहिक समाचार
          पत्र एवं संबंधित सोशल मीडिया प्लेटफॉर्म्स) में आपका स्वागत है।
          हमारी वेबसाइट, डिजिटल सेवाओं और सामग्री का उपयोग करने से पहले कृपया
          इन नियमों और शर्तों को ध्यानपूर्वक पढ़ें।
        </p>
        <p>
          इस वेबसाइट का उपयोग करके, आप इन नियमों और शर्तों से पूरी तरह सहमत
          होते हैं। यदि आप इनमें से किसी भी शर्त से असहमत हैं, तो कृपया हमारी
          वेबसाइट एवं सेवाओं का उपयोग न करें।
        </p>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            1. स्वीकृति एवं पात्रता
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              यह वेबसाइट &apos;{siteConfig.name}&apos; (मुख्यालय: {p.city},{" "}
              {p.state}) द्वारा संचालित है।
            </li>
            <li>
              यह नियम एवं शर्तें सभी पाठकों, उपयोगकर्ताओं और अंशदाताओं
              (Contributors) पर लागू होती हैं।
            </li>
            <li>
              समय-समय पर इन नियमों में बदलाव किए जा सकते हैं। संशोधित नियमों
              को वेबसाइट पर पोस्ट किए जाने के बाद से ही वे प्रभावी माने
              जाएंगे।
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            2. बौद्धिक संपदा अधिकार एवं कॉपीराइट
          </h2>
          <p>
            वेबसाइट पर प्रकाशित सभी सामग्री — जिसमें समाचार लेख, विश्लेषण,
            संपादकीय, फोटो, वीडियो, ग्राफिक्स, लोगो, ऑडियो और लेआउट शामिल
            हैं — &apos;{siteConfig.name}&apos; की बौद्धिक संपदा हैं और
            कॉपीराइट कानूनों द्वारा सुरक्षित हैं।
          </p>
          <p>
            बिना लिखित पूर्व अनुमति के किसी भी सामग्री का व्यावसायिक उपयोग,
            पुनर्प्रकाशन, संशोधन या वितरण पूर्णतः प्रतिबंधित है।
          </p>
          <p>
            गैर-व्यावसायिक और व्यक्तिगत उपयोग के लिए आप सामग्री को साझा कर
            सकते हैं, बशर्ते स्रोत के रूप में &apos;{siteConfig.name}&apos; का
            स्पष्ट उल्लेख और संबंधित वेब पेज का सीधा लिंक दिया गया हो।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            3. उपयोगकर्ता का आचरण एवं टिप्पणियां
          </h2>
          <p>
            वेबसाइट या हमारे सोशल मीडिया हैंडल पर टिप्पणी करते समय या सामग्री
            भेजते समय, आप निम्नलिखित का उल्लंघन न करने के लिए बाध्य हैं:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              कोई भी ऐसी भाषा या सामग्री पोस्ट न करें जो अपमानजनक, अश्लील,
              भड़काऊ, घृणास्पद, या किसी धर्म, जाति, लिंग या समुदाय की
              भावनाओं को आहत करने वाली हो।
            </li>
            <li>
              भारत की संप्रभुता, अखंडता, सुरक्षा और सार्वजनिक व्यवस्था को
              खतरे में डालने वाली कोई भी गलत या भ्रामक सूचना न फैलाएं।
            </li>
            <li>
              किसी अन्य व्यक्ति या संस्था के कॉपीराइट, ट्रेडमार्क या निजता का
              उल्लंघन न करें।
            </li>
            <li>
              स्पैम, विज्ञापनों या दुर्भावनापूर्ण सॉफ़्टवेयर वाले लिंक पोस्ट
              न करें।
            </li>
          </ul>
          <p>
            नोट: &apos;{siteConfig.name}&apos; के पास बिना कोई कारण बताए
            किसी भी अनुचित टिप्पणी या उपयोगकर्ता सामग्री को हटाने और
            आवश्यकता पड़ने पर संबंधित यूज़र को ब्लॉक करने का पूर्ण अधिकार
            सुरक्षित है।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            4. सामग्री की सटीकता एवं अस्वीकरण
          </h2>
          <p>
            हम ज़मीनी हक़ीक़त से जुड़े तथ्यों और निष्पक्ष समाचारों को पूरी
            ज़िम्मेदारी से प्रस्तुत करने का प्रयास करते हैं। फिर भी, अनजाने
            में हुई किसी मानवीय त्रुटि या तीसरे पक्ष द्वारा दी गई सूचना की
            पूर्ण सटीकता की विधिक गारंटी नहीं ली जा सकती।
          </p>
          <p>
            &apos;संपादकीय&apos;, &apos;ओपिनियन&apos; या &apos;अतिथि
            स्तंभ&apos; में व्यक्त विचार लेखकों के अपने निजी विचार हैं।
            उनसे &apos;{siteConfig.name}&apos; के संपादकीय रुख का सहमत होना
            अनिवार्य नहीं है।
          </p>
          <p>
            वेबसाइट पर उपलब्ध स्वास्थ्य, वित्तीय या विधिक सुझाव केवल सामान्य
            जानकारी के उद्देश्य से हैं; इन्हें पेशेवर सलाह का विकल्प न माना
            जाए।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            5. डिजिटल मीडिया आचार संहिता एवं अनुपालन
          </h2>
          <p>
            &apos;{siteConfig.name}&apos; भारत सरकार के सूचना प्रौद्योगिकी
            (मध्यवर्ती दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम, 2021
            (IT Rules 2021) और प्रेस काउंसिल ऑफ इंडिया की पत्रकारिता आचार
            संहिता का पूर्ण सम्मान और पालन करता है।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            6. बाहरी लिंक एवं विज्ञापन
          </h2>
          <p>
            हमारी वेबसाइट पर अन्य वेबसाइटों के लिंक या विज्ञापन हो सकते हैं।
            इन तृतीय-पक्ष वेबसाइटों की सामग्री, गोपनीयता नीतियों या सेवाओं
            पर हमारा कोई नियंत्रण नहीं है।
          </p>
          <p>
            विज्ञापनों में किए गए दावों की पुष्टि पाठक अपने विवेक से करें।
            विज्ञापनों के आधार पर किए गए लेन-देन या हानि के लिए &apos;
            {siteConfig.name}&apos; उत्तरदायी नहीं होगा।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            7. प्रिंट संस्करण एवं सदस्यता
          </h2>
          <p>
            {p.city} से प्रकाशित होने वाले हमारे साप्ताहिक प्रिंट संस्करण का
            वितरण और प्रसार संबंधित स्थानीय विनियमों के अधीन है। मुद्रण
            संबंधी किसी भी त्रुटि या वितरण में देरी के संबंध में पाठक हमारे
            प्रसार/कार्यालय विभाग से संपर्क कर सकते हैं।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            8. शिकायत निवारण तंत्र
          </h2>
          <p>
            यदि आपको वेबसाइट पर प्रकाशित किसी समाचार, लेख, फ़ोटो या सामग्री
            से संबंधित कोई आपत्ति या शिकायत है, तो आप हमारे शिकायत अधिकारी
            से संपर्क कर सकते हैं:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {p.grievanceOfficer && (
              <li>शिकायत निवारण अधिकारी: {p.grievanceOfficer}</li>
            )}
            <li>पद: संपादक / विधिक परामर्शदाता</li>
            <li>
              ईमेल:{" "}
              <a
                href={`mailto:${grievanceEmail}`}
                className="font-semibold text-primary"
              >
                {grievanceEmail}
              </a>
            </li>
            {officeAddress && (
              <li>पता: {siteConfig.name} कार्यालय, {officeAddress}।</li>
            )}
            <li>
              वेबसाइट:{" "}
              <a href={siteConfig.url} className="font-semibold text-primary">
                {siteHost}
              </a>
            </li>
          </ul>
          <p>
            (शिकायत प्राप्त होने पर नियमों के अनुसार 24 से 48 घंटे के भीतर
            पावती दी जाएगी और 15 दिनों के भीतर उचित निवारण किया जाएगा।)
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">
            9. विधिक क्षेत्राधिकार
          </h2>
          <p>
            ये सभी नियम एवं शर्तें भारत के प्रचलित कानूनों के अनुसार लागू
            और व्याख्यायित होंगी। वेबसाइट या &apos;{siteConfig.name}&apos; से
            संबंधित किसी भी विवाद या कानूनी कार्यवाही का न्यायक्षेत्र केवल{" "}
            {p.city} ({p.state}) स्थित न्यायालयों के अधीन होगा।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">10. संपर्क सूत्र</h2>
          <p>नियम और शर्तों से संबंधित किसी भी सवाल के लिए आप हमसे संपर्क कर सकते हैं:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              ईमेल:{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-semibold text-primary"
              >
                {siteConfig.contactEmail}
              </a>
            </li>
            <li>
              कार्यालय: {p.city} ({p.state})
            </li>
            <li>
              वेबसाइट:{" "}
              <a href={siteConfig.url} className="font-semibold text-primary">
                {siteHost}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
