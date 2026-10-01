import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { galleryVideos } from "@/data/siteContent";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { PhotoRow } from "@/lib/admin.functions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/_site/photos")({
  head: () => ({
    meta: [
      { title: "Photos & Videos — MGM Junior Tour" },
      { name: "description", content: "Photo gallery and video highlights from the MGM Junior Tour." },
      { property: "og:title", content: "Photos & Videos" },
      { property: "og:description", content: "Tournament photos and video highlights." },
    ],
  }),
  component: PhotosPage,
});

function PhotosPage() {
  const { data } = useQuery({
    queryKey: ["public", "photos"],
    queryFn: () => apiGet<PhotoRow[]>("/list-photos.php"),
  });
  const photos = (data ?? []).map((p) => ({ src: p.image_url, caption: p.caption }));
  return (
    <>
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Media"
            title="Photos & Videos"
            subtitle="Highlights, competition photos, and behind-the-scenes moments from across the season."
          />
          {photos.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              No photos uploaded yet — check back soon.
            </div>
          ) : (
            <Carousel opts={{ loop: true, align: "start" }} className="w-full">
              <CarouselContent className="-ml-4">
                {photos.map((p, i) => (
                  <CarouselItem
                    key={i}
                    className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group hover-lift hover:border-gold">
                      <img
                        src={p.src}
                        alt={p.caption || `Tournament photo ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:inline-flex -left-4" />
              <CarouselNext className="hidden md:inline-flex -right-4" />
            </Carousel>
          )}
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-6 stagger">
            {galleryVideos.map((v) => (
              <div
                key={v.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover-lift hover:border-gold"
              >
                <div className="aspect-video bg-navy">
                  <video
                    src={v.src}
                    poster={v.poster}
                    controls
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}