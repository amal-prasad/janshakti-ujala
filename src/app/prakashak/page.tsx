import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "प्रकाशक और स्वामित्व",
  description:
    "जनशक्ति उजाला का प्रकाशक कौन है, संपादकीय उत्तरदायित्व किसका है, कार्यालय का पता, शिकायत निवारण अधिकारी और पंजीकरण विवरण।",
  alternates: { canonical: `${siteConfig.url}/prakashak` },
};

const p = siteConfig.publisher;

// ponytail: empty siteConfig.publisher fields are dropped, not printed as
// placeholders. A news site inventing its own editor's name or address is a worse
// trust signal than an incomplete page.
const rows: [string, string][] = ([
  ["प्रकाशक", p.legalName],
  ["प्रधान संपादक", p.editorInChief],
  ["शिकायत निवारण अधिकारी", p.grievanceOfficer],
  ["आर.एन.आई. पंजीयन संख्या", p.rniNumber],
  ["स्थापना वर्ष", p.foundingYear],
] as [string, string][]).filter(([, v]) => v !== "");

const addressParts = [p.addressLine, p.city, p.state, p.postalCode, p.country].filter(
  (v) => v !== "",
);

export default function PublisherPage() {
  const grievanceEmail = p.grievanceEmail || siteConfig.contactEmail;

  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">प्रकाशक और स्वामित्व</h1>
      <div className="max-w-2xl space-y-6 text-sm leading-relaxed text-text">
        <p>
          {siteConfig.name} एक स्वतंत्र हिंदी समाचार मंच है। इस पृष्ठ पर यह दर्ज है कि
          इस वेबसाइट पर प्रकाशित सामग्री के लिए कौन उत्तरदायी है और उससे कैसे सम्पर्क
          किया जा सकता है।
        </p>

        {rows.length > 0 && (
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
            {rows.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="font-semibold">{label}</dt>
                <dd className="text-muted">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">सम्पर्क</h2>
          {addressParts.length > 0 && (
            <address className="not-italic text-muted">
              {addressParts.join(", ")}
            </address>
          )}
          <p>
            ईमेल:{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="font-semibold text-primary"
            >
              {siteConfig.contactEmail}
            </a>
            <br />
            दूरभाष:{" "}
            <a
              href={`tel:${siteConfig.contactPhone}`}
              className="font-semibold text-primary"
            >
              {siteConfig.contactPhone}
            </a>
            <br />
            शिकायत के लिए:{" "}
            <a
              href={`mailto:${grievanceEmail}`}
              className="font-semibold text-primary"
            >
              {grievanceEmail}
            </a>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold">वित्तीय स्वतंत्रता</h2>
          <p>
            इस मंच का संचालन विज्ञापन और पाठकों के सहयोग से होता है। किसी राजनीतिक दल
            या सरकारी संस्था का इसमें स्वामित्व नहीं है, और न ही कोई विज्ञापनदाता
            संपादकीय निर्णय में हस्तक्षेप करता है।
          </p>
        </section>

        <p>
          हमारी कार्यप्रणाली{" "}
          <Link href="/sampadakiya-niti" className="font-semibold text-primary">
            संपादकीय नीति
          </Link>{" "}
          में, और गलती सुधारने की प्रक्रिया{" "}
          <Link href="/sanshodhan-niti" className="font-semibold text-primary">
            संशोधन नीति
          </Link>{" "}
          में दर्ज है।
        </p>
      </div>
    </div>
  );
}
