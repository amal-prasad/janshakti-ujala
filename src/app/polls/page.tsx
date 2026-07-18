import type { Metadata } from "next";
import { getActivePoll } from "@/lib/api/polls";
import { PollWidget } from "@/components/news/PollWidget";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "पोल",
};

export default async function PollsPage() {
  const active = await getActivePoll();

  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">पोल</h1>
      {active ? (
        <PollWidget poll={active.poll} options={active.options} />
      ) : (
        <p className="text-muted">अभी कोई सक्रिय पोल नहीं है।</p>
      )}
    </div>
  );
}
