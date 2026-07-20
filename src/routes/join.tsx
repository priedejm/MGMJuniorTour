import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { handleJoinSubmit, US_STATES } from "@/lib/handlers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join the MGM Junior Tour" },
      { name: "description", content: "Sign up to receive information about the MGM Junior Tour." },
      { property: "og:title", content: "Join the MGM Junior Tour" },
      { property: "og:description", content: "Sign up for junior golf tournament info." },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    state: "",
    junior_ages: "",
  });
  const [source, setSource] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("src");
    if (s) setSource(s.slice(0, 60));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.state) return;
    setSubmitting(true);
    try {
      await handleJoinSubmit({ ...form, source });
      setDone(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-center border-b border-white/10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-9 bg-gold rounded-full grid place-items-center text-navy font-bold text-[10px]">
            MGM
          </div>
          <span className="font-display font-bold tracking-tight text-base">
            JUNIOR TOUR
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          {done ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm animate-scale-in">
              <div className="size-14 mx-auto rounded-full bg-gold text-navy grid place-items-center mb-5 animate-float">
                <Check className="size-6" strokeWidth={3} />
              </div>
              <h1 className="font-display font-black uppercase text-2xl text-navy mb-3">
                Thanks For Joining
              </h1>
              <p className="text-slate-600 leading-relaxed">
                Thanks for your interest in the MGM Junior Tour! We'll be in touch soon.
              </p>
              <Link
                to="/"
                className="mt-8 inline-block text-navy font-bold text-sm uppercase tracking-wider hover:text-gold"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm animate-fade-in">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                Join the Tour
              </div>
              <h1 className="font-display font-black uppercase text-3xl text-navy leading-[1.1]">
                Sign Up For Tour Info
              </h1>
              <p className="mt-3 text-slate-600 text-sm">
                Get schedule updates, early registration windows, and package details straight to your inbox.
              </p>
              <form onSubmit={onSubmit} className="mt-7 space-y-4">
                <MobileField label="Full Name">
                  <input
                    required
                    value={form.full_name}
                    onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                    className="mobile-input"
                    autoComplete="name"
                  />
                </MobileField>
                <MobileField label="Email Address">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="mobile-input"
                    autoComplete="email"
                    inputMode="email"
                  />
                </MobileField>
                <MobileField label="State">
                  <Select
                    value={form.state}
                    onValueChange={(v) => setForm((f) => ({ ...f, state: v }))}
                  >
                    <SelectTrigger className="w-full h-12 bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </MobileField>
                <MobileField label="Household Junior Golfer Ages">
                  <input
                    required
                    value={form.junior_ages}
                    onChange={(e) => setForm((f) => ({ ...f, junior_ages: e.target.value }))}
                    placeholder="e.g. 12, 15"
                    className="mobile-input"
                  />
                </MobileField>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-navy hover:bg-navy-light text-white py-4 rounded-lg font-bold uppercase text-sm tracking-wider transition-colors disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Sign Me Up"}
                </button>
              </form>
            </div>
          )}
          <p className="mt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} MGM Junior Tour
          </p>
        </div>
      </main>
      <style>{`
        .mobile-input {
          width: 100%;
          height: 3rem;
          padding: 0 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          outline: none;
          font-size: 1rem;
          transition: border-color 0.15s;
        }
        .mobile-input:focus { border-color: #002147; }
        .mobile-input:focus { box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.25); }
      `}</style>
    </div>
  );
}

function MobileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}