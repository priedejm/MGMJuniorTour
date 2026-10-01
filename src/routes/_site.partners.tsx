import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { PartnerRow } from "@/lib/admin.functions";
import { ExternalLink, Handshake } from "lucide-react";

export const Route = createFileRoute("/_site/partners")({
  head: () => ({
    meta: [
      { title: "Our Partners — MGM Junior Tour" },
      { name: "description", content: "Meet the brands and organizations that support the MGM Junior Tour." },
      { property: "og:title", content: "Our Partners" },
      { property: "og:description", content: "The brands and organizations behind the MGM Junior Tour." },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const { data } = useQuery({
    queryKey: ["public", "partners"],
    queryFn: () => apiGet<PartnerRow[]>("/list-partners.php"),
  });
  const partners = data ?? [];

  return (
    <>
      <section className="bg-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80 mb-3">
            Who We Work With
          </div>
          <h1 className="font-display font-black uppercase text-5xl md:text-6xl tracking-tight leading-[1.05] max-w-3xl">
            Our Partners
          </h1>
          <div className="h-1 w-24 bg-white mt-6" />
          <p className="mt-6 text-lg text-slate-300 max-w-2xl">
            The MGM Junior Tour is proud to work alongside brands and organizations that share our commitment to junior golf.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {partners.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Handshake className="size-10 mx-auto mb-4 text-slate-300" />
              Partner announcements coming soon.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
              {partners.map((p) => (
                <a
                  key={p.id}
                  href={p.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center text-center hover-lift hover:border-gold"
                >
                  <div className="h-20 w-full flex items-center justify-center mb-6">
                    {p.logo_url ? (
                      <img
                        src={p.logo_url}
                        alt={p.name}
                        className="max-h-20 max-w-full object-contain"
                      />
                    ) : (
                      <div className="font-display font-bold text-xl text-navy">
                        {p.name}
                      </div>
                    )}
                  </div>
                  {p.description && (
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {p.description}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-navy group-hover:text-gold transition-colors">
                    Visit Website <ExternalLink className="size-3.5" />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
