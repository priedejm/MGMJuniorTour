export type TournamentPricingRow = {
  period: string;
  memberPrice: string;
  nonMemberPrice: string;
};

export type Tournament = {
  slug: string;
  name: string;
  city: string;
  state: string;
  course: string;
  address: string;
  heroImage: string;
  description: string;
  dates: string;
  teeTime: string;
  earlyDeadline: string;
  eligibility: {
    boys: string;
    girls: string;
    notes: string;
  };
  pricing: TournamentPricingRow[];
  contactPhone: string;
  contactEmail: string;
};

import heroCourse from "@/assets/hero-course.jpg";
import courseAerial from "@/assets/course-aerial.jpg";
import ballGreen from "@/assets/ball-green.jpg";

export const mockTournaments: Record<string, Tournament> = {
  "coral-springs-eagle-trace": {
    slug: "coral-springs-eagle-trace",
    name: "Coral Springs Championship",
    city: "Coral Springs, FL",
    state: "FL",
    course: "Eagle Trace Golf Club",
    address: "1111 Eagle Trace Blvd, Coral Springs, FL 33071",
    heroImage: heroCourse,
    description:
      "A premier 36-hole individual stroke play event at the historic Eagle Trace Golf Club, a former PGA Tour venue. Features challenging water hazards and championship-caliber conditions across boys and girls age divisions.",
    dates: "July 12 – 13, 2026",
    teeTime: "First tee time 8:00 AM EST — Double tee start",
    earlyDeadline: "June 15, 2026",
    eligibility: {
      boys: "Boys ages 11–18",
      girls: "Girls ages 11–18",
      notes: "9-hole division available for ages 11–12. 18-hole division for ages 13–18.",
    },
    pricing: [
      { period: "Early Registration (before June 15)", memberPrice: "$185", nonMemberPrice: "$235" },
      { period: "Standard Registration (June 16 – July 5)", memberPrice: "$215", nonMemberPrice: "$265" },
      { period: "Late Registration (after July 5)", memberPrice: "$245", nonMemberPrice: "$295" },
    ],
    contactPhone: "(775) 386-5594",
    contactEmail: "info@mgmjuniortour.com",
  },
  "janesville-glen-erin": {
    slug: "janesville-glen-erin",
    name: "Midwest Junior Open",
    city: "Janesville, WI",
    state: "WI",
    course: "Glen Erin Golf Club",
    address: "1417 Highway 14, Janesville, WI 53545",
    heroImage: courseAerial,
    description:
      "A two-day 36-hole tournament at Glen Erin, one of Wisconsin's most respected public courses. Rolling terrain and undulating greens provide an excellent competitive test for developing junior players.",
    dates: "July 24 – 25, 2026",
    teeTime: "First tee time 7:30 AM CST",
    earlyDeadline: "July 1, 2026",
    eligibility: {
      boys: "Boys ages 10–18",
      girls: "Girls ages 10–18",
      notes: "9-hole and 18-hole divisions available. Age divisions by birth year as of tournament date.",
    },
    pricing: [
      { period: "Early Registration (before July 1)", memberPrice: "$165", nonMemberPrice: "$215" },
      { period: "Standard Registration (after July 1)", memberPrice: "$195", nonMemberPrice: "$245" },
    ],
    contactPhone: "(775) 386-5594",
    contactEmail: "info@mgmjuniortour.com",
  },
  "hayward-big-fish": {
    slug: "hayward-big-fish",
    name: "Northwoods Invitational",
    city: "Hayward, WI",
    state: "WI",
    course: "Big Fish Golf Club",
    address: "14122 Larsen Rd, Hayward, WI 54843",
    heroImage: ballGreen,
    description:
      "A signature stop on the MGM Junior Tour set on Pete Dye's celebrated Big Fish design. This 36-hole event challenges players with pristine northwoods conditions and dramatic elevation changes.",
    dates: "August 5 – 6, 2026",
    teeTime: "First tee time 9:00 AM CST",
    earlyDeadline: "July 15, 2026",
    eligibility: {
      boys: "Boys ages 12–18",
      girls: "Girls ages 12–18",
      notes: "18-hole division only. Handicap of 25 or lower recommended.",
    },
    pricing: [
      { period: "Early Registration (before July 15)", memberPrice: "$195", nonMemberPrice: "$245" },
      { period: "Standard Registration (after July 15)", memberPrice: "$225", nonMemberPrice: "$275" },
    ],
    contactPhone: "(775) 386-5594",
    contactEmail: "info@mgmjuniortour.com",
  },
};

export const getTournamentBySlug = (slug: string): Tournament | undefined =>
  mockTournaments[slug];