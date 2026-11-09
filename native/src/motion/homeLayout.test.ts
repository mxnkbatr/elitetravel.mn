import { describe, expect, it } from "vitest";
import { dockTop, heroCopyFits, homeLayout } from "./homeLayout";

describe("home fold", () => {
  it("keeps the first card readable above the dock on SE and iPhone 15 Pro", () => {
    const se = homeLayout(667);
    const pro = homeLayout(852);
    expect(se.compact).toBe(true);
    expect(pro.compact).toBe(false);
    expect(se.plateBottom).toBeLessThanOrEqual(dockTop(667, 0));
    expect(pro.plateBottom).toBeLessThanOrEqual(dockTop(852, 34));
    expect(heroCopyFits(667, 20)).toBe(true);
    expect(heroCopyFits(852, 59)).toBe(true);
  });
});
