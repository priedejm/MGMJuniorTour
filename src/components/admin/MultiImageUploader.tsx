import { useRef, useState } from "react";
import { Upload, X, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload.functions";
import { inputCls } from "./adminUi";

type Folder = "photos" | "results" | "packages" | "misc";

export function MultiImageUploader({
  value,
  onChange,
  folder,
  label = "Images",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: Folder;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [pasteUrl, setPasteUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setBusy(true);
    const next = [...value];
    try {
      for (const file of Array.from(files)) {
        const res = await uploadImage(file, folder);
        next.push(res.url);
        onChange([...next]);
      }
      toast.success(`${files.length} image${files.length === 1 ? "" : "s"} uploaded`);
    } catch (e: unknown) {
      toast.error((e as Error).message || "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onTileClick = (i: number) => {
    if (selected === null) {
      setSelected(i);
      return;
    }
    if (selected === i) {
      setSelected(null);
      return;
    }
    const next = [...value];
    [next[selected], next[i]] = [next[i], next[selected]];
    onChange(next);
    setSelected(null);
  };

  const removeAt = (i: number) => {
    const next = value.filter((_, idx) => idx !== i);
    onChange(next);
    if (selected === i) setSelected(null);
    else if (selected !== null && selected > i) setSelected(selected - 1);
  };

  const addPasted = () => {
    const u = pasteUrl.trim();
    if (!u) return;
    onChange([...value, u]);
    setPasteUrl("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {label}
          {value.length > 0 && (
            <span className="ml-2 text-slate-400 normal-case tracking-normal">
              ({value.length})
            </span>
          )}
        </span>
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="text-[10px] font-bold uppercase tracking-widest text-navy hover:text-gold disabled:opacity-50"
        >
          {busy ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="size-3 animate-spin" /> Uploading…
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Plus className="size-3" /> Add Images
            </span>
          )}
        </button>
      </div>

      <div
        className={
          "mb-2 text-[11px] rounded px-2 py-1.5 border transition-opacity " +
          (selected !== null
            ? "text-navy bg-gold/10 border-gold/40 opacity-100"
            : "opacity-0 border-transparent")
        }
        aria-hidden={selected === null}
      >
        {selected !== null
          ? `Image #${selected + 1} selected — click another image to swap positions, or click it again to cancel.`
          : "placeholder"}
      </div>

      {value.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {value.map((url, i) => {
            const isSel = selected === i;
            return (
              <div key={`${url}-${i}`} className="relative group">
                <button
                  type="button"
                  onClick={() => onTileClick(i)}
                  className={
                    "block w-full aspect-square rounded overflow-hidden border-2 transition-all " +
                    (isSel
                      ? "border-gold ring-2 ring-gold/40 scale-95"
                      : selected !== null
                        ? "border-slate-200 hover:border-navy hover:ring-2 hover:ring-navy/30"
                        : "border-slate-200 hover:border-navy")
                  }
                  title={isSel ? "Click another image to swap" : "Click to select"}
                >
                  <img src={url} alt="" className="w-full h-full object-cover bg-slate-100" />
                </button>
                <div className="absolute top-1 left-1 bg-navy/80 text-white text-[10px] font-bold rounded px-1.5 py-0.5">
                  {i + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute top-1 right-1 bg-white/90 hover:bg-red-500 hover:text-white text-slate-600 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <X className="size-3" />
                </button>
              </div>
            );
          })}
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center gap-1 text-slate-500 hover:border-navy hover:text-navy transition-colors bg-slate-50"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Plus className="size-4" />
                <span className="text-[10px] font-bold uppercase">Add</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-navy hover:text-navy transition-colors bg-slate-50"
        >
          {busy ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest">Uploading…</span>
            </>
          ) : (
            <>
              <Upload className="size-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Choose Images</span>
              <span className="text-[10px] text-slate-400">
                JPG, PNG, WebP · up to 8 MB each · multiple allowed
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) handleFiles(files);
        }}
      />

      <details className="mt-3">
        <summary className="text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-navy">
          Or paste an image URL
        </summary>
        <div className="flex gap-2 mt-2">
          <input
            type="url"
            placeholder="https://..."
            value={pasteUrl}
            onChange={(e) => setPasteUrl(e.target.value)}
            className={inputCls}
          />
          <button
            type="button"
            onClick={addPasted}
            className="px-3 text-[10px] font-bold uppercase tracking-widest text-navy border border-slate-300 rounded hover:border-navy"
          >
            Add
          </button>
        </div>
      </details>

      <p className="text-[10px] text-slate-400 mt-2">
        Tip: click any image to select it, then click another to swap their positions.
        The number badge shows the display order.
      </p>
    </div>
  );
}