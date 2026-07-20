import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { listPhotos, upsertPhoto, deletePhoto } from "@/lib/admin.functions";
import { inputCls, PrimaryBtn, GhostBtn, Card, Field } from "./adminUi";
import { ImageUploader } from "./ImageUploader";

type Row = {
  id?: string;
  image_url: string;
  caption: string;
  sort_order: number;
};

const empty = (): Row => ({ image_url: "", caption: "", sort_order: 0 });

export function AdminPhotos() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);

  const q = useQuery({
    queryKey: ["admin", "photos"],
    queryFn: () => listPhotos(),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "photos"] });
    qc.invalidateQueries({ queryKey: ["public", "photos"] });
  };

  const onSave = async () => {
    if (!editing) return;
    try {
      await upsertPhoto({ data: editing });
      toast.success("Saved");
      setEditing(null);
      invalidate();
    } catch (e: unknown) {
      toast.error((e as Error).message);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    await deletePhoto({ data: { id } });
    toast.success("Deleted");
    invalidate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display font-bold text-navy text-xl">Gallery Photos</h2>
        <PrimaryBtn onClick={() => setEditing(empty())}>
          <Plus className="inline size-3.5 mr-1" /> Add Photo
        </PrimaryBtn>
      </div>

      {editing && (
        <Card>
          <h3 className="font-bold text-navy mb-4">
            {editing.id ? "Edit photo" : "New photo"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ImageUploader
              label="Photo"
              folder="photos"
              value={editing.image_url}
              onChange={(url) => setEditing({ ...editing, image_url: url })}
            />
            <Field label="Caption (optional)">
              <input
                className={inputCls}
                value={editing.caption}
                onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
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
          <div className="flex gap-3 mt-6">
            <PrimaryBtn onClick={onSave}>
              <Save className="inline size-3.5 mr-1" /> Save
            </PrimaryBtn>
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
          </div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {q.data?.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden"
          >
            <div className="aspect-[4/3] bg-slate-100">
              <img src={p.image_url} alt={p.caption} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-xs text-slate-500 truncate">{p.caption || "—"}</span>
              <div className="flex gap-2">
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
          </div>
        ))}
        {q.data?.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-400">
            No photos yet.
          </div>
        )}
      </div>
    </div>
  );
}