import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getTournamentBySlug, type TournamentPricingRow } from "@/data/mockTournaments";
import { mockSchedule } from "@/data/mockSchedule";
import { CalendarDays, Clock, MapPin, Users, AlertCircle, Phone, Mail, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_site/tournament/$slug")({
  loader: ({ params }) => {
    const tournament = getTournamentBySlug(params.slug);
    // For rows without full data (TBD), return the schedule row instead.
    const scheduleRow = mockSchedule.find((r) => r.slug === params.slug);
    if (!tournament && !scheduleRow) throw notFound();
    return { tournament, scheduleRow };
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
            className="inline-flex items-center gap-2 text-white/80 hover:text-gold text-sm font-medium uppercase tracking-wider mb-6"
          >
            <ArrowLeft className="size-4" /> All Tournaments
          </Link>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
            Registration Open
          </div>
          <h1 className="font-display font-black uppercase text-4xl md:text-6xl tracking-tight leading-[1.05] max-w-3xl">
            {t.name}
          </h1>
          <p className="mt-4 text-xl text-slate-200">
            {t.city} at <span className="text-gold">{t.course}</span>
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
                    {t.pricing.map((row: TournamentPricingRow) => (
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
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                Register Now
              </div>
              <div className="text-4xl font-black mb-2">
                {t.pricing[0]?.memberPrice}
                <span className="text-sm text-slate-400 font-normal ml-2">
                  early member rate
                </span>
              </div>
              <p className="text-slate-300 text-sm mb-6">
                Secure your spot before the {t.earlyDeadline} deadline.
              </p>
              <a
                href={`mailto:${t.contactEmail}?subject=${encodeURIComponent(`Register: ${t.name}`)}`}
                className="block text-center bg-gold hover:bg-white text-navy py-4 rounded font-bold uppercase text-sm tracking-wider transition-colors"
              >
                Register Player
              </a>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-sm">
                <a
                  href={`tel:${t.contactPhone}`}
                  className="flex items-center gap-3 text-slate-200 hover:text-gold"
                >
                  <Phone className="size-4" /> {t.contactPhone}
                </a>
                <a
                  href={`mailto:${t.contactEmail}`}
                  className="flex items-center gap-3 text-slate-200 hover:text-gold"
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
        <div className="size-9 rounded-lg bg-navy text-gold grid place-items-center">
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