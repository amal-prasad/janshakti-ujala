import type { Metadata } from "next";
import Image from "next/image";
import { getAllVideos } from "@/lib/api/videos";
import { truncate } from "@/lib/utils/format";

// Reads live data per request (Supabase-backed).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "वीडियो",
  description: "जनशक्ति उजाला के सभी वीडियो एक जगह।",
};

export default async function VideoPage() {
  const videos = await getAllVideos();

  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">वीडियो</h1>
      {videos.length === 0 ? (
        <p className="text-muted">अभी कोई वीडियो उपलब्ध नहीं है।</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <a
              key={v.id}
              href={`https://youtube.com/watch?v=${v.youtube_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <span className="relative block aspect-video w-full overflow-hidden bg-surface">
                <Image
                  src={`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`}
                  alt={v.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <svg
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="white"
                  className="absolute inset-0 m-auto drop-shadow"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <p className="mt-3 font-display font-bold hover:text-primary">{v.title}</p>
              {v.description && (
                <p className="mt-1 text-sm text-muted">{truncate(v.description, 100)}</p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
