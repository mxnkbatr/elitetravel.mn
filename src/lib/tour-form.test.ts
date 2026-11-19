import type { Tour } from "@/data/tours";
import { blockingIssues, discountLabel, normalizeTourForSave, slugFromTitle, tourForEditing, validateTour } from "@/lib/tour-form";
import { describe, expect, it } from "vitest";

const good: Tour = {
  id: "test-tour",
  title: "Тест аялал",
  destination: "Хайнань",
  destinationKey: "hainan",
  description: "Товч",
  story: "Урт",
  price: 4_000_000,
  duration: "8 өдөр",
  nights: 7,
  image: "https://res.cloudinary.com/x.jpg",
  gallery: [],
  dates: "12/12 – 12/19",
  highlights: [],
  includes: ["Нислэг"],
  excludes: [],
  itinerary: [],
};

describe("validateTour", () => {
  it("accepts a complete tour", () => {
    expect(validateTour(good)).toEqual([]);
  });

  it("lists every missing required field in Mongolian", () => {
    const fields = blockingIssues(validateTour({ ...good, title: "", id: "", image: "", description: "", story: "", duration: "" })).map((i) => i.field);
    expect(fields).toEqual(expect.arrayContaining(["title", "id", "image", "description", "story", "duration"]));
  });

  it("needs a price only when the tour takes bookings", () => {
    expect(blockingIssues(validateTour({ ...good, price: null })).map((i) => i.field)).toContain("price");
    expect(blockingIssues(validateTour({ ...good, price: null, tag: "soon" }))).toEqual([]);
    expect(blockingIssues(validateTour({ ...good, price: null, datePrices: { "12/12 – 12/19": { price: 3_000_000 } } }))).toEqual([]);
  });

  it("rejects a sale price that is not lower, a child dearer than an adult, and deposit over 100%", () => {
    const fields = blockingIssues(
      validateTour({ ...good, oldPrice: 3_000_000, pricing: { childSharedBed: 5_000_000, depositPercent: 120 } }),
    ).map((i) => i.field);
    expect(fields).toEqual(expect.arrayContaining(["oldPrice", "childSharedBed", "depositPercent"]));
  });

  it("flags half-filled itinerary days and bad per-date prices", () => {
    const issues = blockingIssues(
      validateTour({ ...good, itinerary: [{ day: "1", title: "", detail: "" }], datePrices: { "12/12 – 12/19": { price: 100, oldPrice: 50 } } }),
    );
    expect(issues.map((i) => i.field)).toEqual(expect.arrayContaining(["day:0", "date:12/12 – 12/19"]));
  });

  it("warns, without blocking, when an open tour has no dates", () => {
    const issues = validateTour({ ...good, dates: undefined });
    expect(issues.some((i) => i.field === "dates" && i.warning)).toBe(true);
    expect(blockingIssues(issues)).toEqual([]);
  });
});

describe("helpers", () => {
  it("makes a link-safe ID from a Mongolian title", () => {
    expect(slugFromTitle("Хайнань 8 хоног")).toBe("khainan-8-khonog");
    expect(slugFromTitle("  Бали!! ")).toBe("bali");
  });

  it("computes the sale badge", () => {
    expect(discountLabel(4_600_000, 5_000_000)).toBe("-8%");
    expect(discountLabel(5_000_000, 4_000_000)).toBeUndefined();
  });

  it("derives calculator rules from the single pricing fields", () => {
    const out = normalizeTourForSave({ ...good, pricing: { childSharedBed: 3_700_000, singleSupplement: 700_000, depositPercent: 30, childOwnBed: false } });
    expect(out.calculator).toMatchObject({ childDiscount: 300_000, singleSupplement: 700_000, depositPercent: 30, allowChildExtraBed: false });
  });

  it("lets per-date child prices drive the calculator", () => {
    const out = normalizeTourForSave({
      ...good,
      pricing: { childSharedBed: 3_700_000 },
      datePrices: { "12/12 – 12/19": { price: 4_000_000, childSharedBed: 3_500_000 } },
    });
    expect(out.calculator?.childDiscount).toBeUndefined();
  });

  it("drops sale leftovers when there is no sale", () => {
    const out = normalizeTourForSave({ ...good, tag: "sale", discount: "-10%", pricing: { saleEndsAt: "2026-12-01T00:00:00.000Z" } });
    expect(out.tag).toBeUndefined();
    expect(out.discount).toBeUndefined();
    expect(out.pricing?.saleEndsAt).toBeUndefined();
  });

  it("round-trips older calculator-only rules without changing them", () => {
    const old = { ...good, calculator: { enabled: true, childDiscount: 300_000, singleSupplement: 700_000, depositPercent: 30 } };
    expect(normalizeTourForSave(tourForEditing(old)).calculator).toMatchObject(old.calculator);
  });
});
