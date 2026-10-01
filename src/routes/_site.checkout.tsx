import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import { formatUSD, useCart } from "@/lib/cart";
import { apiPost } from "@/lib/api-client";

export const Route = createFileRoute("/_site/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — MGM Junior Tour" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal } = useCart();
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

  const onCheckout = async () => {
    setSubmitting(true);
    try {
      const res = await apiPost<{ ok: true; url: string | null }>(
        "/create-checkout-session.php",
        {
          items: items.map((i) =>
            i.type === "tournament"
              ? {
                  type: "tournament",
                  tournamentSlug: i.tournamentSlug,
                  periodIndex: i.periodIndex,
                  priceType: i.priceType,
                  quantity: i.quantity,
                }
              : { slug: i.slug, quantity: i.quantity },
          ),
        },
      );
      if (!res.url) throw new Error("Could not start checkout — please try again.");
      window.location.href = res.url;
    } catch (e: unknown) {
      toast.error((e as Error).message || "Could not start checkout");
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-cream min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-navy/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Cart
        </Link>
        <h1 className="font-display font-black uppercase text-4xl md:text-5xl text-navy tracking-tight mt-4">
          Checkout
        </h1>
        <div className="h-1 w-20 bg-gold mt-4" />

        <div className="mt-12 grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white shadow-sm border border-slate-200/60 p-6 md:p-8">
            <h2 className="font-display font-black uppercase text-lg text-navy tracking-tight mb-5">
              Order Summary
            </h2>
            <ul className="space-y-4 divide-y divide-slate-100">
              {items.map((i) => (
                <li key={i.slug} className="flex gap-4 pt-4 first:pt-0">
                  <div className="w-16 h-16 shrink-0 bg-slate-100 rounded overflow-hidden">
                    <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-navy">{i.name}</div>
                    <div className="text-xs text-slate-500">
                      Qty {i.quantity} · {formatUSD(i.unitPrice)} each
                    </div>
                  </div>
                  <div className="font-bold text-navy">
                    {formatUSD(i.unitPrice * i.quantity)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded flex items-start gap-3 text-sm text-slate-600">
              <ShieldCheck className="size-5 text-navy shrink-0 mt-0.5" />
              <p>
                You'll enter your contact, shipping, and payment details on Stripe's secure checkout page — we never see or store your card information.
              </p>
            </div>
          </div>

          <aside className="bg-navy text-white p-8 shadow-lg sticky top-20">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 mb-4">
              Total Due
            </div>
            <div className="text-4xl font-black mb-6">{formatUSD(subtotal)}</div>
            <button
              type="button"
              onClick={onCheckout}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-navy-light text-navy hover:text-white py-4 font-bold uppercase text-sm tracking-wide transition-colors disabled:opacity-60"
            >
              <Lock className="size-4 shrink-0" />
              <span>{submitting ? "Redirecting…" : "Continue to Payment"}</span>
            </button>
            <p className="mt-3 text-[11px] text-white/50 text-center">
              Secure payment powered by Stripe.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
