import locationTruckee from "@/assets/location-truckee-old-greenwood.jpg";
import locationPortola from "@/assets/location-portola-grizzly-ranch.jpg";
import locationSparks from "@/assets/location-sparks-red-hawk.webp";
import locationReno from "@/assets/location-reno-montreux.avif";

export const galleryVideos = [
  { id: "1", title: "2025 Season Highlights", src: "/videos/season-highlights.mov", poster: "/videos/posters/season-highlights-poster.jpg" },
  { id: "2", title: "Championship Finale Recap", src: "/videos/season-highlights-championship.mp4", poster: "/videos/posters/season-highlights-championship-poster.jpg" },
  { id: "3", title: "Player Spotlights", src: "/videos/player-spotlights.mov", poster: "/videos/posters/player-spotlights-poster.jpg" },
  { id: "4", title: "Junior Tour Behind the Scenes", src: "/videos/behind-the-scenes.mov", poster: "/videos/posters/behind-the-scenes-poster.jpg" },
  { id: "5", title: "Tournament Action", src: "/videos/tournament-action.mov", poster: "/videos/posters/tournament-action-poster.jpg" },
];

export const recentTournamentLocations: { city: string; venue: string; image: string }[] = [
  { city: "Truckee, CA", venue: "Old Greenwood Golf Course", image: locationTruckee },
  { city: "Portola, CA", venue: "Grizzly Ranch Golf Club", image: locationPortola },
  { city: "Sparks, NV", venue: "Red Hawk Golf and Resort", image: locationSparks },
  { city: "Reno, NV", venue: "Montreux Golf & Country Club", image: locationReno },
];