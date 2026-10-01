import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, X } from "lucide-react";
import {
  listTournaments,
  upsertTournament,
  deleteTournament,
} from "@/lib/admin.functions";
import { Field, inputCls, PrimaryBtn, GhostBtn, Card } from "./adminUi";

type PricingRow = { period: string; memberPrice: string; nonMemberPrice: string };

type Row = {
  id?: string;
  slug: string;
  dates_label: string;
  city: string;
  tee_time: string;
  course: string;
  month: string;
  year: number;
  tbd: boolean;
  sort_order: number;
  pricing: PricingRow[];
};

const empty = (): Row => ({
  slug: "",
  dates_label: "",
  city: "",
  tee_time: "TBA",
  course: "",
  month: "",
  year: new Date().getFullYear(),
  tbd: false,
  sort_order: 0,
  pricing: [
    { period: "Early Registration", memberPrice: "", nonMemberPrice: "" },
    { period: "Standard Registration", memberPrice: "", nonMemberPrice: "" },
  ],
});

export function AdminTournaments() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);

  const q = useQuery({
    queryKey: ["admin", "tournaments"],
    queryFn: () => listTournaments(),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "tournaments"] });
    qc.invalidateQueries({ queryKey: ["public", "tournaments"] });
  };

  const onSave = async () => {
    if (!editing) return;
    try {
      await upsertTournament({ data: editing });
      toast.success("Saved");
      setEditing(null);
      invalidate();
    } catch (e: unknown) {
      toast.error((e as Error).message);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this tournament?")) return;
    await deleteTournament({ data: { id } });
    toast.success("Deleted");
    invalidate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-navy text-xl">Tournaments</h2>
        <PrimaryBtn onClick={() => setEditing(empty())}>
          <Plus className="inline size-3.5 mr-1" /> Add Tournament
        </PrimaryBtn>
      </div>

      {editing && (
        <Card>
          <h3 className="font-bold text-navy mb-4">
            {editing.id ? "Edit tournament" : "New tournament"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Slug (URL segment)">
              <input
                className={inputCls}
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              />
            </Field>
            <Field label="Dates Label">
              <input
                className={inputCls}
                placeholder="July 12 – 13"
                value={editing.dates_label}
                onChange={(e) => setEditing({ ...editing, dates_label: e.target.value })}
              />
            </Field>
            <Field label="City">
              <input
                className={inputCls}
                value={editing.city}
                onChange={(e) => setEditing({ ...editing, city: e.target.value })}
              />
            </Field>
            <Field label="Course">
              <input
                className={inputCls}
                value={editing.course}
                onChange={(e) => setEditing({ ...editing, course: e.target.value })}
              />
            </Field>
            <Field label="Tee Time">
              <input
                className={inputCls}
                value={editing.tee_time}
                onChange={(e) => setEditing({ ...editing, tee_time: e.target.value })}
              />
            </Field>
            <Field label="Month">
              <input
                className={inputCls}
                value={editing.month}
                onChange={(e) => setEditing({ ...editing, month: e.target.value })}
              />
            </Field>
            <Field label="Year">
              <input
                type="number"
                className={inputCls}
                value={editing.year}
                onChange={(e) => setEditing({ ...editing, year: Number(e.target.value) })}
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
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={editing.tbd}
                onChange={(e) => setEditing({ ...editing, tbd: e.target.checked })}
              />
              <span className="text-sm text-slate-600">Mark as TBD (registration closed)</span>
            </label>
          </div>

          <PricingEditor
            items={editing.pricing}
            onChange={(pricing) => setEditing({ ...editing, pricing })}
          />

          <div className="flex gap-3 mt-6">
            <PrimaryBtn onClick={onSave}>
              <Save className="inline size-3.5 mr-1" /> Save
            </PrimaryBtn>
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
          </div>
        </Card>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="text-left px-4 py-3">Dates</th>
              <th className="text-left px-4 py-3">City</th>
              <th className="text-left px-4 py-3">Course</th>
              <th className="text-left px-4 py-3">Tee</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {q.data?.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 text-navy font-medium">{r.dates_label}</td>
                <td className="px-4 py-3 text-slate-600">{r.city}</td>
                <td className="px-4 py-3 text-slate-600">{r.course}</td>
                <td className="px-4 py-3 text-slate-500">{r.tee_time}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditing(r)}
                    className="text-navy hover:text-gold text-xs font-bold uppercase mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => r.id && onDelete(r.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="size-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {q.data?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  No tournaments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PricingEditor({
  items,
  onChange,
}: {
  items: PricingRow[];
  onChange: (v: PricingRow[]) => void;
}) {
  return (
    <div className="mt-4">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
        Pricing (registration period + member / non-member price)
      </span>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2">
            <input
              placeholder="Period (e.g. Early Registration, before Aug 19)"
              className={inputCls}
              value={it.period}
              onChange={(e) => {
                const c = [...items];
                c[i] = { ...c[i], period: e.target.value };
                onChange(c);
              }}
            />
            <input
              placeholder="Member price ($295)"
              className={inputCls}
              value={it.memberPrice}
              onChange={(e) => {
                const c = [...items];
                c[i] = { ...c[i], memberPrice: e.target.value };
                onChange(c);
              }}
            />
            <input
              placeholder="Non-member price ($375)"
              className={inputCls}
              value={it.nonMemberPrice}
              onChange={(e) => {
                const c = [...items];
                c[i] = { ...c[i], nonMemberPrice: e.target.value };
                onChange(c);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, ii) => ii !== i))}
              className="text-slate-400 hover:text-red-500"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, { period: "", memberPrice: "", nonMemberPrice: "" }])}
          className="text-xs font-bold uppercase text-navy hover:text-gold"
        >
          <Plus className="inline size-3" /> Add pricing row
        </button>
      </div>
    </div>
  );
}