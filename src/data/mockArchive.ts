export type ArchiveEntry = {
  id: string;
  tournament_name: string;
  date: string; // ISO
  location: string;
  results_url?: string;
  year: number;
  month: string;
  images: string[];
};

import heroCourse from "@/assets/hero-course.jpg";
import courseAerial from "@/assets/course-aerial.jpg";
import ballGreen from "@/assets/ball-green.jpg";
import juniorGolfer from "@/assets/junior-golfer.jpg";
import juniorGirl from "@/assets/junior-girl.jpg";
import trophy from "@/assets/trophy.jpg";

const pool = [heroCourse, courseAerial, ballGreen, juniorGolfer, juniorGirl, trophy];
let _i = 0;
const img = (_seed?: string) => pool[_i++ % pool.length];

export const mockArchive: ArchiveEntry[] = [
  {
    id: "a1",
    tournament_name: "Spring Classic at Eagle Trace",
    date: "2025-04-12",
    location: "Coral Springs, FL",
    year: 2025,
    month: "April",
    images: [
      img("photo-1587174486073-ae5e5cff23aa"),
      img("photo-1592919505780-303950717480"),
      img("photo-1587381420270-3e1a5b9e6904"),
      img("photo-1535131749006-b7f58c99034b"),
    ],
  },
  {
    id: "a2",
    tournament_name: "Summer Junior Open",
    date: "2025-07-19",
    location: "Janesville, WI",
    year: 2025,
    month: "July",
    images: [
      img("photo-1600881333168-2ef49b341f30"),
      img("photo-1587174486073-ae5e5cff23aa"),
      img("photo-1587381420270-3e1a5b9e6904"),
    ],
  },
  {
    id: "a3",
    tournament_name: "Northwoods Invitational",
    date: "2025-08-08",
    location: "Hayward, WI",
    year: 2025,
    month: "August",
    images: [
      img("photo-1592919505780-303950717480"),
      img("photo-1535131749006-b7f58c99034b"),
      img("photo-1600881333168-2ef49b341f30"),
    ],
  },
  {
    id: "a4",
    tournament_name: "Fall Championship Series",
    date: "2025-09-27",
    location: "Naples, FL",
    year: 2025,
    month: "September",
    images: [
      img("photo-1587381420270-3e1a5b9e6904"),
      img("photo-1592919505780-303950717480"),
      img("photo-1587174486073-ae5e5cff23aa"),
      img("photo-1535131749006-b7f58c99034b"),
    ],
  },
  {
    id: "a5",
    tournament_name: "Winter Junior Classic",
    date: "2024-12-14",
    location: "West Palm Beach, FL",
    year: 2024,
    month: "December",
    images: [
      img("photo-1535131749006-b7f58c99034b"),
      img("photo-1600881333168-2ef49b341f30"),
      img("photo-1587381420270-3e1a5b9e6904"),
    ],
  },
  {
    id: "a6",
    tournament_name: "MGM Fall Finals",
    date: "2024-10-19",
    location: "Madison, WI",
    year: 2024,
    month: "October",
    images: [
      img("photo-1592919505780-303950717480"),
      img("photo-1587174486073-ae5e5cff23aa"),
    ],
  },
  {
    id: "a7",
    tournament_name: "Junior Invitational",
    date: "2024-07-27",
    location: "Hayward, WI",
    year: 2024,
    month: "July",
    images: [
      img("photo-1600881333168-2ef49b341f30"),
      img("photo-1587381420270-3e1a5b9e6904"),
      img("photo-1535131749006-b7f58c99034b"),
    ],
  },
  {
    id: "a8",
    tournament_name: "Coral Springs Spring Open",
    date: "2024-04-06",
    location: "Coral Springs, FL",
    year: 2024,
    month: "April",
    images: [
      img("photo-1587174486073-ae5e5cff23aa"),
      img("photo-1592919505780-303950717480"),
      img("photo-1587381420270-3e1a5b9e6904"),
      img("photo-1600881333168-2ef49b341f30"),
    ],
  },
];