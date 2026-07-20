import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Trophy, Users, Sparkles, Check } from "lucide-react";
import { recentTournamentLocations } from "@/data/mockGallery";

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
  "Professionally-run tournaments across premier regional courses",
  "Age-appropriate divisions for boys and girls, 9-hole and 18-hole formats",
  "Player development clinics and mentorship from PGA Professionals",
  "Official handicap tracking and season-long ranking points",
  "Exclusive member benefits, apparel, and equipment partnerships",
  "Family-friendly community events and awards ceremonies",
];

function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeading
            eyebrow="About the Tour"
            title="Empowering Young Minds Through Golf"
            subtitle="Since 2012, the MGM Junior Tour has provided junior golfers with a professional tournament experience — teaching character, resilience, and skills that carry far beyond the course."
          />
          <ul className="grid md:grid-cols-2 gap-4 mt-4 stagger">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-lg p-4 hover-lift hover:border-gold"
              >
                <div className="size-6 rounded-full bg-gold text-navy grid place-items-center shrink-0 mt-0.5">
                  <Check className="size-3.5" strokeWidth={3} />
                </div>
                <span className="text-slate-700 leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Beyond the Green */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Beyond The Green"
            title="Going Beyond The Green"
            subtitle="Three pillars shape everything we do on and off the course."
          />
          <div className="grid md:grid-cols-3 gap-6 stagger">
            {[
              {
                icon: Trophy,
                title: "Total Game Growth",
                body: "Competitive tournaments, clinics, and post-round analysis that address technical skill, mental fortitude, and course management.",
              },
              {
                icon: Users,
                title: "A Place To Belong",
                body: "A community of athletes and families sharing a passion for the traditions and etiquette of the game.",
              },
              {
                icon: Sparkles,
                title: "Skills For Life",
                body: "Integrity, discipline, and sportsmanship — attributes that translate to school, career, and beyond.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white border border-slate-200 rounded-xl p-8 hover-lift hover:border-gold"
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

      {/* Recent Tournament Locations */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            eyebrow="Where We Play"
            title="Some Of Our Recent Tournament Locations"
          />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 stagger">
            {recentTournamentLocations.map((loc) => (
              <div
                key={loc.name}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 hover-lift"
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-bold uppercase tracking-wider">
                  {loc.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}