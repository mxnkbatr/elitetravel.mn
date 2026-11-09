import type { ItineraryDay, Tour } from "./types";

const CLOUD = "https://res.cloudinary.com/ev6fygsf/image/upload/elitetravel/tours";

/** Same day-photo rules as the website itinerary. Unknown days fall back to the tour gallery. */
const RULES: [RegExp, string][] = [
  [/Шилэн гүүр|Байшилин/, "day2-baishilin-glass-bridge"],
  [/Задгай далай/, "day4-open-sea-trip"],
  [/Атлантис/, "day5-atlantis-slide"],
  [/Сармагчин/, "day8-monkey-island"],
  [/Yacht/, "yacht-party-day4"],
  [/Comedy/, "comedy-show-day5"],
  [/Dately Show/, "dately-show-day3"],
  [/Викториа|хотын аялал/, "victoria-peak"],
  [/Монстер/, "monster-building"],
  [/Weeknd тоглолт|тоглолт$/, "weeknd-stage"],
  [/Lempuyang|Диваажин/, "lempuyang-temple"],
  [/Нуса Пенида|Kelingking/, "nusa-penida-kelingking"],
  [/Uluwatu/, "uluwatu-surf-temple"],
  [/Bali Swing|Kanto Lampo/, "bali-swing"],
  [/Tirta|ATV|Tegenungan/, "cretya-ubud"],
  [/Хонг Конг/, "hongkong-skyline"],
  [/Чөлөөт/, "day7-resort-pool"],
];

export function dayPhoto(tour: Pick<Tour, "destinationKey" | "image" | "gallery">, day: Pick<ItineraryDay, "title" | "detail">, index: number) {
  const text = `${day.title} ${day.detail}`;
  const hit = RULES.find(([rule]) => rule.test(text));
  if (hit && !(tour.destinationKey === "bali" && hit[1] === "day7-resort-pool")) return `${CLOUD}/${hit[1]}`;
  const gallery = tour.gallery ?? [];
  if (gallery.length) return gallery[index % gallery.length] ?? tour.image;
  return tour.image || null;
}
