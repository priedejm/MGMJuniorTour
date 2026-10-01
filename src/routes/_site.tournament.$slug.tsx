import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { getTournamentBySlug, type TournamentPricingRow } from "@/data/tournamentContent";
import { CalendarDays, Clock, MapPin, Users, AlertCircle, Phone, Mail, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { TournamentRow } from "@/lib/admin.functions";
import { parsePrice, useCart } from "@/lib/cart";

type ScheduleRowSummary = { city: string; dates: string; year: number; time: string };

export const Route = createFileRoute("/_site/tournament/$slug")({
  loader: async ({ params }) => {
    const tournament = getTournamentBySlug(params.slug);
    if (tournament) return { tournament, scheduleRow: null as ScheduleRowSummary | null };

    // Not in the hand-curated content set yet — check the live tournament
    // list (admin-added events with only schedule metadata so far) so a
    // brand-new event still gets a "coming soon" page instead of a 404.
    const rows = await apiGet<TournamentRow[]>("/list-tournaments.php");
    const row = rows.find((r) => r.slug === params.slug);
    if (!row) throw notFound();
    const scheduleRow: ScheduleRowSummary = {
      city: row.city,
      dates: row.dates_label,
      year: row.year,
      time: row.tee_time,
    };
    return { tournament: null, scheduleRow };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.tournament) {
      return {
        meta: [
          { title: "Tournament — MGM Junior Tour" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const t = loaderData.tournament;
    return {
      meta: [
        { title: `${t.name} — MGM Junior Tour` },
        { name: "description", content: `${t.name} at ${t.course} in ${t.city}. ${t.dates}.` },
        { property: "og:title", content: t.name },
        { property: "og:description", content: `${t.city} at ${t.course} — ${t.dates}` },
        { property: "og:image", content: t.heroImage },
        { name: "twitter:image", content: t.heroImage },
      ],
    };
  },
  notFoundComponent: TournamentNotFound,
  component: TournamentDetail,
});

function TournamentNotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center px-6">
      <div className="text-center">
        <h1 className="font-display font-black uppercase text-4xl text-navy mb-4">
          Tournament Not Found
        </h1>
        <p className="text-slate-600 mb-8">
          We couldn't find that tournament. It may have been rescheduled.
        </p>
        <Link
          to="/schedule"
          className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded font-bold uppercase text-sm tracking-wider hover:bg-navy-light"
        >
          <ArrowLeft className="size-4" /> View Full Schedule
        </Link>
      </div>
    </div>
  );
}

function TournamentDetail() {
  const { tournament, scheduleRow } = Route.useLoaderData();
  const { addItem } = useCart();
  const [periodIndex, setPeriodIndex] = useState(0);
  const [priceType, setPriceType] = useState<"memberPrice" | "nonMemberPrice">("memberPrice");

  const { data: livePricing } = useQuery({
    queryKey: ["public", "tournament-pricing", tournament?.slug ?? ""],
    queryFn: async () => {
      const rows = await apiGet<TournamentRow[]>("/list-tournaments.php");
      const row = rows.find((r) => r.slug === tournament?.slug);
      return row?.pricing?.length ? row.pricing : null;
    },
    enabled: !!tournament,
  });

  if (!tournament && scheduleRow) {
    return (
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
            Coming Soon
          </div>
          <h1 className="font-display font-black uppercase text-4xl md:text-5xl text-navy mb-4">
            {scheduleRow.city}
          </h1>
          <p className="text-slate-600 text-lg mb-8">
            Full details for this event are being finalized. Check back soon for course confirmation, tee times, and registration.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-left space-y-3">
            <div className="flex items-center gap-3">
              <CalendarDays className="size-5 text-gold" />
              <span className="font-medium text-navy">{scheduleRow.dates}, {scheduleRow.year}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-gold" />
              <span className="text-slate-700">{scheduleRow.city}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-5 text-gold" />
              <span className="text-slate-700">Tee time: {scheduleRow.time}</span>
            </div>
          </div>
          <div className="mt-10">
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 text-navy font-bold uppercase text-sm tracking-wider hover:text-gold"
            >
              <ArrowLeft className="size-4" /> Back to Schedule
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!tournament) return null;
  const t = tournament;
  const pricing = livePricing ?? [];
  const selectedRow = pricing[Math.min(periodIndex, pricing.length - 1)];
  const displayPrice = selectedRow?.[priceType];

  const handleAddToCart = () => {
    if (!selectedRow || !displayPrice) return;
    const safeIndex = pricing.indexOf(selectedRow);
    addItem({
      slug: `${t.slug}-${priceType}-${safeIndex}`,
      type: "tournament",
      tournamentSlug: t.slug,
      periodIndex: safeIndex,
      priceType,
      name: `${t.name} — ${selectedRow.period} (${priceType === "memberPrice" ? "Member / First-Time" : "Non-Member / Returning"})`,
      price: displayPrice,
      unitPrice: parsePrice(displayPrice),
      image: t.heroImage,
    });
    toast.success(`${t.name} entry added to cart`);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <img
          src={t.heroImage}
          alt={t.course}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 w-full text-white">
          <Link
            to="/schedule"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium uppercase tracking-wider mb-6"
          >
            <ArrowLeft className="size-4" /> All Tournaments
          </Link>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-3">
            Registration Open
          </div>
          <h1 className="font-display font-black uppercase text-4xl md:text-6xl tracking-tight leading-[1.05] max-w-3xl">
            {t.name}
          </h1>
          <p className="mt-4 text-xl text-slate-200">
            {t.city} at <span className="text-white font-semibold">{t.course}</span>
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-display font-black uppercase text-2xl text-navy mb-4">
                About This Event
              </h2>
              <p className="text-slate-700 leading-relaxed text-lg">
                {t.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <InfoBlock
                icon={CalendarDays}
                title="Tournament Dates"
                lines={[t.dates, t.teeTime]}
              />
              <InfoBlock
                icon={AlertCircle}
                title="Early Registration Deadline"
                lines={[t.earlyDeadline, "Save on entry fees"]}
              />
              <InfoBlock
                icon={Users}
                title="Eligibility"
                lines={[t.eligibility.boys, t.eligibility.girls, t.eligibility.notes]}
              />
              <InfoBlock
                icon={MapPin}
                title="Location"
                lines={[t.course, t.address]}
              />
            </div>

            {/* Pricing */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-navy text-white px-6 py-5">
                <h3 className="font-display font-bold uppercase text-lg tracking-tight">
                  Tournament Pricing
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Registration Period</th>
                      <th className="px-6 py-4 font-semibold text-right">Members / First-Time</th>
                      <th className="px-6 py-4 font-semibold text-right">Non-Members / Returning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pricing.map((row: TournamentPricingRow) => (
                      <tr key={row.period}>
                        <td className="px-6 py-5 text-slate-700 font-medium">
                          {row.period}
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-navy">
                          {row.memberPrice}
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-navy">
                          {row.nonMemberPrice}
                        </td>
                      </tr>
                    ))}
                    {pricing.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                          Pricing coming soon — contact us below for details.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-slate-600 text-sm">
              For more information or to sign up contact us at{" "}
              <a href={`tel:${t.contactPhone}`} className="text-navy font-bold hover:text-gold">
                {t.contactPhone}
              </a>{" "}
              or{" "}
              <a href={`mailto:${t.contactEmail}`} className="text-navy font-bold hover:text-gold">
                {t.contactEmail}
              </a>{" "}
              while spots are still available!
            </div>
          </div>

          {/* Sidebar CTA */}
          <aside className="lg:col-span-1">
            <div className="bg-navy text-white p-8 rounded-xl sticky top-24">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-3">
                Register Now
              </div>

              {pricing.length > 0 && selectedRow ? (
                <>
                  <div className="space-y-3 mb-5">
                    <label className="block">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">
                        Registration Period
                      </span>
                      <select
                        value={pricing.indexOf(selectedRow)}
                        onChange={(e) => setPeriodIndex(Number(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                      >
                        {pricing.map((row, i) => (
                          <option key={row.period} value={i} className="text-navy">
                            {row.period}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">
                        Rate
                      </span>
                      <select
                        value={priceType}
                        onChange={(e) => setPriceType(e.target.value as "memberPrice" | "nonMemberPrice")}
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                      >
                        <option value="memberPrice" className="text-navy">Member / First-Time</option>
                        <option value="nonMemberPrice" className="text-navy">Non-Member / Returning</option>
                      </select>
                    </label>
                  </div>
                  <div className="text-4xl font-black mb-2">{displayPrice}</div>
                  <p className="text-slate-300 text-sm mb-6">
                    Secure your spot before the {t.earlyDeadline} deadline.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="block w-full text-center bg-white hover:bg-navy-light text-navy hover:text-white py-4 rounded font-bold uppercase text-sm tracking-wider transition-colors"
                  >
                    Add to Cart
                  </button>
                  <p className="mt-3 text-[11px] text-white/50 text-center">
                    Secure payment powered by Stripe.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-4xl font-black mb-2">
                    <span className="text-2xl">Contact for pricing</span>
                  </div>
                  <p className="text-slate-300 text-sm mb-6">
                    Secure your spot before the {t.earlyDeadline} deadline.
                  </p>
                  <a
                    href={`mailto:${t.contactEmail}?subject=${encodeURIComponent(`Register: ${t.name}`)}`}
                    className="block text-center bg-white hover:bg-navy-light text-navy hover:text-white py-4 rounded font-bold uppercase text-sm tracking-wider transition-colors"
                  >
                    Register Player
                  </a>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-sm">
                <p className="text-[11px] text-white/50 uppercase tracking-wider mb-1">
                  Prefer to register by phone or email?
                </p>
                <a
                  href={`tel:${t.contactPhone}`}
                  className="flex items-center gap-3 text-slate-200 hover:text-white"
                >
                  <Phone className="size-4" /> {t.contactPhone}
                </a>
                <a
                  href={`mailto:${t.contactEmail}`}
                  className="flex items-center gap-3 text-slate-200 hover:text-white"
                >
                  <Mail className="size-4" /> {t.contactEmail}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function InfoBlock({
  icon: Icon,
  title,
  lines,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  lines: string[];
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="size-9 rounded-lg bg-navy text-white grid place-items-center">
          <Icon className="size-4" />
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {title}
        </div>
      </div>
      <div className="space-y-1 text-slate-700">
        {lines.map((l, i) => (
          <div key={i} className={i === 0 ? "font-bold text-navy" : "text-sm"}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}