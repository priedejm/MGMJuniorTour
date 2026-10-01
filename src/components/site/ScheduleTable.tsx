import { Link } from "@tanstack/react-router";
import { groupScheduleByMonth, type ScheduleRow } from "@/data/schedule";
import { ArrowUpRight, Clock } from "lucide-react";

export function ScheduleTable({ data }: { data: ScheduleRow[] }) {
  const groups = groupScheduleByMonth(data);
  if (groups.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        No tournaments scheduled yet — check back soon.
      </div>
    );
  }
  return (
    <div className="space-y-10 stagger">
      {groups.map((group) => (
        <div key={group.key}>
          <div className="flex items-center gap-4 mb-4">
            <h3 className="font-display font-black uppercase text-white text-xl tracking-tight">
              {group.month}
              <span className="text-white/70 ml-2">{group.year}</span>
            </h3>
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-widest text-slate-400">
              {group.rows.length} event{group.rows.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-navy-light/30">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-[11px] uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-semibold">Dates</th>
                  <th className="px-6 py-4 font-semibold">City / Time</th>
                  <th className="px-6 py-4 font-semibold">Course</th>
                  <th className="px-6 py-4 font-semibold text-right">Sign Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {group.rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-white/10 transition-colors duration-300"
                  >
                    <td className="px-6 py-5 font-bold text-white whitespace-nowrap">
                      {row.dates}
                    </td>
                    <td className="px-6 py-5 text-slate-200">
                      <div>{row.city}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{row.time}</div>
                    </td>
                    <td className="px-6 py-5 text-slate-300">
                      {row.tbd && row.course.includes("TBD") ? (
                        <span className="italic text-slate-400">{row.course}</span>
                      ) : (
                        row.course
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {row.tbd ? (
                        <span
                          className="inline-flex items-center gap-1.5 text-slate-400 font-bold text-sm cursor-not-allowed"
                          title="Venue and registration details haven't been finalized for this event yet"
                        >
                          <Clock className="size-3.5" />
                          Coming Soon
                        </span>
                      ) : (
                        <Link
                          to="/tournament/$slug"
                          params={{ slug: row.slug }}
                          className="inline-flex items-center gap-1 text-white hover:text-white/70 font-bold text-sm group"
                        >
                          Sign Up Here
                          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}