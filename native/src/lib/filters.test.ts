import { describe, expect, it } from "vitest";
import { applyTourFilter, nightsOf } from "./filters";
import type { Tour } from "./types";

const tours = [
  { id: "a", title: "A", destination: "Хайнань", destinationKey: "hainan", price: 2990000, nights: 7, duration: "8 өдөр · 7 шөнө", image: "" },
  { id: "b", title: "B", destination: "Бали", destinationKey: "bali", price: 5790000, nights: 8, duration: "9 өдөр · 8 шөнө", image: "" },
  { id: "c", title: "C", destination: "Хонг Конг", destinationKey: "hongkong", price: 6290000, duration: "5 өдөр · 4 шөнө", image: "" },
] as Tour[];

describe("tour filters", () => {
  it("reads nights from the duration when the field is missing", () => {
    expect(nightsOf(tours[2])).toBe(4);
  });

  it("filters by destination, price and duration without dropping the rest of the tour", () => {
    expect(applyTourFilter(tours, { type: "destination", key: "bali" }).map((tour) => tour.id)).toEqual(["b"]);
    expect(applyTourFilter(tours, { type: "price", band: "low" }).map((tour) => tour.id)).toEqual(["a"]);
    expect(applyTourFilter(tours, { type: "price", band: "high" }).map((tour) => tour.id)).toEqual(["c"]);
    expect(applyTourFilter(tours, { type: "duration", band: "short" }).map((tour) => tour.id)).toEqual(["a", "c"]);
    expect(applyTourFilter(tours, { type: "duration", band: "long" }).map((tour) => tour.id)).toEqual(["b"]);
  });
});
