import type { Tour } from "./types";

export type StorySlide = { id: string; image: string; title: string; kicker: string };
export type StoryGroup = { key: string; name: string; image: string; slides: StorySlide[] };

const SLIDE_CAP = 4;

/** One quiet ring per destination, built only from tours already in the catalogue. */
export function storyGroups(tours: Tour[]): StoryGroup[] {
  const order: string[] = [];
  const buckets = new Map<string, Tour[]>();
  for (const tour of tours) {
    if (tour.status === "ended" || !tour.image) continue;
    const key = tour.destinationKey || tour.destination;
    if (!key) continue;
    if (!buckets.has(key)) {
      buckets.set(key, []);
      order.push(key);
    }
    buckets.get(key)?.push(tour);
  }
  return order.map((key) => {
    const list = buckets.get(key) ?? [];
    const slides: StorySlide[] = [];
    for (const tour of list) {
      for (const image of [tour.image, ...(tour.gallery ?? [])]) {
        if (slides.length >= SLIDE_CAP) break;
        if (!image || slides.some((slide) => slide.image === image)) continue;
        slides.push({ id: `${tour.id}-${slides.length}`, image, title: tour.title, kicker: tour.destination });
      }
    }
    return { key, name: list[0]?.destination ?? key, image: list[0]?.image ?? "", slides };
  }).filter((group) => group.slides.length > 0);
}
