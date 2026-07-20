import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { handleContactSubmit } from "@/lib/handlers";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MGM Junior Tour" },
      { name: "description", content: "Get in touch with the MGM Junior Tour team." },
      { property: "og:title", content: "Contact MGM Junior Tour" },
      { property: "og:description", content: "Contact the tour with questions or to register." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await handleContactSubmit(form);
      toast.success("Message sent — we'll be in touch shortly.");
      setForm({ name: "", phone: "", subject: "", message: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-navy py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-cream shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[820px]">
        {/* Left: Editorial info panel */}
        <aside className="w-full md:w-2/5 p-8 lg:p-14 border-b md:border-b-0 md:border-r border-gold/25 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-6">
              Get in Touch
            </p>
            <h1 className="font-display font-black uppercase italic text-navy leading-[0.9] text-5xl lg:text-6xl mb-12">
              Contact<br />The Tour
            </h1>

            <div className="space-y-10">
              <InfoBlock label="General Enquiries">
                <p className="font-medium">info@mgmjuniortour.com</p>
                <a href="tel:+17753865594" className="block text-navy/70 text-sm mt-1 hover:text-gold transition-colors">
                  (775) 386-5594
                </a>
              </InfoBlock>
              <InfoBlock label="Press & Media">
                <p className="font-medium">press@mgmjuniortour.com</p>
              </InfoBlock>
              <InfoBlock label="Headquarters">
                <p className="font-medium">1200 Fairway Drive</p>
                <p className="text-navy/70 text-sm mt-1">Coral Springs, FL 33065</p>
              </InfoBlock>
            </div>
          </div>

          <div className="mt-16 flex gap-6 text-gold text-xs uppercase tracking-wider font-bold">
            <a href="#" className="hover:text-navy transition-colors">Instagram</a>
            <a href="#" className="hover:text-navy transition-colors">Facebook</a>
            <a href="#" className="hover:text-navy transition-colors">YouTube</a>
          </div>
        </aside>

        {/* Right: Form panel */}
        <div className="w-full md:w-3/5 bg-white p-8 lg:p-16 flex flex-col justify-center">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UField label="Full Name">
                <input
                  required
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder="Jordan Smith"
                  className="uline"
                />
              </UField>
              <UField label="Phone">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={onChange("phone")}
                  placeholder="(555) 000-0000"
                  className="uline"
                />
              </UField>
            </div>

            <UField label="Subject">
              <input
                required
                value={form.subject}
                onChange={onChange("subject")}
                placeholder="Membership, packages, tournaments…"
                className="uline"
              />
            </UField>

            <UField label="Message">
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={onChange("message")}
                placeholder="How can we help?"
                className="uline resize-none"
              />
            </UField>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="group relative overflow-hidden w-full md:w-auto px-12 py-4 bg-navy text-cream text-xs uppercase tracking-[0.2em] font-bold disabled:opacity-60"
              >
                <span className="relative z-10">
                  {submitting ? "Sending…" : "Send Inquiry"}
                </span>
                <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gold" />
              </button>
            </div>
          </form>

          <div className="mt-12 flex items-start gap-4 p-4 border border-gold/25 bg-cream/50">
            <span className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0" />
            <p className="text-[11px] leading-relaxed text-navy/60 uppercase tracking-wide">
              Registrations for the current season are open. Our team responds to new inquiries within two business days.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .uline {
          width: 100%;
          background: transparent;
          border: 0;
          border-bottom: 1px solid rgba(0, 33, 71, 0.2);
          padding: 0.5rem 0;
          outline: none;
          font-weight: 500;
          color: #002147;
          transition: border-color 0.25s;
        }
        .uline::placeholder { color: rgba(0, 33, 71, 0.3); }
        .uline:focus { border-bottom-color: #c5a880; }
      `}</style>
    </section>
  );
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs uppercase tracking-widest text-navy font-bold border-b border-gold pb-2 mb-3 w-fit">
        {label}
      </h3>
      <div className="text-navy">{children}</div>
    </section>
  );
}

function UField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-widest text-navy/50 font-semibold mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}