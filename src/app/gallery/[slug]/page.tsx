export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getGalleryBySlug } from "@/lib/api/gallery";


type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const gallery = await getGalleryBySlug(params.slug);
  if (!gallery) return { title: "गैलरी नहीं मिली" };
  return { title: gallery.title };
}

export default async function GalleryDetailPage({ params }: Params) {
  const gallery = await getGalleryBySlug(params.slug);
  if (!gallery) notFound();

  return (
    <div className="container-x py-8">
      <h1 className="section-header mb-6">{gallery.title}</h1>
      {/* ponytail: static grid is enough for a read-only news site; add a
          lightbox only if requested. */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {gallery.images.map((img, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="relative aspect-square w-full overflow-hidden bg-surface">
              <Image
                src={img.url}
                alt={img.caption ?? gallery.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            {img.caption && <p className="text-xs text-muted">{img.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
