export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "संपर्क करें",
};

export default function ContactPage() {
  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">संपर्क करें</h1>
      <div className="max-w-xl">
        <p className="text-muted">आपकी राय और सुझाव हमारे लिए महत्वपूर्ण हैं।</p>

        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="mt-4 block font-semibold text-primary hover:underline"
        >
          {siteConfig.contactEmail}
        </a>

        <div className="mt-6 flex gap-4 text-sm">
          <a
            href={siteConfig.social.twitter.startsWith("http") ? siteConfig.social.twitter : `https://twitter.com/${siteConfig.social.twitter.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-primary"
          >
            ट्विटर
          </a>
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-primary"
          >
            फेसबुक
          </a>
          <a
            href={siteConfig.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-primary"
          >
            यूट्यूब
          </a>
        </div>
      </div>
    </div>
  );
}
