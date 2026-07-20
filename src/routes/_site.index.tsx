import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Calendar,
  Gift,
  MapPin,
  Phone,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { mockPackages } from "@/data/mockPackages";
import { SectionHeading } from "@/components/site/SectionHeading";
import heroImage from "@/assets/mgm2-scaled.jpg";
import juniorGolferImage from "@/assets/MGMimage.jpg";

const achievements = [
  { icon: Calendar, value: "2021", label: "First MGM Junior Tour Event" },
  { icon: Users, value: "350+", label: "Junior Participants" },
  { icon: Trophy, value: "100+", label: "Tournament Round Hosted" },
  { icon: MapPin, value: "20+", label: "Tournament Locations" },
];

const programs = [
  {
    icon: Gift,
    title: "Total Junior Golf Package",
    body: "Providing everything needed for your junior, including merchandise, tournament play, practice, on-course rounds, PGA instruction, and much more!",
  },
  {
    icon: Award,
    title: "Junior Tour Membership",
    body: "Open to any junior who wants to have fun, make new friends, and play on the best courses golf has to offer!",
  },
];

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "MGM Junior Tour — Elite Junior Golf Tournaments" },
      { name: "description", content: "Competitive tournament experiences for junior golfers. Building character, resilience, and skills for life through elite competition." },
      { property: "og:title", content: "MGM Junior Tour" },
      { property: "og:description", content: "Competitive tournament experiences for junior golfers." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <img
          src={heroImage}
          alt="Clubhouse and putting green at sunset"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-navy/55 to-navy/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="max-w-2xl text-white">
            <h1 className="font-display font-black uppercase text-5xl md:text-7xl leading-[0.95] tracking-tight mb-6">
              Empowering
              <br />
              <span className="italic text-gold">Young Minds</span>
              <br />
              Through Golf
            </h1>
            <p className="text-xl text-slate-200 mb-10 max-w-lg leading-relaxed">
              The MGM Junior Tour is more than golf. We build character,
              resilience, and skills for life through competitive excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/schedule"
                className="bg-gold hover:bg-white text-navy px-8 py-4 font-bold uppercase tracking-wider text-sm rounded-sm inline-flex items-center gap-2 transition-all"
              >
                View 2026 Schedule
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/packages"
                className="bg-gold hover:bg-white text-navy px-8 py-4 font-bold uppercase tracking-wider text-sm rounded-sm inline-flex items-center gap-2 transition-all"
              >
                View Packages
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Beyond the Green */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Our Mission"
            title="Going Beyond The Green"
            subtitle="Championship-caliber events designed to develop the whole athlete — on the course and off."
          />
          <div className="grid md:grid-cols-3 gap-6 stagger">
            {[
              {
                icon: Trophy,
                title: "Total Game Growth",
                body: "Competitive tournaments and clinics that develop technical skill, mental fortitude, and course management.",
              },
              {
                icon: Users,
                title: "A Place To Belong",
                body: "A community of junior athletes who share a passion for the traditions and etiquette of the game.",
              },
              {
                icon: Sparkles,
                title: "Skills For Life",
                body: "Integrity, discipline, and sportsmanship — attributes that translate far beyond the 18th green.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white border border-slate-200 rounded-xl p-8 hover:border-gold hover-lift"
              >
                <div className="size-12 rounded-lg bg-navy text-gold grid place-items-center mb-6">
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

      {/* Achievements */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="// Let's Talk Numbers"
            title="Our Achievements"
            align="center"
            invert
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 stagger">
            {achievements.map((a) => (
              <div key={a.label} className="text-center">
                <div className="size-14 mx-auto rounded-full bg-white/10 text-gold grid place-items-center mb-4">
                  <a.icon className="size-6" />
                </div>
                <div className="font-display font-black text-4xl md:text-5xl text-white mb-2">
                  {a.value}
                </div>
                <div className="text-slate-300 text-sm uppercase tracking-wider">
                  {a.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find the best program */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative mb-12 lg:mb-0">
            <div className="rounded-xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[560px]">
              <img
                src={juniorGolferImage}
                alt="Golfer practicing their swing at the driving range"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 translate-y-1/2 left-6 right-6 sm:right-auto bg-navy/95 backdrop-blur-sm text-white rounded-lg p-5 flex items-center gap-3 shadow-xl">
              <div className="size-10 shrink-0 rounded-full bg-gold text-navy grid place-items-center">
                <Phone className="size-4" />
              </div>
              <div>
                <div className="text-xs text-slate-300 uppercase tracking-wider">
                  Call us anytime!
                </div>
                <a href="tel:+17753865594" className="font-bold text-gold hover:text-white">
                  (775) 386-5594
                </a>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              title="Find The Best Program For Your Junior"
              subtitle="From comprehensive training packages featuring PGA instruction and gear to exciting tour memberships focused on fun and competition, we provide the perfect pathway for every junior golfer to learn, play, and connect."
            />
            <ul className="space-y-6 mb-10">
              {programs.map((p) => (
                <li key={p.title} className="flex items-start gap-4">
                  <div className="size-11 shrink-0 rounded-full bg-navy text-gold grid place-items-center">
                    <p.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-navy mb-1">
                      {p.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/packages"
              className="bg-navy hover:bg-navy-light text-white px-8 py-4 font-bold uppercase tracking-wider text-sm rounded-sm inline-flex items-center gap-2 transition-all"
            >
              See What's Available
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Packages teaser */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-14">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                Membership
              </div>
              <h2 className="font-display font-black uppercase text-4xl md:text-5xl text-navy tracking-tight leading-tight">
                Choose Your Package
              </h2>
              <div className="h-1 w-20 bg-gold mt-5" />
            </div>
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 text-navy font-bold text-sm uppercase tracking-wider hover:text-gold"
            >
              Compare All Packages <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {mockPackages.map((p) => (
              <div
                key={p.slug}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col hover-lift hover:border-gold"
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2">
                  {p.callout}
                </div>
                <h3 className="font-display font-bold text-lg text-navy mb-2">
                  {p.name}
                </h3>
                <div className="text-3xl font-black text-navy mb-4">
                  {p.price}
                </div>
                <Link
                  to="/packages"
                  className="mt-auto text-sm font-bold uppercase tracking-wider text-navy hover:text-gold inline-flex items-center gap-1"
                >
                  Learn More <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display font-black uppercase text-4xl md:text-5xl tracking-tight mb-6">
            Ready to Tee It Up?
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
            Join a community of committed junior golfers competing on the region's premier courses. Registration for the 2026 season is open.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/join"
              className="bg-gold hover:bg-white text-navy px-8 py-4 font-bold uppercase tracking-wider text-sm rounded-sm inline-flex items-center gap-2 transition-all"
            >
              Join the Tour
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contact"
              className="border border-white/30 text-white hover:bg-white/10 px-8 py-4 font-bold uppercase tracking-wider text-sm rounded-sm transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}