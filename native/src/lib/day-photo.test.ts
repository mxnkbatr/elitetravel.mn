import { describe, expect, it } from "vitest";
import { dayPhoto } from "./day-photo";

describe("day photos", () => {
  const tour = { destinationKey: "hainan", image: "cover", gallery: ["g1", "g2"] };

  it("picks a known place photo and otherwise walks the gallery", () => {
    expect(dayPhoto(tour, { title: "Байшилин шилэн гүүр", detail: "" }, 0)).toContain("day2-baishilin-glass-bridge");
    expect(dayPhoto(tour, { title: "Амралт", detail: "Чимээгүй өдөр" }, 1)).toBe("g2");
  });

  it("returns null when the tour has no imagery", () => {
    expect(dayPhoto({ image: "", gallery: [] }, { title: "Өдөр", detail: "" }, 0)).toBeNull();
  });
});