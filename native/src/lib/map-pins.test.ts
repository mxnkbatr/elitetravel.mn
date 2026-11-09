import { describe, expect, it } from "vitest";
import { appleMapsDirectionsUrl, arcBounds, flightArc, focusBounds, pinsForDestinationKeys, PUBLISHED_PINS, ROUTE_COLLECTION, sliceArc, stepDestination } from "./map-pins";

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

  it("steps destinations the way the website card does and frames the published arc", () => {
    expect(stepDestination(0, 1, 4)).toBe(1);
    expect(stepDestination(0, -1, 4)).toBe(3);
    const arc = flightArc(PUBLISHED_PINS[0]);
    const box = arcBounds(arc);
    expect(box.west).toBeLessThanOrEqual(106.917);
    expect(box.east).toBeGreaterThanOrEqual(109.508);
    expect(box.north).toBeGreaterThanOrEqual(47.9);
    expect(box.south).toBeLessThanOrEqual(18.3);
  });

  it("builds flight lines only for the published destinations", () => {
    expect(ROUTE_COLLECTION.features.map((feature) => feature.properties?.key)).toEqual(["hainan", "hongkong", "bali", "egypt"]);
    const hainan = ROUTE_COLLECTION.features[0].geometry;
    expect(hainan.type).toBe("LineString");
    if (hainan.type !== "LineString") return;
    expect(hainan.coordinates[0]).toEqual([106.917, 47.918]);
    expect(hainan.coordinates.at(-1)).toEqual([109.508, 18.247]);
    expect(focusBounds("bali")?.[2]).toBeGreaterThan(106);
    expect(focusBounds("not-a-place")).toBeNull();
  });

  it("draws the flight arc from Ulaanbaatar out to the pin", () => {
    const arc = flightArc(PUBLISHED_PINS[0], 8);
    expect(sliceArc(arc, 0)).toEqual([arc[0]]);
    expect(sliceArc(arc, 1)).toEqual(arc);
    const mid = sliceArc(arc, 0.5);
    expect(mid.length).toBeGreaterThan(2);
    expect(mid[0]).toEqual(arc[0]);
    expect(mid.at(-1)?.latitude).toBeLessThan(arc[0].latitude);
    expect(mid.at(-1)?.latitude).toBeGreaterThan(arc.at(-1)!.latitude);
  });

  it("builds an Apple Maps directions link from a real pin", () => {
    const bali = PUBLISHED_PINS.find((pin) => pin.key === "bali")!;
    expect(appleMapsDirectionsUrl(bali)).toBe("https://maps.apple.com/?daddr=-8.4095,115.1889&q=%D0%91%D0%B0%D0%BB%D0%B8");
  });
});
