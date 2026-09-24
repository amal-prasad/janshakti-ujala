import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "संशोधन नीति",
  description:
    "जनशक्ति उजाला में प्रकाशित खबर में गलती कैसे बताएँ, हम शिकायत पर कितने समय में जवाब देते हैं, और सुधार किस तरह खबर पर दर्ज किया जाता है।",
  alternates: { canonical: `${siteConfig.url}/sanshodhan-niti` },
};

export default function CorrectionsPolicyPage() {
  const grievanceEmail =
    siteConfig.publisher.grievanceEmail || siteConfig.contactEmail;

  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">संशोधन नीति</h1>
      <div className="max-w-2xl space-y-6 text-sm leading-relaxed text-text">
        <p>
          खबर में गलती हो सकती है। जो संस्थान गलती मानता और सुधारता है, वही भरोसे के
          लायक है। {siteConfig.name} हर सूचित गलती की जाँच करता है और सुधार को छिपाता
          नहीं।
        </p>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">गलती कैसे बताएँ</h2>
          <p>
            ईमेल करें{" "}
            <a
              href={`mailto:${grievanceEmail}`}
              className="font-semibold text-primary"
            >
              {grievanceEmail}
            </a>{" "}
            पर, या{" "}
            <a
              href={`tel:${siteConfig.contactPhone}`}
              className="font-semibold text-primary"
            >
              {siteConfig.contactPhone}
            </a>{" "}
            पर सम्पर्क करें। कृपया खबर का लिंक, गलत वाक्य, और सही जानकारी का आधार
            साथ भेजें — इससे जाँच तेज़ होती है।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">हम क्या करते हैं</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              हर शिकायत की प्राप्ति की पुष्टि <strong>36 घंटे</strong> के भीतर की जाती है।
            </li>
            <li>
              तथ्य की जाँच के बाद निर्णय <strong>7 दिन</strong> के भीतर बताया जाता है।
            </li>
            <li>
              गलती सिद्ध होने पर खबर तुरंत ठीक की जाती है और खबर के नीचे यह दर्ज किया
              जाता है कि क्या बदला गया और कब।
            </li>
            <li>
              गंभीर तथ्यात्मक गलती की स्थिति में सुधार अलग से भी प्रकाशित किया जाता है।
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">क्या हटाया नहीं जाता</h2>
          <p>
            प्रकाशित खबर चुपचाप नहीं हटाई जाती। यदि किसी खबर को हटाना आवश्यक हो — जैसे
            कानूनी बाध्यता या किसी व्यक्ति की सुरक्षा — तो उसका कारण दर्ज किया जाता है।
            असुविधाजनक होना खबर हटाने का कारण नहीं है।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">संतुष्ट न हों तो</h2>
          <p>
            यदि हमारे उत्तर से आप सहमत नहीं हैं, तो आप भारतीय प्रेस परिषद (Press
            Council of India) में शिकायत कर सकते हैं। हमारी संपादकीय प्रक्रिया{" "}
            <Link href="/sampadakiya-niti" className="font-semibold text-primary">
              संपादकीय नीति
            </Link>{" "}
            में विस्तार से दी गई है।
          </p>
        </section>
      </div>
    </div>
  );
}
