import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { formatUSD, useCart } from "@/lib/cart";

export const Route = createFileRoute("/_site/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — MGM Junior Tour" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="size-16 mx-auto rounded-full bg-navy text-gold grid place-items-center mb-6">
            <ShoppingBag className="size-7" />
          </div>
          <h1 className="font-display font-black uppercase text-4xl text-navy tracking-tight">
            Your Cart Is Empty
          </h1>
          <p className="mt-4 text-slate-600">
            Browse our junior golf packages and add one to get started.
          </p>
          <Link
            to="/packages"
            className="inline-block mt-8 bg-navy hover:bg-navy-light text-white px-8 py-4 font-bold uppercase text-sm tracking-[0.2em] transition-colors"
          >
            View Packages
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-cream min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
          Your Cart
        </div>
        <h1 className="font-display font-black uppercase text-4xl md:text-5xl text-navy tracking-tight">
          Review Your Order
        </h1>
        <div className="h-1 w-20 bg-gold mt-4" />

        <div className="mt-12 grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white shadow-sm border border-slate-200/60 divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.slug} className="p-5 md:p-6 flex gap-5">
                <Link
                  to="/packages/$slug"
                  params={{ slug: item.slug }}
                  className="w-24 h-24 md:w-28 md:h-28 shrink-0 bg-slate-100 overflow-hidden rounded"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 flex flex-col">
                  <Link
                    to="/packages/$slug"
                    params={{ slug: item.slug }}
                    className="font-display font-bold text-navy hover:text-gold transition-colors leading-tight"
                  >
                    {item.name}
                  </Link>
                  <div className="text-sm text-slate-500 mt-1">{item.price} each</div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="inline-flex items-center border border-slate-200 rounded">
                      <button
                        onClick={() => setQuantity(item.slug, item.quantity - 1)}
                        className="px-3 py-2 text-slate-500 hover:text-navy hover:bg-slate-50"
                        aria-label="Decrease"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <div className="px-4 text-sm font-bold text-navy min-w-[2ch] text-center">
                        {item.quantity}
                      </div>
                      <button
                        onClick={() => setQuantity(item.slug, item.quantity + 1)}
                        className="px-3 py-2 text-slate-500 hover:text-navy hover:bg-slate-50"
                        aria-label="Increase"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-bold text-navy">
                        {formatUSD(item.unitPrice * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeItem(item.slug)}
                        aria-label="Remove"
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-navy text-white p-8 shadow-lg sticky top-20">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold mb-4">
              Order Summary
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>{formatUSD(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t border-white/10 mt-5 pt-5 flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Total
              </span>
              <span className="font-display font-black text-2xl">
                {formatUSD(subtotal)}
              </span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-white text-navy py-4 font-bold uppercase text-sm tracking-[0.2em] transition-colors"
            >
              Checkout <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/packages"
              className="mt-3 block text-center text-xs font-bold uppercase tracking-[0.2em] text-white/60 hover:text-gold transition-colors"
            >
              ← Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}