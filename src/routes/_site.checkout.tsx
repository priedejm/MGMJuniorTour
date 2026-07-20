import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Lock, ArrowLeft, Apple, Wallet } from "lucide-react";
import { formatUSD, useCart } from "@/lib/cart";

export const Route = createFileRoute("/_site/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — MGM Junior Tour" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

type PayMethod = "card" | "apple" | "google" | "affirm";

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState<PayMethod>("card");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <section className="py-24 text-center">
        <h1 className="font-display font-black uppercase text-3xl text-navy mb-4">
          Nothing To Checkout
        </h1>
        <p className="text-slate-500 mb-8">Add a package to your cart first.</p>
        <Link
          to="/packages"
          className="inline-block bg-navy hover:bg-navy-light text-white px-8 py-4 font-bold uppercase text-sm tracking-[0.2em] transition-colors"
        >
          View Packages
        </Link>
      </section>
    );
  }

  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Placeholder: payment gateway not connected yet.
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Order placed (demo) — payments coming soon");
    clear();
    setSubmitting(false);
    navigate({ to: "/" });
  };

  return (
    <section className="py-16 bg-cream min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-navy/60 hover:text-gold transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Cart
        </Link>
        <h1 className="font-display font-black uppercase text-4xl md:text-5xl text-navy tracking-tight mt-4">
          Checkout
        </h1>
        <div className="h-1 w-20 bg-gold mt-4" />

        <form onSubmit={onSubmit} className="mt-12 grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* Contact */}
            <Section title="Contact">
              <Field label="Email" type="email" name="email" required />
              <Field label="Phone" type="tel" name="phone" />
            </Section>

            {/* Shipping */}
            <Section title="Shipping Address">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First name" name="firstName" required />
                <Field label="Last name" name="lastName" required />
              </div>
              <Field label="Address" name="address" required />
              <Field label="Apt / Suite" name="address2" />
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="City" name="city" required />
                <Field label="State" name="state" required />
                <Field label="ZIP" name="zip" required />
              </div>
            </Section>

            {/* Payment method */}
            <Section title="Payment Method">
              <div className="grid sm:grid-cols-2 gap-3">
                <PayOption
                  active={method === "card"}
                  onClick={() => setMethod("card")}
                  icon={<CreditCard className="size-4" />}
                  label="Credit / Debit Card"
                  hint="Visa, Mastercard, Amex"
                />
                <PayOption
                  active={method === "apple"}
                  onClick={() => setMethod("apple")}
                  icon={<Apple className="size-4" />}
                  label="Apple Pay"
                  hint="Fast one-tap checkout"
                />
                <PayOption
                  active={method === "google"}
                  onClick={() => setMethod("google")}
                  icon={<Wallet className="size-4" />}
                  label="Google Pay"
                  hint="Pay with saved cards"
                />
                <PayOption
                  active={method === "affirm"}
                  onClick={() => setMethod("affirm")}
                  icon={<Lock className="size-4" />}
                  label="Affirm Financing"
                  hint="As low as $104 / mo"
                />
              </div>

              {method === "card" && (
                <div className="mt-6 space-y-4">
                  <Field label="Cardholder name" name="cardName" required />
                  <Field
                    label="Card number"
                    name="cardNumber"
                    placeholder="1234 1234 1234 1234"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry (MM/YY)" name="cardExp" placeholder="12/28" required />
                    <Field label="CVC" name="cardCvc" placeholder="123" required />
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Lock className="size-3" /> Payment processing goes live soon — no charge will be made.
                  </p>
                </div>
              )}
              {method !== "card" && (
                <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded text-sm text-slate-600">
                  You'll be redirected to complete payment with{" "}
                  <span className="font-bold text-navy">
                    {method === "apple" ? "Apple Pay" : method === "google" ? "Google Pay" : "Affirm"}
                  </span>{" "}
                  after placing the order.
                </div>
              )}
            </Section>
          </div>

          <aside className="bg-navy text-white p-8 shadow-lg sticky top-20">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold mb-4">
              Order Summary
            </div>
            <ul className="space-y-3 max-h-64 overflow-auto pr-2 -mr-2">
              {items.map((i) => (
                <li key={i.slug} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 shrink-0 bg-white/10 rounded overflow-hidden">
                    <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{i.name}</div>
                    <div className="text-xs text-slate-400">
                      Qty {i.quantity} · {formatUSD(i.unitPrice)}
                    </div>
                  </div>
                  <div className="font-bold">{formatUSD(i.unitPrice * i.quantity)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t border-white/10 space-y-2 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>{formatUSD(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Tax (est.)</span>
                <span>{formatUSD(tax)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Total
              </span>
              <span className="font-display font-black text-2xl">{formatUSD(total)}</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-white text-navy py-4 font-bold uppercase text-sm tracking-[0.2em] transition-colors disabled:opacity-60"
            >
              <Lock className="size-4" />
              {submitting ? "Placing Order…" : `Place Order · ${formatUSD(total)}`}
            </button>
            <p className="mt-3 text-[11px] text-white/50 text-center">
              Payment gateway integration coming soon.
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white shadow-sm border border-slate-200/60 p-6 md:p-8">
      <h2 className="font-display font-black uppercase text-lg text-navy tracking-tight mb-5">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
        {label}
      </span>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded border border-slate-200 bg-slate-50 focus:border-navy focus:bg-white outline-none transition-colors text-sm"
      />
    </label>
  );
}

function PayOption({
  active,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "text-left p-4 border-2 rounded transition-all " +
        (active
          ? "border-navy bg-navy/5"
          : "border-slate-200 hover:border-slate-300 bg-white")
      }
    >
      <div className="flex items-center gap-2 text-navy">
        <span className="text-gold">{icon}</span>
        <span className="font-bold text-sm">{label}</span>
      </div>
      <div className="text-xs text-slate-500 mt-1">{hint}</div>
    </button>
  );
}