import { afterEach, describe, expect, it } from "vitest";
import { peekHeroFlight, resetHeroFlightForTests, stageHeroFlight, takeHeroFlight } from "./heroFlight";

describe("tour hero flight", () => {
  afterEach(() => resetHeroFlightForTests());

  it("keeps the measured card frame until the detail screen takes it", () => {
    const rect = { x: 12, y: 240, width: 340, height: 280 };
    stageHeroFlight("bali", rect);
    expect(peekHeroFlight("bali")).toEqual(rect);
    expect(peekHeroFlight("hainan")).toBeNull();
    expect(takeHeroFlight("bali")).toEqual(rect);
    expect(peekHeroFlight("bali")).toBeNull();
  });
});
