import { applySaleExpiry, priceForDate, saleRunning, type Tour } from "@/data/tours";
import {
  calculateTourPrice,
  childrenMaxOf,
  initialCalculatorState,
  parseCalculatorState,
  setAdults,
  setChildren,
  setOddChoice,
  setOddKids,
  setPairChoice,
  setPairKids,
  validateCalculatorState,
  type CalculatorState,
} from "@/lib/tour-calculator";
import { describe, expect, it } from "vitest";

const hainan3 = {
  id: "hainan-3",
  price: 3_290_000,
  pricing: {},
  calculator: { enabled: true, childDiscount: 300_000, singleSupplement: 700_000, depositPercent: 30, allowChildExtraBed: true },
} as unknown as Tour;

const weeknd = {
  id: "weeknd-world-tour",
  price: 6_290_000,
  pricing: {},
  calculator: { enabled: true, childDiscount: 0, singleSupplement: 1_200_000, depositPercent: 50, allowChildExtraBed: false },
} as unknown as Tour;

const bali = {
  id: "bali",
  price: 5_790_000,
  pricing: {},
  calculator: {
    enabled: true,
    childDiscount: 0,
    childBasePrice: 5_990_000,
    childSalePrice: 5_490_000,
    singleSupplement: 1_100_000,
    depositPercent: 50,
    allowChildExtraBed: true,
  },
} as unknown as Tour;

const quote = (tour: Tour, s: CalculatorState, date?: string, running?: boolean) =>
  calculateTourPrice(tour, s, priceForDate(tour, date, running));

function pickDouble(adults = 2) {
  let s = initialCalculatorState(adults);
  for (let i = 0; i < Math.floor(adults / 2); i++) s = setPairChoice(s, i, "double");
  if (adults % 2 === 1) s = setOddChoice(s, "shared");
  return s;
}

describe("prompt §11 worked examples (hainan-3)", () => {
  it("2 adults + 1 no-bed child in double → 9'570'000 / deposit 2'871'000", () => {
    let s = setChildren(pickDouble(2), 1);
    s = setPairKids(s, 0, { extraBed: false, withParents: 1 });
    const q = quote(hainan3, s);
    expect(q.total).toBe(9_570_000);
    expect(q.deposit).toBe(2_871_000);
    expect(q.balance).toBe(6_699_000);
    expect(q.savings).toBe(300_000);
  });

  it("same child with extra bed → 9'870'000, no extra 700k bed fee", () => {
    let s = setChildren(pickDouble(2), 1);
    s = setPairKids(s, 0, { extraBed: true, withParents: 0 });
    expect(quote(hainan3, s).total).toBe(9_870_000);
  });

  it("1 adult + 1 no-bed withChild → 6'580'000; single → 7'280'000", () => {
    let s = setChildren(initialCalculatorState(1), 1);
    s = setOddChoice(s, "withChild");
    s = setOddKids(s, { extraBed: false, withParents: 1 });
    expect(quote(hainan3, s).total).toBe(6_580_000);
    expect(quote(hainan3, s).summaryReady).toBe(false);

    s = setOddChoice(s, "single"); // toggle off withChild then... wait setOddChoice toggles
    // reset path
    s = setChildren(initialCalculatorState(1), 1);
    s = setOddChoice(s, "single");
    s = setOddKids(s, { extraBed: false, withParents: 1 });
    expect(quote(hainan3, s).total).toBe(7_280_000);
  });

  it("2 adults twoSingles → 7'980'000", () => {
    const s = setPairChoice(initialCalculatorState(2), 0, "twoSingles");
    expect(quote(hainan3, s).total).toBe(7_980_000);
  });

  it("3 adults: double+shared 9'870'000; double+single 10'570'000", () => {
    let s = setAdults(initialCalculatorState(2), 3);
    s = setPairChoice(s, 0, "double");
    expect(quote(hainan3, setOddChoice(s, "shared")).total).toBe(9_870_000);
    expect(quote(hainan3, setOddChoice(s, "single")).total).toBe(10_570_000);
  });
});

describe("Weeknd / Bali / sale rules", () => {
  it("Weeknd children max is ×2 (no extra bed); backend rejects extraBed", () => {
    expect(childrenMaxOf(2, false)).toBe(2);
    expect(childrenMaxOf(2, true)).toBe(3);
    const raw = {
      adults: 2,
      children: 1,
      pairRooms: [{ choice: "double", extraBed: true, withParents: 0 }],
      oddRoom: null,
    };
    const stripped = parseCalculatorState(raw, false);
    expect(stripped?.pairRooms[0].kids.extraBed).toBe(false);
    // Force invalid state for validator
    const forced: CalculatorState = {
      ...stripped!,
      pairRooms: [{ choice: "double", kids: { extraBed: true, withParents: 0 } }],
    };
    expect(validateCalculatorState(forced, false)).toMatch(/нэмэлт ортой/i);
  });

  it("Weeknd no-bed child pays adult price (discount 0)", () => {
    let s = setChildren(pickDouble(2), 1, false);
    s = setPairKids(s, 0, { extraBed: false, withParents: 1 }, false);
    expect(quote(weeknd, s).total).toBe(3 * 6_290_000);
  });

  it("Bali no-bed uses sale/base child prices; extra bed uses P", () => {
    const sale = {
      ...bali,
      oldPrice: 6_290_000,
      pricing: { saleEndsAt: "2099-01-01T00:00:00+08:00" },
    } as unknown as Tour;
    let s = setChildren(pickDouble(2), 1);
    s = setPairKids(s, 0, { extraBed: false, withParents: 1 });
    expect(quote(sale, s, undefined, true).childPrice).toBe(5_490_000);
    expect(quote(sale, s, undefined, false).childPrice).toBe(5_990_000);

    s = setPairKids(s, 0, { extraBed: true, withParents: 0 });
    expect(quote(bali, s).total).toBe(3 * 5_790_000);
  });

  it("Bali 1+1 uses adult P, not childBasePrice", () => {
    let s = setChildren(initialCalculatorState(1), 1);
    s = setOddChoice(s, "withChild");
    s = setOddKids(s, { extraBed: false, withParents: 1 });
    expect(quote(bali, s).childPrice).toBe(5_790_000);
    expect(quote(bali, s).total).toBe(2 * 5_790_000);
  });

  it("sale endsAt exactly now is inactive", () => {
    const ends = "2026-11-18T00:00:00+08:00";
    const tour = { pricing: { saleEndsAt: ends } } as Tour;
    expect(saleRunning(tour, Date.parse(ends))).toBe(false);
    expect(saleRunning(tour, Date.parse(ends) - 1)).toBe(true);
  });

  it("card/detail/calculator adult unit price stay equal after expiry", () => {
    const sale = {
      ...hainan3,
      price: 2_590_000,
      oldPrice: 3_290_000,
      pricing: { saleEndsAt: "2026-11-01T00:00:00+08:00" },
    } as unknown as Tour;
    const after = applySaleExpiry(sale, Date.parse("2026-11-18T00:00:00+08:00"));
    expect(after.price).toBe(3_290_000);
    expect(priceForDate(after).price).toBe(quote(sale, pickDouble(2), undefined, false).adultPrice);
  });
});

describe("allocation validation", () => {
  it("live total before rooms; booking ready only when complete", () => {
    const s = initialCalculatorState(2);
    const q = quote(hainan3, s);
    expect(q.total).toBe(2 * 3_290_000);
    expect(q.ready).toBe(false);
    expect(q.summaryReady).toBe(false);
  });

  it("unallocated children keep ready false; incomplete kids not priced", () => {
    const s = setChildren(pickDouble(2), 2);
    const q = quote(hainan3, s);
    expect(q.ready).toBe(false);
    expect(q.total).toBe(2 * 3_290_000);
  });

  it("rejects over-capacity kids in one group", () => {
    const s: CalculatorState = {
      adults: 2,
      children: 3,
      pairRooms: [{ choice: "double", kids: { extraBed: false, withParents: 3 } }],
      oddRoom: null,
      expandedPairs: [true],
    };
    expect(validateCalculatorState(s, true)).toMatch(/2-оос илүү/i);
  });

  it("clearing adults drops hidden odd state from price", () => {
    let s = setAdults(initialCalculatorState(2), 3);
    s = setPairChoice(s, 0, "double");
    s = setOddChoice(s, "single");
    expect(quote(hainan3, s).oddFee).toBe(700_000);
    s = setAdults(s, 2);
    expect(s.oddRoom).toBeNull();
    expect(quote(hainan3, s).oddFee).toBe(0);
    expect(quote(hainan3, s).total).toBe(2 * 3_290_000);
  });

  it("real savings uses max(0, P−C) even for 1+1 override", () => {
    let s = setChildren(initialCalculatorState(1), 1);
    s = setOddChoice(s, "withChild");
    s = setOddKids(s, { extraBed: false, withParents: 1 });
    // C forced to P → savings 0 (intentional fix vs Lovable showing D)
    expect(quote(hainan3, s).savings).toBe(0);
  });

  it("parse clamps children to Weeknd max", () => {
    const s = parseCalculatorState({ adults: 2, children: 9, pairRooms: [{ choice: "twin" }] }, false);
    expect(s?.children).toBe(2);
  });
});
