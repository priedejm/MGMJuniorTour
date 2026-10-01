import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Loader2, Lock, LogOut, Eye, EyeOff } from "lucide-react";
import { checkAdminSession, loginAdmin, logoutAdmin } from "@/lib/admin-gate";
import { AdminTournaments } from "./AdminTournaments";
import { AdminPackages } from "./AdminPackages";
import { AdminPhotos } from "./AdminPhotos";
import { AdminResults } from "./AdminResults";
import { AdminLeads } from "./AdminLeads";
import { AdminPartners } from "./AdminPartners";
import { AdminOrders } from "./AdminOrders";

const TABS = [
  { key: "tournaments", label: "Tournaments" },
  { key: "packages", label: "Packages" },
  { key: "partners", label: "Partners" },
  { key: "photos", label: "Photos" },
  { key: "results", label: "Results" },
  { key: "orders", label: "Orders" },
  { key: "leads", label: "Sign-Ups" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function AdminDashboard() {
  const qc = useQueryClient();
  const session = useQuery({ queryKey: ["admin", "session"], queryFn: checkAdminSession });

  if (session.isPending) {
    return (
      <div className="min-h-screen grid place-items-center bg-navy">
        <Loader2 className="size-8 text-white/60 animate-spin" />
      </div>
    );
  }

  if (!session.data) {
    return (
      <AdminLogin onUnlock={() => qc.invalidateQueries({ queryKey: ["admin", "session"] })} />
    );
  }

  return (
    <AdminPanel
      onLock={() => qc.invalidateQueries({ queryKey: ["admin", "session"] })}
    />
  );
}

function AdminLogin({ onUnlock }: { onUnlock: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await loginAdmin(passcode);
    setSubmitting(false);
    if (ok) {
      onUnlock();
    } else {
      setError("Incorrect passcode.");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-navy px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl text-center"
      >
        <div className="size-12 rounded-full bg-gold text-navy grid place-items-center mx-auto mb-4">
          <Lock className="size-5" />
        </div>
        <h1 className="font-display font-black uppercase text-2xl text-navy tracking-tight">
          Admin Login
        </h1>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Enter the admin passcode to manage tournaments, packages, photos, and results.
        </p>
        <div className="relative mt-6">
          <input
            type={showPasscode ? "text" : "password"}
            autoFocus
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setError("");
            }}
            placeholder="Passcode"
            className="w-full px-3 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded focus:border-navy outline-none text-sm text-center"
          />
          <button
            type="button"
            onClick={() => setShowPasscode((v) => !v)}
            aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy"
          >
            {showPasscode ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-4 bg-navy hover:bg-navy-light disabled:opacity-60 text-white px-5 py-2.5 rounded font-bold uppercase text-xs tracking-wider"
        >
          {submitting ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}

function AdminPanel({ onLock }: { onLock: () => void }) {
  const [tab, setTab] = useState<TabKey>("tournaments");

  const onLogout = async () => {
    await logoutAdmin();
    onLock();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-9 bg-white rounded-full grid place-items-center text-navy text-[10px] font-bold shrink-0">
              MGM
            </div>
            <h1 className="font-display font-black uppercase text-lg tracking-tight">
              Junior Tour — Admin
            </h1>
          </Link>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white"
          >
            <LogOut className="size-3.5" /> Lock
          </button>
        </div>
        <nav className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors " +
                (tab === t.key
                  ? "border-white text-white"
                  : "border-transparent text-white/60 hover:text-white")
              }
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === "tournaments" && <AdminTournaments />}
        {tab === "packages" && <AdminPackages />}
        {tab === "partners" && <AdminPartners />}
        {tab === "photos" && <AdminPhotos />}
        {tab === "results" && <AdminResults />}
        {tab === "orders" && <AdminOrders />}
        {tab === "leads" && <AdminLeads />}
      </main>
    </div>
  );
}
