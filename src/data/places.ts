import { destinations, formatPrice, tours } from "@/data/tours";

export type DestinationProfile = {
  key: string;
  name: string;
  en: string;
  blurb: string;
  image: string;
  vibe: string;
  bestSeason: string;
  fromPrice: number | null;
  highlights: string[];
  tourFilter: "hainan" | "hongkong" | "bali" | "soon";
};

export type Resort = {
  id: string;
  name: string;
  place: string;
  country: string;
  blurb: string;
  image: string;
  tags: string[];
  rating: number;
  fromPrice: number | null;
};

export const destinationProfiles: DestinationProfile[] = destinations.map((d) => {
  const related = tours.filter((t) => t.destinationKey === d.key && t.price != null);
  const from = related.length
    ? Math.min(...related.map((t) => t.price as number))
    : null;
  return {
    key: d.key,
    name: d.name,
    en: d.en,
    blurb: d.blurb,
    image: d.image,
    vibe: d.en,
    bestSeason: d.key === "hainan" ? "9–11 сар" : d.key === "bali" ? "Жилийн турш" : "Улирлаар",
    fromPrice: from,
    highlights: ["Elite Travel хөтөлбөр", "Монгол хөтөч", "Шууд захиалга"],
    tourFilter: (d.key === "egypt" ? "soon" : d.key) as DestinationProfile["tourFilter"],
  };
});

export const resorts: Resort[] = [
  {
    id: "sanya",
    name: "Sanya Beach",
    place: "Санья",
    country: "Хайнань",
    blurb: "Хайнань аяллын гол амралтын бүс.",
    image: "https://elitetravel.mn/__l5e/assets-v1/8ce9b508-74d0-44a0-89ed-cf34d352091e/hainan-overview.png",
    tags: ["Далай", "Pool"],
    rating: 4.8,
    fromPrice: 2590000,
  },
  {
    id: "ubud",
    name: "Ubud Retreat",
    place: "Убуд",
    country: "Бали",
    blurb: "Ногоон ой, сэрүүн vibe.",
    image: "https://elitetravel.mn/__l5e/assets-v1/5c891b94-99c0-43e5-ba48-5bd368e46bfb/bali-island.png",
    tags: ["Jungle", "Wellness"],
    rating: 4.9,
    fromPrice: 5790000,
  },
  {
    id: "hk",
    name: "Victoria Harbour",
    place: "Хонг Конг",
    country: "Хонг Конг",
    blurb: "Концерт аяллын төв.",
    image: "https://elitetravel.mn/__l5e/assets-v1/c38f5ae9-77ea-46f7-bed4-345fc9952db6/weeknd-hongkong.png",
    tags: ["City", "Night"],
    rating: 4.9,
    fromPrice: 6290000,
  },
];

export function formatFromPrice(price: number | null) {
  if (price == null) return "Удахгүй";
  return formatPrice(price) + "-с";
}
