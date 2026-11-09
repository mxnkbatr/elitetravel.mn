import { describe, expect, it } from "vitest";
import { countdownLabel, destinationAirport, parseDeparture, travellersLabel } from "./ticket";

describe("boarding pass", () => {
  const now = new Date(2026, 10, 9, 8, 0, 0);

  it("uses the published arrival codes and leaves unknown keys blank", () => {
    expect(destinationAirport("hainan").code).toBe("HAK");
    expect(destinationAirport("hongkong").code).toBe("HKG");
    expect(destinationAirport("bali").code).toBe("DPS");
    expect(destinationAirport("made-up").code).toBe("—");
  });

  it("parses an ISO day and the first date in a range, and ignores open wording", () => {
    expect(parseDeparture("2026-12-18", now)?.getMonth()).toBe(11);
    expect(parseDeparture("11/10 – 11/17", now)?.getDate()).toBe(10);
    expect(parseDeparture("Хүссэн үедээ", now)).toBeNull();
    expect(parseDeparture("10/28 – 11/01", now)?.getFullYear()).toBe(2027);
  });

  it("counts down to a future departure and says so once the day has passed", () => {
    const target = new Date(2026, 10, 20, 0, 0, 0);
    expect(countdownLabel(target, now)).toBe("10 өдөр 16:00:00");
    expect(countdownLabel(new Date(2026, 10, 8), now)).toBe("Ниссэн");
    expect(travellersLabel(2)).toBe("2 зорчигч");
    expect(travellersLabel(undefined)).toBe("—");
  });
});
