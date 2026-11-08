import type { SeatMap, Tour } from "./types";

export function tourDates(tour: Pick<Tour, "dates">) {
  return (tour.dates ?? "")
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function isBookable(tour: Pick<Tour, "tag" | "status" | "price">) {
  return tour.tag !== "soon" && tour.status !== "ended" && tour.price != null;
}

export function listedTours(tours: Tour[]) {
  return tours.filter((tour) => tour.status !== "ended");
}

export function relatedTours(tours: Tour[], tourId: string, limit = 3) {
  const current = tours.find((tour) => tour.id === tourId);
  const pool = tours.filter((tour) => tour.id !== tourId && tour.status !== "ended");
  if (!current) return pool.slice(0, limit);
  const same = pool.filter((tour) => tour.destinationKey && tour.destinationKey === current.destinationKey);
  const rest = pool.filter((tour) => tour.destinationKey !== current.destinationKey);
  return [...same, ...rest].slice(0, limit);
}

/** Matches the website card: only mention seats when a tracked departure has 15 or fewer left. */
export function seatHint(seats: SeatMap, tourId: string): string | null {
  const row = seats[tourId];
  if (!row) return null;
  const values = Object.values(row);
  if (!values.length) return null;
  const open = values.filter((seat) => !seat.closed);
  if (!open.length) return "Дүүрсэн · хүлээлэг";
  const left = Math.max(...open.map((seat) => seat.left));
  if (left <= 15) return left > 0 ? `${left} суудал үлдсэн` : "Дүүрсэн · хүлээлэг";
  return null;
}

export function searchTours(tours: Tour[], query: string) {
  const needle = query.trim().toLowerCase();
  const open = listedTours(tours);
  if (!needle) return open;
  return open.filter((tour) =>
    [tour.title, tour.destination, tour.description, tour.story, tour.dates, ...(tour.highlights ?? [])].join(" ").toLowerCase().includes(needle),
  );
}
