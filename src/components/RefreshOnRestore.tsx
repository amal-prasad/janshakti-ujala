"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Next's App Router restores a cached RSC tree on back/forward without ever
// revalidating it — `experimental.staleTimes` applies to <Link> navigation
// only, not to popstate. So returning to the homepage from an article served
// whatever was cached when you left it, and a manual reload was the only way
// to see a just-published article. A news front page must never be stale.
//
// ponytail: one listener in the root layout instead of per-page logic — every
// route here is force-dynamic, so refreshing on restore is always correct.
export function RefreshOnRestore() {
  const router = useRouter();

  useEffect(() => {
    // Deferred: popstate fires before the router finishes restoring the tree,
    // and a refresh() dispatched inside that turn gets dropped.
    const refresh = () => setTimeout(() => router.refresh(), 0);
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) refresh(); // bfcache restore
    };

    window.addEventListener("popstate", refresh);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("popstate", refresh);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [router]);

  return null;
}
