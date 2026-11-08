import { describe, expect, it } from "vitest";
import { loadPublicCatalog } from "./catalog";
import { API_ORIGIN } from "./config";

const live = process.env.ELITE_CATALOG_LIVE === "1";

describe.skipIf(!live)("live public catalogue", () => {
  it("reads at least one tour from the public tours page", async () => {
    const page = await loadPublicCatalog(API_ORIGIN);
    expect(page.tours.length).toBeGreaterThan(0);
    expect(page.tours.every((tour) => tour.title && tour.image.startsWith("http"))).toBe(true);
  });
});
