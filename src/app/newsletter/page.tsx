export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { NewsletterForm } from "@/components/news/NewsletterForm";

export const metadata: Metadata = {
  title: "न्यूज़लेटर",
};

export default function NewsletterPage() {
  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">न्यूज़लेटर सब्सक्राइब करें</h1>
      <div className="max-w-sm bg-surface p-5">
        <p className="text-sm text-muted">
          रोज़ की मुख्य खबरें सीधे आपके ईमेल पर पाएं — कोई स्पैम नहीं।
        </p>
        <div className="mt-3">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
