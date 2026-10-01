import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { listPartners, upsertPartner, deletePartner } from "@/lib/admin.functions";
import { Field, inputCls, PrimaryBtn, GhostBtn, Card } from "./adminUi";
import { ImageUploader } from "./ImageUploader";

type Row = {
  id?: string;
  name: string;
  logo_url: string;
  website_url: string;
  description: string;
  sort_order: number;
};

const empty = (): Row => ({
  name: "",
  logo_url: "",
  website_url: "",
  description: "",
  sort_order: 0,
});

export function AdminPartners() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);

  const q = useQuery({
    queryKey: ["admin", "partners"],
    queryFn: () => listPartners(),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "partners"] });
    qc.invalidateQueries({ queryKey: ["public", "partners"] });
  };

  const onSave = async () => {
    if (!editing) return;
    try {
      await upsertPartner({ data: editing });
      toast.success("Saved");
      setEditing(null);
      invalidate();
    } catch (e: unknown) {
      toast.error((e as Error).message);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this partner?")) return;
    await deletePartner({ data: { id } });
    toast.success("Deleted");
    invalidate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-navy text-xl">Partners</h2>
        <PrimaryBtn onClick={() => setEditing(empty())}>
          <Plus className="inline size-3.5 mr-1" /> Add Partner
        </PrimaryBtn>
      </div>

      {editing && (
        <Card>
          <h3 className="font-bold text-navy mb-4">
            {editing.id ? "Edit partner" : "New partner"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name">
              <input
                className={inputCls}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </Field>
            <Field label="Website URL">
              <input
                className={inputCls}
                placeholder="https://..."
                value={editing.website_url}
                onChange={(e) => setEditing({ ...editing, website_url: e.target.value })}
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
            <ImageUploader
              label="Partner Logo"
              folder="partners"
              value={editing.logo_url}
              onChange={(url) => setEditing({ ...editing, logo_url: url })}
            />
          </div>

          <div className="mt-4">
            <Field label="Description (optional)">
              <textarea
                rows={3}
                className={inputCls}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </Field>
          </div>

          <div className="flex gap-3 mt-6">
            <PrimaryBtn onClick={onSave}>
              <Save className="inline size-3.5 mr-1" /> Save
            </PrimaryBtn>
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {q.data?.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4"
          >
            {p.logo_url ? (
              <img
                src={p.logo_url}
                alt={p.name}
                className="size-14 shrink-0 rounded object-contain border border-slate-100 bg-slate-50"
              />
            ) : (
              <div className="size-14 shrink-0 rounded border border-slate-100 bg-slate-50" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-navy text-lg truncate">{p.name}</div>
              <div className="text-xs text-slate-400 truncate">{p.website_url}</div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
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
        {q.data?.length === 0 && (
          <div className="md:col-span-2 text-center py-10 text-slate-400 bg-white border border-slate-200 rounded-xl">
            No partners yet.
          </div>
        )}
      </div>
    </div>
  );
}
