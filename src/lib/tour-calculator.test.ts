import { applySaleExpiry, priceForDate, type Tour } from "@/data/tours";
import {
  calculateTourPrice,
  initialCalculatorState,
  parseCalculatorState,
  setAdults,
  setChildren,
  setKid,
  setRoomCount,
  setRoomType,
  type CalculatorState,
} from "@/lib/tour-calculator";
import { describe, expect, it } from "vitest";

/** Booking А from the brief */
const tourA = {
  id: "a",
  price: 2_590_000,
  pricing: {},
  calculator: { enabled: true, childDiscount: 300_000, singleSupplement: 700_000, depositPercent: 30, allowChildExtraBed: true },
} as unknown as Tour;

/** Booking Б from the brief */
const tourB = {
  id: "b",
  price: 5_790_000,
  pricing: {},
  calculator: { enabled: true, childDiscount: 0, singleSupplement: 1_100_000, depositPercent: 50, allowChildExtraBed: true },
} as unknown as Tour;

const quote = (tour: Tour, s: CalculatorState, date?: string, running?: boolean) => calculateTourPrice(tour, s, priceForDate(tour, date, running));

describe("room price calculator", () => {
  it("suggests one double for 2 adults and shows the total right away", () => {
    const s = initialCalculatorState(2);
    expect(s.rooms).toEqual([{ type: "double" }]);
    const q = quote(tourA, s);
    expect(q.ready).toBe(true);
    expect(q.total).toBe(5_180_000);
    expect(q.deposit).toBe(1_554_000);
    expect(q.balance).toBe(3_626_000);
  });

  it("hides the total until the odd adult's room is chosen", () => {
    const s = setAdults(initialCalculatorState(2), 3, true);
    expect(s.rooms.map((r) => r.type)).toEqual(["double", null]);
    const pending = quote(tourA, s);
    expect(pending.ready).toBe(false);
    expect(pending.warnings.join(" ")).toContain("өрөөний төрлийг");

    const single = quote(tourA, setRoomType(s, 1, "single", true));
    expect(single.ready).toBe(true);
    expect(single.total).toBe(3 * 2_590_000 + 700_000);

    const shared = quote(tourA, setRoomType(s, 1, "shared", true));
    expect(shared.total).toBe(3 * 2_590_000);
  });

  it("charges a no-bed child the child price and an extra-bed child the adult price", () => {
    const s = setChildren(initialCalculatorState(2), 1, true);
    expect(s.kids).toEqual([{ room: 0, bed: "withParents" }]);
    const noBed = quote(tourA, s);
    expect(noBed.total).toBe(2 * 2_590_000 + 2_290_000);
    expect(noBed.childSavings).toBe(300_000);

    const bed = quote(tourA, setKid(s, 0, 0, "extraBed", true));
    expect(bed.total).toBe(3 * 2_590_000);
    expect(bed.childSavings).toBe(0);
  });

  it("charges the adult price when exactly 1 adult travels with 1 child", () => {
    let s = setChildren(initialCalculatorState(1), 1, true);
    s = setRoomType(s, 0, "single", true);
    const q = quote(tourA, s);
    expect(q.ready).toBe(true);
    expect(q.childPrice).toBe(2_590_000);
    expect(q.total).toBe(2 * 2_590_000 + 700_000);
  });

  it("never puts a child in a room shared with another traveller", () => {
    let s = setChildren(initialCalculatorState(1), 1, true);
    s = setRoomType(s, 0, "shared", true);
    const q = quote(tourA, s);
    expect(s.kids[0].room).toBeNull();
    expect(q.ready).toBe(false);
  });

  it("limits each room to 2 children with parents and 1 extra bed", () => {
    const s = setChildren(initialCalculatorState(2), 4, true);
    expect(s.kids.filter((k) => k.room === 0)).toHaveLength(3);
    expect(s.kids[3].room).toBeNull();
    expect(quote(tourA, s).ready).toBe(false);
  });

  it("lets the guest add rooms and flags spare seats", () => {
    const s = setRoomCount(initialCalculatorState(2), 2, true);
    expect(s.rooms).toEqual([{ type: "double" }, { type: null }]);
    const both = setRoomType(setRoomType(s, 0, "single", true), 1, "single", true);
    const q = quote(tourB, both);
    expect(q.ready).toBe(true);
    expect(q.total).toBe(2 * 5_790_000 + 2 * 1_100_000);
    expect(q.deposit).toBe(Math.round(q.total * 0.5));
  });

  it("booking Б: no child discount, 50% deposit", () => {
    const q = quote(tourB, setChildren(initialCalculatorState(2), 1, true));
    expect(q.total).toBe(3 * 5_790_000);
    expect(q.deposit).toBe(8_685_000);
    expect(q.savings).toBe(0);
  });
});

describe("sale countdown", () => {
  const sale = {
    ...tourA,
    price: 2_590_000,
    oldPrice: 3_290_000,
    pricing: { saleEndsAt: "2026-11-20T00:00:00+08:00" },
  } as unknown as Tour;

  it("uses the sale price while it runs and reports the saving separately", () => {
    const q = quote(sale, setChildren(initialCalculatorState(2), 1, true), undefined, true);
    expect(q.adultPrice).toBe(2_590_000);
    expect(q.originalPrice).toBe(3_290_000);
    expect(q.total).toBe(2 * 2_590_000 + 2_290_000);
    expect(q.saleSavings).toBe(3 * 700_000);
    expect(q.childSavings).toBe(300_000);
  });

  it("switches to the original price once the countdown ends", () => {
    const q = quote(sale, setChildren(initialCalculatorState(2), 1, true), undefined, false);
    expect(q.adultPrice).toBe(3_290_000);
    expect(q.originalPrice).toBeNull();
    expect(q.total).toBe(2 * 3_290_000 + 2_990_000);
    expect(q.saleSavings).toBe(0);
  });

  it("flips the page price on the server too, so page and calculator match", () => {
    const after = applySaleExpiry(sale, Date.parse("2026-11-21T00:00:00+08:00"));
    expect(after.price).toBe(3_290_000);
    expect(after.oldPrice).toBeNull();
    expect(priceForDate(after).price).toBe(quote(sale, initialCalculatorState(2), undefined, false).adultPrice);
  });
});

describe("server parsing", () => {
  it("re-applies room limits to the browser payload", () => {
    const s = parseCalculatorState(
      { adults: 2, children: 2, rooms: ["double"], kids: [{ room: 0, bed: "extraBed" }, { room: 0, bed: "extraBed" }] },
      true,
    );
    expect(s?.kids).toEqual([
      { room: 0, bed: "extraBed" },
      { room: 0, bed: "withParents" },
    ]);
  });

  it("rejects a room count that cannot hold the adults", () => {
    expect(parseCalculatorState({ adults: 4, children: 0, rooms: ["double"], kids: [] }, true)).toBeNull();
  });
});
