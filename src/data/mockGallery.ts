import heroCourse from "@/assets/hero-course.jpg";
import courseAerial from "@/assets/course-aerial.jpg";
import ballGreen from "@/assets/ball-green.jpg";
import juniorGolfer from "@/assets/junior-golfer.jpg";
import juniorGirl from "@/assets/junior-girl.jpg";
import trophy from "@/assets/trophy.jpg";

export const galleryPhotos: string[] = [
  juniorGolfer,
  juniorGirl,
  courseAerial,
  heroCourse,
  ballGreen,
  trophy,
];

export const galleryVideos = [
  { id: "1", title: "2025 Season Highlights", youtubeId: "dQw4w9WgXcQ" },
  { id: "2", title: "Championship Finale Recap", youtubeId: "dQw4w9WgXcQ" },
  { id: "3", title: "Player Spotlights", youtubeId: "dQw4w9WgXcQ" },
  { id: "4", title: "Junior Tour Behind the Scenes", youtubeId: "dQw4w9WgXcQ" },
];

export const recentTournamentLocations: { name: string; image: string }[] = [
  { name: "Eagle Trace GC", image: heroCourse },
  { name: "Glen Erin GC", image: courseAerial },
  { name: "Big Fish GC", image: ballGreen },
  { name: "PGA National", image: juniorGolfer },
  { name: "TPC Sawgrass", image: juniorGirl },
];