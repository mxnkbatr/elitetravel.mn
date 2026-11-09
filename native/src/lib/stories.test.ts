import { describe, expect, it } from "vitest";
import { storyGroups } from "./stories";
import type { Tour } from "./types";

describe("story groups", () => {
  it("groups catalogue photos by destination and skips ended tours", () => {
    const tours = [
      { id: "a", title: "Хайнань", destination: "Хайнань", destinationKey: "hainan", price: 1, image: "h1", gallery: ["h2", "h1"] },
      { id: "b", title: "Шоу", destination: "Хайнань", destinationKey: "hainan", price: 1, image: "h3" },
      { id: "c", title: "Бали", destination: "Бали", destinationKey: "bali", price: 1, image: "b1" },
      { id: "d", title: "Хуучин", destination: "Бали", destinationKey: "bali", price: 1, image: "old", status: "ended" },
    ] as Tour[];
    const groups = storyGroups(tours);
    expect(groups.map((group) => group.key)).toEqual(["hainan", "bali"]);
    expect(groups[0]?.slides.map((slide) => slide.image)).toEqual(["h1", "h2", "h3"]);
    expect(groups[1]?.slides).toHaveLength(1);
  });
});
