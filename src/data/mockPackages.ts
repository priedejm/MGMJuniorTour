export type Package = {
  slug: string;
  name: string;
  price: string;
  callout: string;
  image: string;
  features: string[];
  featured?: boolean;
  description: string;
  included: { label: string; note?: string }[];
  bonuses: string[];
  totalValue: string;
  disclaimer?: string;
};

import courseAerial from "@/assets/course-aerial.jpg";
import ballGreen from "@/assets/ball-green.jpg";
import juniorGolfer from "@/assets/junior-golfer.jpg";
import juniorGirl from "@/assets/junior-girl.jpg";

export const mockPackages: Package[] = [
  {
    slug: "deluxe",
    name: "Deluxe Package",
    price: "$3,995",
    callout: "Best Value",
    image: courseAerial,
    features: [
      "Full Season Tournament Access (12+ events)",
      "Premium Equipment Kit & Tour Bag",
      "Custom Club Fitting Session",
      "Complete MGM Tour Apparel Package",
      "Priority Tee Time Selection",
      "Player Development Clinics",
    ],
    description:
      "Our flagship all-inclusive experience. Everything your junior golfer needs to compete, train, and grow across a full competitive season — plus premium gear and player development perks.",
    included: [
      { label: "MGM Junior Tour entry fee credit - $3,000", note: "No expiration date*" },
      { label: "MGM Winter Junior Tour season entry fee credit - $1,500", note: "No expiration date*" },
      { label: "MGM Junior Tour One-Year Exclusive Membership" },
      { label: "Custom Club Fitting Session ($750 VALUE)" },
      { label: "Access to PGA Professional instruction and educational videos ($5,000 VALUE)" },
    ],
    bonuses: [
      "$1,000 Dick's Sporting Goods Gift Card",
      "$750 Go Play Golf Gift Card",
      "$500 VISA Gift Card",
      "Complete MGM Tour Apparel Package",
    ],
    totalValue: "Over $13,000 Value!",
    disclaimer:
      "The gift cards included above are from Morgan Golf Management. Both Morgan Golf Management and MGM Jr. Tour are not affiliated with Dick's Sporting Goods or Go Play Golf.",
  },
  {
    slug: "standard",
    name: "Standard Package",
    price: "$2,995",
    callout: "Most Popular",
    featured: true,
    image: juniorGolfer,
    features: [
      "8 Tournament Entries per Season",
      "Official MGM Tour Bag",
      "Exclusive Player Polo & Hat",
      "Priority Registration Window",
      "Digital Player Profile & Stats",
    ],
    description:
      "Available with low-cost financing! This all-in-one, never-before-offered in golf package, is the perfect gift for the junior golfer in your family. Providing everything needed for your junior, including merchandise, tournament play, practice, on-course rounds, PGA instruction, and much more, giving them all the tools they need to reach their full potential!",
    included: [
      { label: "MGM Junior Tour entry fee credit - $2,500", note: "No expiration date*" },
      { label: "MGM Winter Junior Tour season entry fee credit - $1,000", note: "No expiration date*" },
      { label: "MGM Junior Tour One-Year Exclusive Membership" },
      { label: "Access to PGA Professional instruction and educational videos ($5,000 VALUE)" },
    ],
    bonuses: [
      "$750 Dick's Sporting Goods Gift Card",
      "$500 Go Play Golf Gift Card",
      "$250 VISA Gift Card",
    ],
    totalValue: "Over $10,000 Value!",
    disclaimer:
      "The gift cards included above are from Morgan Golf Management. Both Morgan Golf Management and MGM Jr. Tour are not affiliated with Dick's Sporting Goods or Go Play Golf.",
  },
  {
    slug: "starter",
    name: "Starter Package",
    price: "$1,995",
    callout: "Rising Player",
    image: juniorGirl,
    features: [
      "5 Regional Tournament Entries",
      "MGM Welcome Kit",
      "Skill Assessment Session",
      "Standard Tour Gear",
    ],
    description:
      "A perfect entry point for the rising junior. Get on the tour, get official gear, and get real competitive reps under your belt.",
    included: [
      { label: "MGM Junior Tour entry fee credit - $1,500", note: "No expiration date*" },
      { label: "MGM Junior Tour One-Year Exclusive Membership" },
      { label: "Skill Assessment Session with a PGA Professional ($300 VALUE)" },
      { label: "Access to PGA Professional instruction and educational videos ($5,000 VALUE)" },
    ],
    bonuses: [
      "$300 Dick's Sporting Goods Gift Card",
      "$200 Go Play Golf Gift Card",
      "MGM Welcome Kit",
    ],
    totalValue: "Over $7,500 Value!",
    disclaimer:
      "The gift cards included above are from Morgan Golf Management. Both Morgan Golf Management and MGM Jr. Tour are not affiliated with Dick's Sporting Goods or Go Play Golf.",
  },
  {
    slug: "jr-tour-club",
    name: "Jr. Tour Club",
    price: "$99",
    callout: "Annual Access",
    image: ballGreen,
    features: [
      "Annual Membership",
      "Pay-Per-Event Registration",
      "Access to Member Rates",
      "Newsletter & Ranking Updates",
    ],
    description:
      "The most affordable way to join the tour. Pay only for the events you play while enjoying member-only pricing and updates all season.",
    included: [
      { label: "MGM Junior Tour One-Year Membership" },
      { label: "Pay-Per-Event Tournament Registration at Member Rates" },
      { label: "Access to PGA Professional educational video library ($1,000 VALUE)" },
      { label: "Season Newsletter & Ranking Updates" },
    ],
    bonuses: [
      "$50 Go Play Golf Gift Card",
      "MGM Junior Tour Member Hat",
    ],
    totalValue: "Over $1,200 Value!",
    disclaimer:
      "The gift cards included above are from Morgan Golf Management. Morgan Golf Management and MGM Jr. Tour are not affiliated with Go Play Golf.",
  },
];