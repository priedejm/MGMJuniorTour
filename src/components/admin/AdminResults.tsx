import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, ImageIcon, Link2, Loader2 } from "lucide-react";
import { listTournaments, listResults, upsertResult, deleteResult } from "@/lib/admin.functions";
import { Field, inputCls, PrimaryBtn, GhostBtn, Card } from "./adminUi";
import { MultiImageUploader } from "./MultiImageUploader";

type Tournament = {
  id: string;
  slug: string;
  dates_label: string;
  city: string;
  course: string;
  month: string;
  year: number;
  sort_order: number;
};

type ResultRow = {
  id?: string;
  tournament_id?: string | null;
  tournament_name: string;
  date: string;
  location: string;
  results_url: string;
  sort_order: number;
  images: string[];
};

const MONTH_INDEX: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function guessDate(t: Tournament): string {
  const m = MONTH_INDEX[t.month.trim().toLowerCase()] ?? 0;
  // Try to extract first day from dates_label like "July 12 – 13"
  const dayMatch = t.dates_label.match(/\d{1,2}/);
  const day = dayMatch ? Number(dayMatch[0]) : 1;
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${t.year}-${mm}-${dd}`;
}

export function AdminResults() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<ResultRow | null>(null);
  const [saving, setSaving] = useState(false);

  const q = useQuery({
    queryKey: ["admin", "tournaments-with-results"],
    queryFn: async () => {
      const [tRows, rRows] = await Promise.all([listTournaments(), listResults()]);
      const tournaments = [...tRows].sort((a, b) => b.year - a.year || a.sort_order - b.sort_order) as Tournament[];

      const byT = new Map<string, ResultRow>();
      const orphans: ResultRow[] = [];
      for (const r of rRows as ResultRow[]) {
        if (r.tournament_id) byT.set(r.tournament_id, r);
        else orphans.push(r);
      }
      return { tournaments, byT, orphans };
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "tournaments-with-results"] });
    qc.invalidateQueries({ queryKey: ["public", "results"] });
  };

  const onSave = async () => {
    if (!editing || saving) return;
    setSaving(true);
    try {
      await upsertResult({ data: editing });
      toast.success("Saved");
      setEditing(null);
      invalidate();
    } catch (e: unknown) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this result?")) return;
    await deleteResult({ data: { id } });
    toast.success("Deleted");
    invalidate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-navy text-xl">Tournament Results</h2>
        <span className="text-xs text-slate-500">
          Post a link to the full results plus a few photos for each tournament — no need to enter individual scores here.
        </span>
      </div>

      {editing && (
        <Card>
          <h3 className="font-bold text-navy mb-4">
            {editing.id ? "Edit result" : "New result"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Tournament Name">
              <input
                className={inputCls}
                value={editing.tournament_name}
                onChange={(e) => setEditing({ ...editing, tournament_name: e.target.value })}
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                className={inputCls}
                value={editing.date}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
              />
            </Field>
            <Field label="Location">
              <input
                className={inputCls}
                value={editing.location}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
              />
            </Field>
            <Field label="Sort Order">
              <input
                type="number"
                className={inputCls}
                value={editing.sort_order}
                onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field
              label="Results Link"
              hint="URL to the full results (e.g. a leaderboard on another site). Shown as a button on the public archive page."
            >
              <input
                type="url"
                placeholder="https://..."
                className={inputCls}
                value={editing.results_url}
                onChange={(e) => setEditing({ ...editing, results_url: e.target.value })}
              />
            </Field>
          </div>

          <div className="mt-4">
            <MultiImageUploader
              label="Result Images"
              folder="results"
              value={editing.images}
              onChange={(images) => setEditing({ ...editing, images })}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <PrimaryBtn onClick={onSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="inline size-3.5 mr-1 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="inline size-3.5 mr-1" /> Save
                </>
              )}
            </PrimaryBtn>
            <GhostBtn onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </GhostBtn>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {q.data?.tournaments.map((t) => {
          const existing = q.data!.byT.get(t.id);
          return (
            <div
              key={t.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="font-bold text-navy">
                  {t.dates_label}{t.city ? ` — ${t.city}` : ""}
                  <span className="ml-2 text-xs font-normal text-slate-400">{t.year}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {t.course}
                  {existing ? (
                    <>
                      <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <ImageIcon className="size-3" /> {existing.images.length} photo{existing.images.length === 1 ? "" : "s"}
                      </span>
                      {existing.results_url && (
                        <span className="ml-2 inline-flex items-center gap-1 text-navy font-medium">
                          <Link2 className="size-3" /> Link added
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="ml-2 text-slate-400">No results yet</span>
                  )}
                </div>
              </div>
              {existing ? (
                <>
                  <button
                    onClick={() => setEditing(existing)}
                    className="text-xs font-bold uppercase text-navy hover:text-gold"
                  >
                    Edit Result
                  </button>
                  <button
                    onClick={() => existing.id && onDelete(existing.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete result"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </>
              ) : (
                <PrimaryBtn
                  onClick={() =>
                    setEditing({
                      tournament_id: t.id,
                      tournament_name: `${t.dates_label}${t.city ? ` — ${t.city}` : ""}`,
                      date: guessDate(t),
                      location: [t.course, t.city].filter(Boolean).join(", "),
                      results_url: "",
                      sort_order: 0,
                      images: [],
                    })
                  }
                >
                  <Plus className="inline size-3.5 mr-1" /> Add Results
                </PrimaryBtn>
              )}
            </div>
          );
        })}
        {q.data && q.data.tournaments.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            No tournaments yet. Add tournaments in the Tournaments tab first.
          </div>
        )}

        {q.data && q.data.orphans.length > 0 && (
          <div className="mt-8">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
              Unlinked results
            </div>
            {q.data.orphans.map((r) => (
              <div key={r.id} className="bg-white border border-dashed border-slate-300 rounded-xl p-4 flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <div className="font-bold text-navy">{r.tournament_name}</div>
                  <div className="text-xs text-slate-500">
                    {r.date} • {r.location} • {r.images.length} photos
                    {r.results_url ? " • Link added" : ""}
                  </div>
                </div>
                <button onClick={() => setEditing(r)} className="text-xs font-bold uppercase text-navy hover:text-gold">Edit</button>
                <button onClick={() => r.id && onDelete(r.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}