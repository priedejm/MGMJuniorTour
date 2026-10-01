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

import courseAerial from "@/assets/course-aerial.jpg";
import heroCourse from "@/assets/hero-course.jpg";
import ballGreen from "@/assets/ball-green.jpg";
import mgm2Scaled from "@/assets/mgm2-scaled.jpg";

const CONTACT_PHONE = "(775) 386-5594";
const CONTACT_EMAIL = "info@morgangolfmanagement.com";
const ELIGIBILITY_NOTES = "9 & 18 hole divisions available for ages 8-13!";

export const tournamentContent: Record<string, Tournament> = {
  "janesville-glen-erin": {
    slug: "janesville-glen-erin",
    name: "Janesville at Glen Erin Golf Club",
    city: "Janesville, WI",
    state: "WI",
    course: "Glen Erin Golf Club",
    address: "1417 W Airport Rd, Janesville, WI 53546",
    heroImage: courseAerial,
    description:
      "Join us for the MGM Junior Tour Tournament at the beautiful Glen Erin Golf Club in Janesville, Wisconsin. This 36-hole event is open to boys and girls with age divisions of 8-13 and 14-18.",
    dates: "Saturday, September 19th – Sunday, September 20th",
    teeTime: "1:00 PM Tee Times",
    earlyDeadline: "August 19th, 2026",
    eligibility: {
      boys: "Boys: Ages 8-13; 14-18",
      girls: "Girls: Ages 8-13; 14-18",
      notes: ELIGIBILITY_NOTES,
    },
    pricing: [
      { period: "Before August 19, 2026 — Early Registration", memberPrice: "$295", nonMemberPrice: "$375" },
      { period: "After August 19, 2026", memberPrice: "$345", nonMemberPrice: "$415" },
    ],
    contactPhone: CONTACT_PHONE,
    contactEmail: CONTACT_EMAIL,
  },
  "hayward-golf-course": {
    slug: "hayward-golf-course",
    name: "Hayward at Hayward Golf Course",
    city: "Hayward, WI",
    state: "WI",
    course: "Hayward Golf Course",
    address: "16005 W Radio Hill Rd, Hayward, WI 54843",
    heroImage: ballGreen,
    description:
      "Join us for the MGM Junior Tour Tournament at Hayward Golf Course in Hayward, Wisconsin. This event is open to boys and girls with age divisions of 8-13 and 14-18.",
    dates: "Saturday, October 3rd – Sunday, October 4th",
    teeTime: "12:00 PM Tee Times",
    earlyDeadline: "September 3rd, 2026",
    eligibility: {
      boys: "Boys: Ages 8-13; 14-18",
      girls: "Girls: Ages 8-13; 14-18",
      notes: ELIGIBILITY_NOTES,
    },
    pricing: [
      { period: "Before September 3, 2026 — Early Registration", memberPrice: "$295", nonMemberPrice: "$375" },
      { period: "After September 3, 2026", memberPrice: "$345", nonMemberPrice: "$415" },
    ],
    contactPhone: CONTACT_PHONE,
    contactEmail: CONTACT_EMAIL,
  },
  "eagle-trace-golf-club": {
    slug: "eagle-trace-golf-club",
    name: "Coral Springs at Eagle Trace Golf Club",
    city: "Coral Springs, FL",
    state: "FL",
    course: "Eagle Trace Golf Club",
    address: "1111 Eagle Trace Blvd W, Coral Springs, FL 33071",
    heroImage: heroCourse,
    description:
      "Join us for the MGM Junior Tour Tournament at the beautiful Eagle Trace Golf Club in Coral Springs, Florida. This 36-hole event is open to boys and girls with age divisions of 8-13 and 14-18.",
    dates: "Saturday, October 10th – Sunday, October 11th",
    teeTime: "1:00 PM Tee Times",
    earlyDeadline: "September 10th, 2026",
    eligibility: {
      boys: "Boys: Ages 8-13; 14-18",
      girls: "Girls: Ages 8-13; 14-18",
      notes: ELIGIBILITY_NOTES,
    },
    pricing: [
      { period: "Before September 10, 2026 — Early Registration", memberPrice: "$375", nonMemberPrice: "$455" },
      { period: "After September 10, 2026", memberPrice: "$425", nonMemberPrice: "$495" },
    ],
    contactPhone: CONTACT_PHONE,
    contactEmail: CONTACT_EMAIL,
  },
  "the-club-at-emerald-hills": {
    slug: "the-club-at-emerald-hills",
    name: "Hollywood at The Club at Emerald Hills",
    city: "Hollywood, FL",
    state: "FL",
    course: "The Club at Emerald Hills",
    address: "4100 N Hills Dr, Hollywood, FL 33021",
    heroImage: mgm2Scaled,
    description:
      "Join us for the MGM Junior Tour Tournament at the beautiful The Club at Emerald Hills in Hollywood, Florida. This event is open to boys and girls with age divisions of 8-13 and 14-18.",
    dates: "Saturday, September 17th – Sunday, September 18th",
    teeTime: "1:00 PM Tee Times",
    earlyDeadline: "September 17th, 2026",
    eligibility: {
      boys: "Boys: Ages 8-13; 14-18",
      girls: "Girls: Ages 8-13; 14-18",
      notes: ELIGIBILITY_NOTES,
    },
    pricing: [
      { period: "Before September 17, 2026 — Early Registration", memberPrice: "$325", nonMemberPrice: "$405" },
      { period: "After September 17, 2026", memberPrice: "$375", nonMemberPrice: "$455" },
    ],
    contactPhone: CONTACT_PHONE,
    contactEmail: CONTACT_EMAIL,
  },
  "memorial-park-gc": {
    slug: "memorial-park-gc",
    name: "Houston at Memorial Park Golf Course",
    city: "Houston, TX",
    state: "TX",
    course: "Memorial Park Golf Course",
    address: "1001 E Memorial Loop Dr, Houston, TX 77007",
    heroImage: heroCourse,
    description:
      "Join us for the MGM Junior Tour Tournament at the beautiful Memorial Park Golf Course in Houston, Texas. This event is open to boys and girls with age divisions of 8-13 and 14-18.",
    dates: "Saturday, December 12th – Sunday, December 13th",
    teeTime: "7:20 AM Tee Times",
    earlyDeadline: "November 12th, 2026",
    eligibility: {
      boys: "Boys: Ages 8-13; 14-18",
      girls: "Girls: Ages 8-13; 14-18",
      notes: ELIGIBILITY_NOTES,
    },
    pricing: [
      { period: "Before November 12, 2026 — Early Registration", memberPrice: "$325", nonMemberPrice: "$405" },
      { period: "After November 12, 2026", memberPrice: "$375", nonMemberPrice: "$455" },
    ],
    contactPhone: CONTACT_PHONE,
    contactEmail: CONTACT_EMAIL,
  },
  "pawleys-island": {
    slug: "pawleys-island",
    name: "Pawley's Island at True Blue GC & Caledonia Golf & Fish Club",
    city: "Pawleys Island, SC",
    state: "SC",
    course: "True Blue Golf Club / Caledonia Golf & Fish Club",
    address: "Sat: True Blue GC, 900 Blue Stem Dr — Sun: Caledonia Golf & Fish Club, 369 Caledonia Dr, Pawleys Island, SC 29585",
    heroImage: ballGreen,
    description:
      "Join us for the MGM Junior Tour Tournament at True Blue Golf Club and Caledonia Golf & Fish Club in Pawleys Island, South Carolina. This event is open to boys and girls with age divisions of 8-13 and 14-18.",
    dates: "Saturday, January 30th – Sunday, January 31st",
    teeTime: "11:15 AM Tee Times",
    earlyDeadline: "December 30th, 2026",
    eligibility: {
      boys: "Boys: Ages 8-13; 14-18",
      girls: "Girls: Ages 8-13; 14-18",
      notes: ELIGIBILITY_NOTES,
    },
    pricing: [
      { period: "Before December 30, 2026 — Early Registration", memberPrice: "$395", nonMemberPrice: "$475" },
      { period: "After December 30, 2026", memberPrice: "$445", nonMemberPrice: "$515" },
    ],
    contactPhone: CONTACT_PHONE,
    contactEmail: CONTACT_EMAIL,
  },
  "talking-stick-golf-club": {
    slug: "talking-stick-golf-club",
    name: "Scottsdale at Talking Stick Golf Club",
    city: "Scottsdale, AZ",
    state: "AZ",
    course: "Talking Stick Golf Club — Piipaash Course",
    address: "9998 E Talking Stick Wy, Scottsdale, AZ 85256",
    heroImage: mgm2Scaled,
    description:
      "Join us for the MGM Junior Tour Tournament at the beautiful Talking Stick Golf Club in Scottsdale, Arizona. This event is open to boys and girls with age divisions of 8-13 and 14-18.",
    dates: "Saturday, June 5th – Sunday, June 6th, 2027",
    teeTime: "11:00 AM Tee Times",
    earlyDeadline: "May 5th, 2027",
    eligibility: {
      boys: "Boys: Ages 8-13; 14-18",
      girls: "Girls: Ages 8-13; 14-18",
      notes: ELIGIBILITY_NOTES,
    },
    pricing: [
      { period: "Before May 4, 2027 — Early Registration", memberPrice: "$325", nonMemberPrice: "$405" },
      { period: "After May 4, 2027", memberPrice: "$375", nonMemberPrice: "$455" },
    ],
    contactPhone: CONTACT_PHONE,
    contactEmail: CONTACT_EMAIL,
  },
  "papago-golf-club": {
    slug: "papago-golf-club",
    name: "Phoenix at Papago Golf Club",
    city: "Phoenix, AZ",
    state: "AZ",
    course: "Papago Golf Club",
    address: "5595 E Karsten Wy, Phoenix, AZ 85008",
    heroImage: courseAerial,
    description:
      "Join us for the MGM Junior Tour Tournament at the beautiful Papago Golf Club in Phoenix, Arizona. This event is open to boys and girls with age divisions of 8-13 and 14-18.",
    dates: "Saturday, July 24th – Sunday, July 25th, 2027",
    teeTime: "7:00 AM Tee Times — Double Tee Times (1 & 10)",
    earlyDeadline: "June 24th, 2027",
    eligibility: {
      boys: "Boys: Ages 8-13; 14-18",
      girls: "Girls: Ages 8-13; 14-18",
      notes: ELIGIBILITY_NOTES,
    },
    pricing: [
      { period: "Before June 24, 2027 — Early Registration", memberPrice: "$325", nonMemberPrice: "$405" },
      { period: "After June 24, 2027", memberPrice: "$375", nonMemberPrice: "$455" },
    ],
    contactPhone: CONTACT_PHONE,
    contactEmail: CONTACT_EMAIL,
  },
};

export const getTournamentBySlug = (slug: string): Tournament | undefined =>
  tournamentContent[slug];
