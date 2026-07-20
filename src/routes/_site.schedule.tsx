import { createFileRoute } from "@tanstack/react-router";
import { ScheduleTable } from "@/components/site/ScheduleTable";
import { mockSchedule, type ScheduleRow } from "@/data/mockSchedule";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { TournamentRow } from "@/lib/admin.functions";

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
  const rows = data && data.length > 0 ? data : mockSchedule;
  return (
    <section className="bg-navy text-white py-20 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
          Season Schedule
        </div>
        <h1 className="font-display font-black uppercase text-5xl md:text-6xl tracking-tight leading-[1.05]">
          2026 Schedule
        </h1>
        <div className="h-1 w-24 bg-gold mt-6" />
        <p className="mt-6 text-lg text-slate-300 max-w-2xl mb-16">
          Registration is now open for all confirmed events. Click any tournament to view full details and sign up.
        </p>
        <ScheduleTable data={rows} />
      </div>
    </section>
  );
}