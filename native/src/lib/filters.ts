import type { Tour } from "./types";

export type PriceBand = "low" | "mid" | "high";
export type DurationBand = "short" | "long";

export type TourFilter =
  | { type: "all" }
  | { type: "destination"; key: string }
  | { type: "price"; band: PriceBand }
  | { type: "duration"; band: DurationBand };

export const PRICE_CHIPS: { band: PriceBand; label: string }[] = [
  { band: "low", label: "3 сая хүртэл" },
  { band: "mid", label: "3–6 сая" },
  { band: "high", label: "6 саяас" },
];

export const DURATION_CHIPS: { band: DurationBand; label: string }[] = [
  { band: "short", label: "7 шөнө хүртэл" },
  { band: "long", label: "8+ шөнө" },
];

export function nightsOf(tour: Pick<Tour, "nights" | "duration">) {
  if (typeof tour.nights === "number") return tour.nights;
  const nights = tour.duration?.match(/(\d+)\s*шөн/);
  if (nights) return Number(nights[1]);
  const days = tour.duration?.match(/(\d+)\s*өдөр/);
  if (days) return Math.max(0, Number(days[1]) - 1);
  return null;
}

export function matchesFilter(tour: Tour, filter: TourFilter) {
  if (filter.type === "all") return true;
  if (filter.type === "destination") return tour.destinationKey === filter.key;
  if (filter.type === "price") {
    if (tour.price == null) return false;
    if (filter.band === "low") return tour.price < 3_000_000;
    if (filter.band === "mid") return tour.price >= 3_000_000 && tour.price < 6_000_000;
    return tour.price >= 6_000_000;
  }
  const nights = nightsOf(tour);
  if (nights == null) return false;
  return filter.band === "short" ? nights <= 7 : nights >= 8;
}

export function applyTourFilter(tours: Tour[], filter: TourFilter) {
  return tours.filter((tour) => matchesFilter(tour, filter));
}
