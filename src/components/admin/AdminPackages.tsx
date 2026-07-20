import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save, X } from "lucide-react";
import { listPackages, upsertPackage, deletePackage } from "@/lib/admin.functions";
import { Field, inputCls, PrimaryBtn, GhostBtn, Card } from "./adminUi";
import { ImageUploader } from "./ImageUploader";

type IncludedItem = { label: string; note?: string };
type Row = {
  id?: string;
  slug: string;
  name: string;
  price: string;
  callout: string;
  image_url: string;
  description: string;
  features: string[];
  included: IncludedItem[];
  bonuses: string[];
  total_value: string;
  disclaimer: string;
  featured: boolean;
  sort_order: number;
};

const empty = (): Row => ({
  slug: "",
  name: "",
  price: "$0",
  callout: "",
  image_url: "",
  description: "",
  features: [],
  included: [],
  bonuses: [],
  total_value: "",
  disclaimer: "",
  featured: false,
  sort_order: 0,
});

export function AdminPackages() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);

  const q = useQuery({
    queryKey: ["admin", "packages"],
    queryFn: () => listPackages(),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "packages"] });
    qc.invalidateQueries({ queryKey: ["public", "packages"] });
  };

  const onSave = async () => {
    if (!editing) return;
    try {
      await upsertPackage({ data: editing });
      toast.success("Saved");
      setEditing(null);
      invalidate();
    } catch (e: unknown) {
      toast.error((e as Error).message);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;
    await deletePackage({ data: { id } });
    toast.success("Deleted");
    invalidate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-navy text-xl">Membership Packages</h2>
        <PrimaryBtn onClick={() => setEditing(empty())}>
          <Plus className="inline size-3.5 mr-1" /> Add Package
        </PrimaryBtn>
      </div>

      {editing && <PackageEditor row={editing} setRow={setEditing} onSave={onSave} />}

      <div className="grid md:grid-cols-2 gap-4">
        {q.data?.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4"
          >
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-widest text-gold font-bold">
                {p.callout || "—"}
              </div>
              <div className="font-display font-bold text-navy text-lg">{p.name}</div>
              <div className="text-2xl font-black text-navy">{p.price}</div>
              <div className="text-xs text-slate-400 mt-1">/{p.slug}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setEditing(p)}
                className="text-xs font-bold uppercase text-navy hover:text-gold"
              >
                Edit
              </button>
              <button
                onClick={() => p.id && onDelete(p.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PackageEditor({
  row,
  setRow,
  onSave,
}: {
  row: Row;
  setRow: (r: Row | null) => void;
  onSave: () => void;
}) {
  return (
    <Card>
      <h3 className="font-bold text-navy mb-4">{row.id ? "Edit package" : "New package"}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Slug"><input className={inputCls} value={row.slug} onChange={(e) => setRow({ ...row, slug: e.target.value })} /></Field>
        <Field label="Name"><input className={inputCls} value={row.name} onChange={(e) => setRow({ ...row, name: e.target.value })} /></Field>
        <Field label="Price"><input className={inputCls} value={row.price} onChange={(e) => setRow({ ...row, price: e.target.value })} /></Field>
        <Field label="Callout"><input className={inputCls} value={row.callout} onChange={(e) => setRow({ ...row, callout: e.target.value })} /></Field>
        <Field label="Total Value"><input className={inputCls} value={row.total_value} onChange={(e) => setRow({ ...row, total_value: e.target.value })} /></Field>
        <Field label="Sort Order"><input type="number" className={inputCls} value={row.sort_order} onChange={(e) => setRow({ ...row, sort_order: Number(e.target.value) })} /></Field>
        <label className="flex items-center gap-2 mt-6">
          <input type="checkbox" checked={row.featured} onChange={(e) => setRow({ ...row, featured: e.target.checked })} />
          <span className="text-sm text-slate-600">Featured (most popular)</span>
        </label>
      </div>
      <div className="mt-4">
        <ImageUploader
          label="Package Image"
          folder="packages"
          value={row.image_url}
          onChange={(url) => setRow({ ...row, image_url: url })}
        />
      </div>
      <div className="mt-4">
        <Field label="Description">
          <textarea rows={3} className={inputCls} value={row.description} onChange={(e) => setRow({ ...row, description: e.target.value })} />
        </Field>
      </div>

      <ListEditor
        label="Features (short bullets shown on the card)"
        items={row.features}
        onChange={(features) => setRow({ ...row, features })}
      />
      <IncludedEditor
        items={row.included}
        onChange={(included) => setRow({ ...row, included })}
      />
      <ListEditor
        label="Bonuses"
        items={row.bonuses}
        onChange={(bonuses) => setRow({ ...row, bonuses })}
      />

      <div className="mt-4">
        <Field label="Disclaimer">
          <textarea rows={2} className={inputCls} value={row.disclaimer} onChange={(e) => setRow({ ...row, disclaimer: e.target.value })} />
        </Field>
      </div>

      <div className="flex gap-3 mt-6">
        <PrimaryBtn onClick={onSave}><Save className="inline size-3.5 mr-1" /> Save</PrimaryBtn>
        <GhostBtn onClick={() => setRow(null)}>Cancel</GhostBtn>
      </div>
    </Card>
  );
}

function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="mt-4">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
        {label}
      </span>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={inputCls}
              value={it}
              onChange={(e) => {
                const c = [...items];
                c[i] = e.target.value;
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
          onClick={() => onChange([...items, ""])}
          className="text-xs font-bold uppercase text-navy hover:text-gold"
        >
          <Plus className="inline size-3" /> Add
        </button>
      </div>
    </div>
  );
}

function IncludedEditor({
  items,
  onChange,
}: {
  items: IncludedItem[];
  onChange: (v: IncludedItem[]) => void;
}) {
  return (
    <div className="mt-4">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
        What's Included (label + optional note)
      </span>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input
              placeholder="Label"
              className={inputCls}
              value={it.label}
              onChange={(e) => {
                const c = [...items];
                c[i] = { ...c[i], label: e.target.value };
                onChange(c);
              }}
            />
            <input
              placeholder="Note (optional)"
              className={inputCls}
              value={it.note ?? ""}
              onChange={(e) => {
                const c = [...items];
                c[i] = { ...c[i], note: e.target.value || undefined };
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
          onClick={() => onChange([...items, { label: "" }])}
          className="text-xs font-bold uppercase text-navy hover:text-gold"
        >
          <Plus className="inline size-3" /> Add
        </button>
      </div>
    </div>
  );
}