import { createFileRoute, Link } from "@tanstack/react-router";
import { ImageOff } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { PackageRow } from "@/lib/admin.functions";
import packagesHeaderImage from "@/assets/PackagesHeaderImage.jpg";

const PACKAGE_VIDEOS = [
  { id: "1", title: "Jr. Tour Club Package Explained — with Dan", src: "/videos/behind-the-scenes.mov", poster: "/videos/posters/behind-the-scenes-poster.jpg" },
  { id: "2", title: "Standard Package Explained — with Dan", src: "/videos/player-spotlights.mov", poster: "/videos/posters/player-spotlights-poster.jpg" },
  { id: "3", title: "Standard Package Explained — with Zach", src: "/videos/season-highlights.mov", poster: "/videos/posters/season-highlights-poster.jpg" },
];

export const Route = createFileRoute("/_site/packages/")({
  head: () => ({
    meta: [
      { title: "Junior Golf Packages — MGM Junior Tour" },
      { name: "description", content: "Explore MGM Junior Tour membership packages: Deluxe, Standard, Starter, and Jr. Tour Club." },
      { property: "og:title", content: "Junior Golf Packages" },
      { property: "og:description", content: "Membership tiers for junior golfers of every level." },
    ],
  }),
  component: PackagesPage,
});

function PackagesPage() {
  const { data } = useQuery({
    queryKey: ["public", "packages"],
    queryFn: async () => {
      const rows = await apiGet<PackageRow[]>("/list-packages.php");
      return rows.map((p) => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        callout: p.callout,
        image: p.image_url,
        features: p.features,
        featured: p.featured,
      }));
    },
  });
  const packages = data ?? [];
  return (
    <>
      <section className="bg-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={packagesHeaderImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/40 to-navy/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80 mb-3">
            Membership Packages
          </div>
          <h1 className="font-display font-black uppercase text-5xl md:text-6xl tracking-tight leading-[1.05] max-w-3xl">
            Total Junior Golf Packages
          </h1>
          <div className="h-1 w-24 bg-white mt-6" />
          <p className="mt-6 text-lg text-slate-300 max-w-2xl">
            Pick the package that matches your Junior golfer's developmental and competitive goals.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {packages.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              No packages configured yet — check back soon.
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {packages.map((p) => (
              <Link
                key={p.slug}
                to="/packages/$slug"
                params={{ slug: p.slug }}
                className={cn(
                  "group bg-white border rounded-xl overflow-hidden flex flex-col hover-lift",
                  p.featured
                    ? "border-navy border-2 shadow-xl lg:-translate-y-4"
                    : "border-slate-200 shadow-sm hover:shadow-lg",
                )}
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden group grid place-items-center">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <ImageOff className="size-8 text-slate-300" />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest mb-2",
                      p.featured ? "text-red" : "text-gold",
                    )}
                  >
                    {p.callout}
                  </div>
                  <h3 className="font-display font-bold text-xl text-navy mb-2">
                    {p.name}
                  </h3>
                  <div className="text-4xl font-black text-navy mb-5">
                    {p.price}
                  </div>
                  <span
                    className={cn(
                      "mt-auto block text-center py-3 rounded font-bold text-sm uppercase tracking-wider transition-colors",
                      p.featured
                        ? "bg-navy text-white group-hover:bg-navy-light"
                        : "bg-slate-100 text-navy group-hover:bg-navy group-hover:text-white",
                    )}
                  >
                    Learn More
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 max-w-3xl mx-auto text-center">
            <p className="text-slate-600">
              Have questions about which package fits your junior golfer? Reach out any time — we're happy to help you choose the right tier for the season ahead.
            </p>
          </div>

          <div className="mt-20">
            <SectionHeading
              eyebrow="See It In Action"
              title="Packages Explained"
            />
            <div className="grid md:grid-cols-3 gap-6 stagger">
              {PACKAGE_VIDEOS.map((v) => (
                <div
                  key={v.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover-lift"
                >
                  <div className="aspect-[4/3] bg-navy">
                    <video
                      src={v.src}
                      poster={v.poster}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-navy">{v.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}