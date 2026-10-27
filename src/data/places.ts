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

export const destinationProfiles: DestinationProfile[] = [
  {
    key: "hainan",
    name: "Хайнань",
    en: "Hainan",
    blurb: "Далай, нар, амралт — залуусын хамгийн эрэлттэй чиглэл.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    vibe: "Beach escape",
    bestSeason: "9–11 сар",
    fromPrice: 2690000,
    highlights: ["Далайн эрэг", "Үндсэн хөтөлбөр", "Тогтмол огноо"],
    tourFilter: "hainan",
  },
  {
    key: "hongkong",
    name: "Хонг Конг",
    en: "Hong Kong",
    blurb: "Хот, гэрэл, концерт — night life, тусгай шоу аяллууд.",
    image:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1400&q=80",
    vibe: "City & concert",
    bestSeason: "10–12 сар",
    fromPrice: 6590000,
    highlights: ["Концерт", "Хот үзэх", "Premium stay"],
    tourFilter: "hongkong",
  },
  {
    key: "bali",
    name: "Бали",
    en: "Bali",
    blurb: "Арал, сэрүүн vibe — Ubud, далай, соёлын туршлага.",
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1400&q=80",
    vibe: "Island chill",
    bestSeason: "Жилийн турш",
    fromPrice: 6290000,
    highlights: ["Убуд", "Далайн эрэг", "Уян хатан огноо"],
    tourFilter: "bali",
  },
  {
    key: "egypt",
    name: "Египет",
    en: "Egypt",
    blurb: "Концерт + түүх — удахгүй нээгдэх шинэ чиглэл.",
    image:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1400&q=80",
    vibe: "Coming soon",
    bestSeason: "Удахгүй",
    fromPrice: null,
    highlights: ["Концерт", "Түүхэн газрууд", "Шинэ хөтөлбөр"],
    tourFilter: "soon",
  },
];

export const resorts: Resort[] = [
  {
    id: "sanya-beach",
    name: "Sanya Beach Resort",
    place: "Санья",
    country: "Хайнань",
    blurb: "Цагаан элс, тунгалаг далай — амралт + pool vibe.",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80",
    tags: ["Далай", "Pool", "All-day chill"],
    rating: 4.8,
    fromPrice: 2690000,
  },
  {
    id: "wuzhizhou",
    name: "Wuzhizhou Island",
    place: "Үжүжоу арал",
    country: "Хайнань",
    blurb: "Арал дээрх цэвэр далай, snorkeling, photo spot.",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1400&q=80",
    tags: ["Арал", "Snorkel", "Day trip"],
    rating: 4.7,
    fromPrice: 2990000,
  },
  {
    id: "ubud-retreat",
    name: "Ubud Jungle Retreat",
    place: "Убуд",
    country: "Бали",
    blurb: "Ногоон ой, yoga, сэрүүн өглөө — reset хийхэд тохиромжтой.",
    image:
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1400&q=80",
    tags: ["Jungle", "Wellness", "Quiet"],
    rating: 4.9,
    fromPrice: 6290000,
  },
  {
    id: "seminyak",
    name: "Seminyak Coast",
    place: "Семиняк",
    country: "Бали",
    blurb: "Sunset beach club, cafe, залуусын night vibe.",
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1400&q=80",
    tags: ["Sunset", "Cafe", "Beach"],
    rating: 4.8,
    fromPrice: 6290000,
  },
  {
    id: "hk-harbour",
    name: "Victoria Harbour Stay",
    place: "Коулун",
    country: "Хонг Конг",
    blurb: "Хотоос харах гэрэлтсэн боомт — концерт аяллын төв.",
    image:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1400&q=80",
    tags: ["City view", "Night", "Concert"],
    rating: 4.9,
    fromPrice: 6590000,
  },
  {
    id: "red-sea",
    name: "Red Sea Escape",
    place: "Хургада",
    country: "Египет",
    blurb: "Удахгүй — далай + концерт combo бэлтгэгдэж байна.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80",
    tags: ["Soon", "Sea", "Concert"],
    rating: 5,
    fromPrice: null,
  },
];

export function formatFromPrice(price: number | null) {
  if (price == null) return "Удахгүй";
  const digits = String(price).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `₮${digits}-с`;
}
