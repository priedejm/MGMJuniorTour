import type { ReactNode } from "react";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="text-xs text-slate-400 mt-1 block">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:border-navy outline-none text-sm";

export function PrimaryBtn({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={
        "bg-navy hover:bg-navy-light text-white px-5 py-2.5 rounded font-bold uppercase text-xs tracking-wider disabled:opacity-60 " +
        (rest.className ?? "")
      }
    >
      {children}
    </button>
  );
}

export function GhostBtn({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={
        "px-4 py-2 rounded font-bold uppercase text-xs tracking-wider text-slate-500 hover:text-navy border border-slate-200 hover:border-navy " +
        (rest.className ?? "")
      }
    >
      {children}
    </button>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      {children}
    </div>
  );
}

export function ErrorState({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "Failed to load.";
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <p className="text-red-700 text-sm font-semibold">Couldn't load this data.</p>
      <p className="text-red-600 text-sm mt-1">{message}</p>
    </div>
  );
}