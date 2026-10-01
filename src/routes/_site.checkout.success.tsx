import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/_site/checkout/success")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — MGM Junior Tour" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  const { clear } = useCart();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(new URLSearchParams(window.location.search).get("session_id"));
    // Payment is confirmed server-side by Stripe's webhook — clearing the
    // cart here is just tidying up the browser now that checkout is done.
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-24">
      <div className="max-w-lg mx-auto px-6 text-center">
        <div className="size-16 mx-auto rounded-full bg-navy text-white grid place-items-center mb-6">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="font-display font-black uppercase text-3xl md:text-4xl text-navy tracking-tight mb-4">
          Order Confirmed
        </h1>
        <p className="text-slate-600 leading-relaxed">
          Thanks for your purchase! A confirmation has been sent to your email. Our team will follow up with next steps for your junior golfer.
        </p>
        {sessionId && (
          <p className="mt-4 text-xs text-slate-400 break-all">
            Reference: {sessionId}
          </p>
        )}
        <Link
          to="/"
          className="inline-block mt-8 bg-navy hover:bg-navy-light text-white px-8 py-4 font-bold uppercase text-sm tracking-[0.2em] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
