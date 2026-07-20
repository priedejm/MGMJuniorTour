import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-14">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-5">
            <div className="size-9 bg-navy rounded-full grid place-items-center text-white text-[10px] font-bold">
              MGM
            </div>
            <span className="font-display font-bold tracking-tight text-lg text-navy">
              MGM JUNIOR TOUR
            </span>
          </Link>
          <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
            Providing opportunities for young golfers to compete and grow through
            elite tournament experiences since 2012.
          </p>
          <div className="flex gap-3">
            <a href="#" className="size-10 bg-slate-100 hover:bg-navy hover:text-white text-navy rounded-full grid place-items-center transition-colors">
              <Facebook className="size-4" />
            </a>
            <a href="#" className="size-10 bg-slate-100 hover:bg-navy hover:text-white text-navy rounded-full grid place-items-center transition-colors">
              <Instagram className="size-4" />
            </a>
            <a href="#" className="size-10 bg-slate-100 hover:bg-navy hover:text-white text-navy rounded-full grid place-items-center transition-colors">
              <Youtube className="size-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-navy mb-5 text-sm uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li><Link to="/schedule" className="hover:text-gold">Tournament Schedule</Link></li>
            <li><Link to="/packages" className="hover:text-gold">Membership Tiers</Link></li>
            <li><Link to="/photos" className="hover:text-gold">Photo Gallery</Link></li>
            <li><Link to="/archive" className="hover:text-gold">Results Archive</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-navy mb-5 text-sm uppercase tracking-wider">
            Support
          </h4>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li><Link to="/contact" className="hover:text-gold">Contact Us</Link></li>
            <li><Link to="/about" className="hover:text-gold">About the Tour</Link></li>
            <li><Link to="/join" className="hover:text-gold">Join Mailing List</Link></li>
            <li><a href="#" className="hover:text-gold">Parent Resources</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} MGM Junior Tour. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <p className="uppercase tracking-widest">Built for Excellence</p>
        </div>
      </div>
    </footer>
  );
}