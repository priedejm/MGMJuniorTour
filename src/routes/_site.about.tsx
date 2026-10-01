import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Trophy, Users, Sparkles, ArrowRight } from "lucide-react";
import { recentTournamentLocations } from "@/data/siteContent";
import trophyImage from "@/assets/trophyImage.png";
import aboutHeroImage from "@/assets/REINAANDTONYF.png";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About — MGM Junior Tour" },
      { name: "description", content: "Learn about the MGM Junior Tour's mission to empower young minds through competitive golf." },
      { property: "og:title", content: "About MGM Junior Tour" },
      { property: "og:description", content: "Our mission: empowering young minds through golf." },
    ],
  }),
  component: AboutPage,
});

const features = [
  "Offer year-round competitive play, including unique indoor off-season tournaments",
  "Open to all skill levels, from beginners to college-bound athletes",
  "Features a fast-paced format with 18-hole rounds in under 4.5 hours.",
  "Provides an all-inclusive \"Total Golf Package\" covering equipment, fees, and instruction",
  "Hosted at premier facilities, including current PGA Tour sites.",
];

function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
              // About Us
            </div>
            <h1 className="font-display font-black uppercase text-white text-4xl md:text-5xl tracking-tight leading-tight mb-4">
              About The Tour
            </h1>
            <p className="text-slate-300 leading-relaxed">
              Founded to give junior golfers more places to compete, grow, and belong — on and off the course.
            </p>
          </div>
          <img
            src={aboutHeroImage}
            alt="The MGM Junior Tour team on the course"
            className="rounded-2xl w-full max-w-md md:ml-auto h-auto shadow-2xl"
          />
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <img
            src={trophyImage}
            alt="MGM Junior Tour championship trophies"
            className="rounded-2xl w-full h-full object-cover shadow-lg"
          />
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
              // Our Mission
            </div>
            <h2 className="font-display font-black uppercase text-4xl md:text-5xl text-navy tracking-tight leading-tight mb-6">
              Empowering Young Minds Through Golf
            </h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              The MGM Junior Tour was created to provide more tournament opportunities for youth golf in America. This junior tour is the only developmental tour of its kind in the country. Our unique scoring format, points system and internal tournament operations allow the juniors to play an 18-hole round of golf in 4 1/2 hours or less, a pace unmatched anywhere in tournament golf today.
            </p>
            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-1.5 size-3 rounded-full border-2 border-gold shrink-0" />
                  <span className="text-slate-700 leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-colors"
            >
              Contact Us <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Beyond the Green */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Our Purpose"
            title="Going Beyond The Green"
          />
          <div className="grid md:grid-cols-3 gap-6 stagger">
            {[
              {
                icon: Trophy,
                title: "Total Game Growth",
                body: "PGA Professional Programs and competitive tournaments for Junior Development.",
              },
              {
                icon: Users,
                title: "A Place To Belong",
                body: "A supportive environment where every young golfer can thrive.",
              },
              {
                icon: Sparkles,
                title: "Skills For Life",
                body: "Inspiring confidence, integrity and sportsmanship alongside core golf skills.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white border border-slate-200 rounded-xl p-8 hover-lift hover:border-gold"
              >
                <div className="size-12 rounded-lg bg-navy text-white grid place-items-center mb-6">
                  <c.icon className="size-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-navy mb-3">
                  {c.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Tournament Locations */}
      <section className="py-24 bg-navy">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Where The Action Is"
            title="Some Of Our Recent Tournament Locations"
            align="center"
            invert
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
            {recentTournamentLocations.map((loc) => (
              <div
                key={loc.venue}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 hover-lift"
              >
                <img
                  src={loc.image}
                  alt={loc.venue}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <div className="text-xs font-medium">{loc.city}</div>
                  <div className="text-sm font-bold uppercase tracking-wider">{loc.venue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
