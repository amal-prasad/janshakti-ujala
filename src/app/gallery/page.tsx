import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getGalleries } from "@/lib/api/gallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "गैलरी",
};

export default async function GalleryPage() {
  const galleries = await getGalleries();

  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">गैलरी</h1>
      {galleries.length === 0 ? (
        <p className="text-muted">अभी कोई गैलरी उपलब्ध नहीं है।</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {galleries.map((g) => (
            <Link key={g.id} href={`/gallery/${g.slug}`} className="flex flex-col gap-2">
              <div className="relative aspect-square w-full overflow-hidden bg-surface">
                {g.cover_image_url && (
                  <Image
                    src={g.cover_image_url}
                    alt={g.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                )}
              </div>
              <h2 className="font-display text-sm font-bold leading-snug hover:text-primary">
                <span className="line-clamp-2">{g.title}</span>
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
