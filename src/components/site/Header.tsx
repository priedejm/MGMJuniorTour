import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

const links = [
  { to: "/schedule", label: "Schedule" },
  { to: "/packages", label: "Packages" },
  { to: "/archive", label: "Results" },
  { to: "/photos", label: "Photos" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  return (
    <nav className="sticky top-0 z-50 bg-navy text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-10 bg-gold rounded-full grid place-items-center text-navy font-bold text-xs tracking-tight">
            MGM
          </div>
          <span className="font-display font-bold tracking-tight text-lg hidden sm:inline">
            JUNIOR TOUR
          </span>
        </Link>
        <div className="hidden md:flex gap-7 text-sm font-medium uppercase tracking-wider">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative py-1 text-white/80 hover:text-gold transition-colors after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-gold after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100"
              activeProps={{
                className:
                  "text-gold after:scale-x-100 after:origin-center",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative p-2 text-white/80 hover:text-gold transition-colors"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-gold text-navy text-[10px] font-bold grid place-items-center px-1">
                {count}
              </span>
            )}
          </Link>
          <Link
            to="/join"
            className="hidden sm:inline-flex bg-gold hover:bg-white text-navy px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
          >
            Join Tour
          </Link>
          <button
            type="button"
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-navy px-6 py-4 flex flex-col gap-3 animate-fade-in">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-sm font-medium uppercase tracking-wider text-white/80 hover:text-gold border-l-2 border-transparent pl-3 transition-all"
              activeProps={{
                className: "text-gold border-gold bg-white/5",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/join"
            onClick={() => setOpen(false)}
            className="mt-2 bg-gold text-navy px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-center"
          >
            Join Tour
          </Link>
        </div>
      )}
    </nav>
  );
}