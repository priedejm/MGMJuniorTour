import { createFileRoute } from "@tanstack/react-router";
import { ScheduleTable } from "@/components/site/ScheduleTable";
import type { ScheduleRow } from "@/data/schedule";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { TournamentRow } from "@/lib/admin.functions";
import logoInspirationImage from "@/assets/LOGOACTUALPIC.jpeg";

export const Route = createFileRoute("/_site/schedule")({
  head: () => ({
    meta: [
      { title: "2026 Schedule — MGM Junior Tour" },
      { name: "description", content: "The complete 2026 MGM Junior Tour tournament schedule. View dates, courses, and register for events." },
      { property: "og:title", content: "2026 Tournament Schedule" },
      { property: "og:description", content: "MGM Junior Tour 2026 tournament schedule." },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const { data } = useQuery({
    queryKey: ["public", "tournaments"],
    queryFn: async () => {
      const rows = await apiGet<TournamentRow[]>("/list-tournaments.php");
      return rows.map<ScheduleRow>((r) => ({
        id: r.id!,
        dates: r.dates_label,
        city: r.city,
        time: r.tee_time,
        course: r.course,
        month: r.month,
        year: r.year,
        slug: r.slug,
        tbd: r.tbd,
      }));
    },
  });
  const rows = data ?? [];
  return (
    <section className="bg-navy text-white py-20 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-16">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80 mb-3">
              Season Schedule
            </div>
            <h1 className="font-display font-black uppercase text-5xl md:text-6xl tracking-tight leading-[1.05]">
              2026 Schedule
            </h1>
            <div className="h-1 w-24 bg-white mt-6" />
            <p className="mt-6 text-lg text-slate-300 max-w-2xl">
              Registration is now open for all confirmed events. Click any tournament to view full details and sign up.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-80">
            <img
              src={logoInspirationImage}
              alt="The original photo that inspired the MGM Junior Tour logo"
              className="rounded-xl w-full h-auto object-cover shadow-lg"
            />
            <p className="text-base text-white/50 mt-2 text-center">
              Photo that inspired the tour logo
            </p>
          </div>
        </div>
        <ScheduleTable data={rows} />
      </div>
    </section>
  );
}