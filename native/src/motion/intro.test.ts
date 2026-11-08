import { afterEach, describe, expect, it } from "vitest";
import { detailEntrance } from "./detail";
import { introAlreadyPlayed, introPlan, markIntroPlayed, resetIntroForTests, shouldShowIntro } from "./intro";

describe("brand intro", () => {
  afterEach(() => resetIntroForTests());

  it("plays once per runtime and stays skipped after the traveller dismisses it", () => {
    expect(shouldShowIntro()).toBe(true);
    markIntroPlayed();
    expect(introAlreadyPlayed()).toBe(true);
    expect(shouldShowIntro()).toBe(false);
  });

  it("settles the tour photo with scale, or stays still when motion is reduced", () => {
    expect(detailEntrance(false)).toEqual({ fromScale: 1.06, duration: 720 });
    expect(detailEntrance(true)).toEqual({ fromScale: 1, duration: 0 });
  });

  it("uses a fade without zoom when reduced motion is on", () => {
    expect(introPlan(true)).toEqual({ mode: "fade", duration: 650, zoom: false });
    expect(introPlan(false).zoom).toBe(true);
    expect(introPlan(false).mode).toBe("cinematic");
  });
});
