import { describe, expect, it } from "vitest";
import { formatPrice } from "./money";
import { quote } from "./quote";
import type { Tour } from "./types";

const tour = { price: 3_000_000, pricing: { childSharedBed: 2_000_000, singleSupplement: 500_000, depositPercent: 30 } } as Tour;

describe("quote", () => {
  it("charges adults, children and single rooms by the published rules", () => {
    const priced = quote(tour, { adults: 2, kidsOwnBed: 1, kidsSharedBed: 1, singleRooms: 1 });
    expect(priced.total).toBe(3 * 3_000_000 + 2_000_000 + 500_000);
    expect(priced.deposit).toBe(Math.round(priced.total * 0.3));
  });

  it("ignores options the tour does not offer", () => {
    const priced = quote({ ...tour, pricing: { childOwnBed: false } }, { adults: 1, kidsOwnBed: 2, kidsSharedBed: 2, singleRooms: 1 });
    expect(priced.total).toBe(3_000_000);
    expect(priced.deposit).toBe(0);
  });

  it("never gives more single rooms than adults", () => {
    expect(quote(tour, { adults: 1, kidsOwnBed: 0, kidsSharedBed: 0, singleRooms: 5 }).total).toBe(3_000_000 + 500_000);
  });
});

describe("formatPrice", () => {
  it("uses the site's apostrophe grouping", () => {
    expect(formatPrice(2990000)).toBe("₮2'990'000");
    expect(formatPrice(null)).toBe("Удахгүй");
  });
});
