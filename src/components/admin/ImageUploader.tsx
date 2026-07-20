import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload.functions";
import { inputCls } from "./adminUi";

type Folder = "photos" | "results" | "packages" | "misc";

export function ImageUploader({
  value,
  onChange,
  folder,
  label = "Image",
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: Folder;
  label?: string;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const res = await uploadImage(file, folder);
      onChange(res.url);
      toast.success("Image uploaded");
    } catch (e: unknown) {
      toast.error((e as Error).message || "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {label}
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] font-bold uppercase text-slate-400 hover:text-red-500"
          >
            <X className="inline size-3" /> Clear
          </button>
        )}
      </div>

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt=""
            className="w-full max-h-56 object-cover rounded border border-slate-200 bg-slate-100"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 grid place-items-center bg-navy/60 text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity rounded"
          >
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Uploading…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Upload className="size-4" /> Replace
              </span>
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
              <span className="text-xs font-bold uppercase tracking-widest">
                Uploading…
              </span>
            </>
          ) : (
            <>
              <Upload className="size-5" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Choose Image
              </span>
              <span className="text-[10px] text-slate-400">
                JPG, PNG, WebP · up to 8 MB
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      <details className="mt-2">
        <summary className="text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-navy">
          Or paste a URL
        </summary>
        <input
          type="url"
          placeholder="https://..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls + " mt-2"}
        />
      </details>

      {hint && <p className="text-[10px] text-slate-400 mt-1.5">{hint}</p>}
    </div>
  );
}