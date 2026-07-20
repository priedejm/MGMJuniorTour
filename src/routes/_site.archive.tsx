import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { mockArchive, type ArchiveEntry } from "@/data/mockArchive";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { ResultRow } from "@/lib/admin.functions";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CalendarDays, ExternalLink, Loader2, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_site/archive")({
  head: () => ({
    meta: [
      { title: "Tournament Results Archive — MGM Junior Tour" },
      { name: "description", content: "Browse past MGM Junior Tour tournament results and photos." },
      { property: "og:title", content: "Tournament Results Archive" },
      { property: "og:description", content: "Past tournament results and photos." },
    ],
  }),
  component: ArchivePage,
});

function ArchivePage() {
  const { data: dbData, isPending } = useQuery({
    queryKey: ["public", "results"],
    queryFn: async () => {
      const rows = await apiGet<ResultRow[]>("/list-results.php");
      return rows
        .map<ArchiveEntry>((r) => {
          const d = new Date(r.date);
          return {
            id: r.id!,
            tournament_name: r.tournament_name,
            date: r.date,
            location: r.location,
            results_url: r.results_url,
            year: d.getUTCFullYear(),
            month: d.toLocaleString(undefined, { month: "long", timeZone: "UTC" }),
            images: r.images,
          };
        })
        .sort((a, b) => (a.date < b.date ? 1 : -1));
    },
  });

  const source = dbData && dbData.length > 0 ? dbData : mockArchive;

  const years = useMemo(
    () => Array.from(new Set(source.map((a) => a.year))).sort((a, b) => b - a),
    [source],
  );
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const [year, setYear] = useState<string>("all");
  const [month, setMonth] = useState<string>("all");
  const [openImage, setOpenImage] = useState<string | null>(null);

  if (isPending) {
    return (
      <section className="py-20 bg-white min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Results"
            title="Tournament Archive"
            subtitle="Browse past tournament results and photo galleries from across the tour."
          />
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Loader2 className="size-10 animate-spin text-gold mb-4" />
            <p className="text-sm font-medium">Loading results…</p>
          </div>
        </div>
      </section>
    );
  }

  const filtered = source
    .filter((a) => year === "all" || String(a.year) === year)
    .filter((a) => month === "all" || a.month === month)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="py-20 bg-white min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="Results"
          title="Tournament Archive"
          subtitle="Browse past tournament results and photo galleries from across the tour."
        />

        <div className="flex flex-wrap gap-4 mb-10 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
              Year
            </label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
              Month
            </label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-slate-500 pb-2">
              {filtered.length} tournament{filtered.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <div className="space-y-6 stagger">
          {filtered.map((entry) => (
            <article
              key={entry.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover-lift hover:border-gold"
            >
              <div className="p-6 border-b border-slate-100 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-navy">
                    {entry.tournament_name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-4 text-gold" />
                      {new Date(entry.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4 text-gold" />
                      {entry.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.results_url && (
                    <a
                      href={entry.results_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-navy text-white px-3 py-1.5 rounded hover:bg-gold hover:text-navy transition-colors"
                    >
                      View Full Results <ExternalLink className="size-3" />
                    </a>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-navy px-3 py-1.5 rounded">
                    {entry.images.length} photos
                  </span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {entry.images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setOpenImage(src)}
                    className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group hover:border-gold transition-colors"
                  >
                    <img
                      src={src}
                      alt={`${entry.tournament_name} ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </button>
                ))}
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              No tournaments match those filters.
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!openImage} onOpenChange={(o) => !o && setOpenImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none">
          <DialogTitle className="sr-only">Tournament photo</DialogTitle>
          {openImage && (
            <img
              src={openImage}
              alt="Tournament full size"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}