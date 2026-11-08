import { describe, expect, it } from "vitest";
import { appleMapsDirectionsUrl, pinsForDestinationKeys, PUBLISHED_PINS } from "./map-pins";

describe("published map pins", () => {
  it("matches the website map coordinates and drops unknown keys", () => {
    expect(PUBLISHED_PINS.map((pin) => [pin.key, pin.longitude, pin.latitude])).toEqual([
      ["hainan", 109.508, 18.247],
      ["hongkong", 114.1694, 22.3193],
      ["bali", 115.1889, -8.4095],
      ["egypt", 31.2357, 30.0444],
    ]);
    expect(pinsForDestinationKeys(["bali", "made-up"]).map((pin) => pin.key)).toEqual(["bali"]);
  });

  it("builds an Apple Maps directions link from a real pin", () => {
    const bali = PUBLISHED_PINS.find((pin) => pin.key === "bali")!;
    expect(appleMapsDirectionsUrl(bali)).toBe("https://maps.apple.com/?daddr=-8.4095,115.1889&q=%D0%91%D0%B0%D0%BB%D0%B8");
  });
});
