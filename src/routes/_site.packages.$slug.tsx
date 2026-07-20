import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Gift, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { mockPackages } from "@/data/mockPackages";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { PackageRow } from "@/lib/admin.functions";
import { parsePrice, useCart } from "@/lib/cart";

export const Route = createFileRoute("/_site/packages/$slug")({
  head: ({ params }) => {
    const pkg = mockPackages.find((p) => p.slug === params.slug);
    if (!pkg) {
      return {
        meta: [
          { title: "Package Not Found — MGM Junior Tour" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `${pkg.name} — MGM Junior Tour` },
        { name: "description", content: pkg.description },
        { property: "og:title", content: `${pkg.name} — MGM Junior Tour` },
        { property: "og:description", content: pkg.description },
        { property: "og:image", content: pkg.image },
      ],
    };
  },
  loader: ({ params }) => {
    const pkg = mockPackages.find((p) => p.slug === params.slug);
    if (!pkg) throw notFound();
    return { pkg };
  },
  notFoundComponent: PackageNotFound,
  component: PackageDetailPage,
});

function PackageNotFound() {
  return (
    <section className="py-24 text-center">
      <h1 className="font-display font-black uppercase text-3xl text-navy mb-4">
        Package Not Found
      </h1>
      <Link to="/packages" className="text-gold font-bold uppercase tracking-widest text-sm">
        Back to Packages
      </Link>
    </section>
  );
}

function PackageDetailPage() {
  const { pkg: fallback } = Route.useLoaderData();
  const { addItem } = useCart();
  const { data } = useQuery({
    queryKey: ["public", "packages", fallback.slug],
    queryFn: async () => {
      const rows = await apiGet<PackageRow[]>("/list-packages.php");
      const data = rows.find((p) => p.slug === fallback.slug);
      if (!data) return null;
      return {
        slug: data.slug,
        name: data.name,
        price: data.price,
        callout: data.callout,
        image: data.image_url || fallback.image,
        description: data.description,
        included: data.included,
        bonuses: data.bonuses,
        totalValue: data.total_value,
        disclaimer: data.disclaimer,
        featured: data.featured,
        features: data.features,
      };
    },
  });
  const pkg = data ?? fallback;

  const handleAdd = () => {
    addItem({
      slug: pkg.slug,
      name: pkg.name,
      price: pkg.price,
      unitPrice: parsePrice(pkg.price),
      image: pkg.image,
    });
    toast.success(`${pkg.name} added to cart`);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={pkg.image}
            alt=""
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            All Packages
          </Link>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 pb-20 pt-4 grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-gold mb-4">
              {pkg.callout}
            </div>
            <h1 className="font-display font-black uppercase text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95]">
              {pkg.name}
            </h1>
            <div className="h-1 w-24 bg-gold mt-6" />
            <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
              {pkg.description}
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <div className="bg-white text-navy p-6 shadow-2xl border-l-4 border-gold">
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-1">
                Package Price
              </div>
              <div className="text-5xl font-black">{pkg.price}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gold mt-2">
                Financing Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
          {/* What's Included */}
          <div className="lg:col-span-2 bg-white shadow-sm border border-slate-200/60 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                What's Included
              </span>
              <span className="h-px flex-1 bg-gold/40" />
            </div>
            <h2 className="font-display font-black uppercase text-3xl text-navy mb-8">
              Everything In The Bag
            </h2>
            <ul className="space-y-5">
              {pkg.included.map((item: { label: string; note?: string }) => (
                <li key={item.label} className="flex items-start gap-4">
                  <span className="mt-0.5 size-6 rounded-full bg-navy text-gold grid place-items-center shrink-0">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <div className="flex-1 flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-dashed border-slate-200 pb-4">
                    <span className="font-semibold text-navy">{item.label}</span>
                    {item.note && (
                      <span className="text-sm italic text-slate-500">{item.note}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 p-5 bg-cream border-l-2 border-gold">
              <p className="text-xs uppercase tracking-wider text-navy/70 leading-relaxed">
                <span className="font-bold text-navy">*</span> Credits do not expire, ensuring they are ready for use when our nationwide expansion reaches your area in 2026.
              </p>
            </div>
          </div>

          {/* Sidebar: bonuses + value + CTA */}
          <aside className="space-y-6">
            <div className="bg-navy text-white p-8 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="size-4 text-gold" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                  You Also Receive
                </span>
              </div>
              <ul className="space-y-3">
                {pkg.bonuses.map((bonus: string) => (
                  <li key={bonus} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 size-1.5 rounded-full bg-gold shrink-0" />
                    <span className="text-slate-100">{bonus}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gold/15 border border-gold/40 p-6 text-center">
              <Sparkles className="size-5 text-gold mx-auto mb-2" />
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-navy/60 mb-1">
                Total Value
              </div>
              <div className="font-display font-black uppercase text-2xl text-navy leading-tight">
                {pkg.totalValue}
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-navy hover:bg-navy-light text-white py-5 font-bold uppercase text-sm tracking-[0.2em] transition-colors shadow-lg hover:shadow-xl"
            >
              Add To Cart · {pkg.price}
            </button>
            <Link
              to="/contact"
              className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-navy/60 hover:text-gold transition-colors"
            >
              Questions? Contact the tour →
            </Link>
          </aside>
        </div>

        {pkg.disclaimer && (
          <div className="max-w-6xl mx-auto px-6 mt-10">
            <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl">
              {pkg.disclaimer}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
