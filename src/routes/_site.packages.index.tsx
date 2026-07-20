import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { mockPackages } from "@/data/mockPackages";
import { SectionHeading } from "@/components/site/SectionHeading";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { PackageRow } from "@/lib/admin.functions";

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
      const fallbackImg = (slug: string) =>
        mockPackages.find((m) => m.slug === slug)?.image ?? mockPackages[0].image;
      return rows.map((p) => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        callout: p.callout,
        image: p.image_url || fallbackImg(p.slug),
        features: p.features,
        featured: p.featured,
      }));
    },
  });
  const packages =
    data && data.length > 0
      ? data
      : mockPackages.map((p) => ({
          slug: p.slug,
          name: p.name,
          price: p.price,
          callout: p.callout,
          image: p.image,
          features: p.features,
          featured: p.featured,
        }));
  return (
    <>
      <section className="bg-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
            Membership Packages
          </div>
          <h1 className="font-display font-black uppercase text-5xl md:text-6xl tracking-tight leading-[1.05] max-w-3xl">
            Total Junior Golf Packages
          </h1>
          <div className="h-1 w-24 bg-gold mt-6" />
          <p className="mt-6 text-lg text-slate-300 max-w-2xl">
            Every MGM Junior Tour package is designed to grow with your golfer. Pick the tier that matches your competitive goals.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {packages.map((p) => (
              <div
                key={p.slug}
                className={cn(
                  "bg-white border rounded-xl overflow-hidden flex flex-col hover-lift",
                  p.featured
                    ? "border-navy border-2 shadow-xl lg:-translate-y-4"
                    : "border-slate-200 shadow-sm hover:shadow-lg",
                )}
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden group">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest mb-2",
                      p.featured ? "text-navy" : "text-gold",
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
                  <ul className="space-y-2.5 text-sm text-slate-600 border-t border-slate-100 pt-5 mb-6 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="size-4 text-gold shrink-0 mt-0.5" strokeWidth={3} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/packages/$slug"
                    params={{ slug: p.slug }}
                    className={cn(
                      "block text-center py-3 rounded font-bold text-sm uppercase tracking-wider transition-colors",
                      p.featured
                        ? "bg-navy text-white hover:bg-navy-light"
                        : "bg-slate-100 text-navy hover:bg-navy hover:text-white",
                    )}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-3xl mx-auto text-center">
            <p className="text-slate-600">
              Have questions about which package fits your junior golfer? Reach out any time — we're happy to help you choose the right tier for the season ahead.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}