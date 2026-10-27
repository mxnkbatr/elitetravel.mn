export type Tour = {
  id: string;
  title: string;
  destination: string;
  destinationKey: "hainan" | "hongkong" | "bali" | "soon";
  description: string;
  story: string;
  price: number | null;
  oldPrice?: number | null;
  duration: string;
  nights: number | null;
  rating: number;
  tag?: "hot" | "soon" | "sale";
  discount?: string;
  image: string;
  gallery: string[];
  dates?: string;
  stay?: string;
  departure?: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: { day: string; title: string; detail: string }[];
};

export function getTour(id: string) {
  return tours.find((t) => t.id === id);
}

export function formatPrice(price: number | null) {
  if (price == null) return "Удахгүй";
  const digits = String(price).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `₮${digits}`;
}

export function relatedTours(tourId: string, limit = 3) {
  const current = getTour(tourId);
  if (!current) return tours.slice(0, limit);
  const same = tours.filter(
    (t) => t.id !== tourId && t.destinationKey === current.destinationKey,
  );
  const rest = tours.filter(
    (t) => t.id !== tourId && t.destinationKey !== current.destinationKey,
  );
  return [...same, ...rest].slice(0, limit);
}

/** Scraped / synced from elitetravel.mn — Oct 2026 */
export const destinations = [
  {
    key: "hainan",
    name: "Хайнань",
    en: "Hainan",
    blurb: "Далай, нар, тогтмол огноотой амралт",
    image: "https://elitetravel.mn/__l5e/assets-v1/8ce9b508-74d0-44a0-89ed-cf34d352091e/hainan-overview.png",
  },
  {
    key: "hongkong",
    name: "Хонг Конг",
    en: "Hong Kong",
    blurb: "Хот, концерт, night vibe",
    image: "https://elitetravel.mn/__l5e/assets-v1/c38f5ae9-77ea-46f7-bed4-345fc9952db6/weeknd-hongkong.png",
  },
  {
    key: "bali",
    name: "Бали",
    en: "Bali",
    blurb: "Арал, Ubud, уян хатан огноо",
    image: "https://elitetravel.mn/__l5e/assets-v1/5c891b94-99c0-43e5-ba48-5bd368e46bfb/bali-island.png",
  },
  {
    key: "egypt",
    name: "Египет",
    en: "Egypt",
    blurb: "Удахгүй — концерт аялал",
    image: "https://elitetravel.mn/__l5e/assets-v1/847e6995-61b5-4cbc-b64b-cee410b3a47d/shakira-egypt.png",
  },
] as const;

export const tours: Tour[] = [
  {
    id: "weeknd-hk",
    title: "The Weeknd: Hong Kong аялал",
    destination: "Хонг Конг",
    destinationKey: "hongkong",
    description: "Тусгай аялал",
    story:
      "The Weeknd концерт + Хонг Конг хот үзэх тусгай аялал. 5 өдөр, 4 шөнө — Elite Travel-ийн эрэлттэй хөтөлбөр.",
    price: 6290000,
    oldPrice: 6590000,
    duration: "5 өдөр · 4 шөнө",
    nights: 4,
    rating: 4.9,
    tag: "sale",
    discount: "-10%",
    dates: "Концертын огноогоор",
    stay: "4 одтой зочид буудал",
    departure: "Улаанбаатар",
    image: "https://elitetravel.mn/__l5e/assets-v1/c38f5ae9-77ea-46f7-bed4-345fc9952db6/weeknd-hongkong.png",
    gallery: ["https://elitetravel.mn/__l5e/assets-v1/c38f5ae9-77ea-46f7-bed4-345fc9952db6/weeknd-hongkong.png", "https://elitetravel.mn/__l5e/assets-v1/2e9a9b43-175a-424a-b3b2-c1a5c1e94222/hero-jungle-tall.webp"],
    highlights: [
      "The Weeknd концертын тасалбар",
      "4 одтой зочид буудал",
      "Онгоцны тийз + шилжүүлэлт",
      "Хот үзэх хөтөлбөр",
    ],
    includes: [
      "ОУ-ын тийз (UB ↔ HKG)",
      "4 шөнийн байр",
      "Концертын тасалбар",
      "Шилжүүлэлт",
      "Монгол хөтөч",
    ],
    excludes: ["Хувийн зардал", "Даатгал", "Нэмэлт үзвэр"],
    itinerary: [
      { day: "1-р өдөр", title: "Нислэг · суурьшил", detail: "UB-аас нисэж, зочид буудалд суурьшина." },
      { day: "2-р өдөр", title: "Хот үзэх", detail: "Хонг Конгын гол газрууд, street food." },
      { day: "3-р өдөр", title: "Концертын орой", detail: "The Weeknd show." },
      { day: "4-р өдөр", title: "Чөлөөт цаг", detail: "Шоппинг, кафе, photo spot." },
      { day: "5-р өдөр", title: "Буцах", detail: "Улаанбаатар руу буцна." },
    ],
  },
  {
    id: "dately-hainan",
    title: "Dately Show: Hainan Escape",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Тусгай хөтөлбөртэй аялал /Ганцхан удаа/",
    story: "Dately Show + Хайнань далайн амралт. 8 өдөр, 7 шөнө — ганцхан удаагийн тусгай хөтөлбөр.",
    price: 2990000,
    duration: "8 өдөр · 7 шөнө",
    nights: 7,
    rating: 4.8,
    tag: "hot",
    dates: "Show-ийн хуваариар",
    stay: "Далайн эргийн зочид буудал",
    departure: "Улаанбаатар",
    image: "https://elitetravel.mn/__l5e/assets-v1/378c2bed-1ce8-486a-a59d-1c97c2546511/dately-show-hainan.png",
    gallery: ["https://elitetravel.mn/__l5e/assets-v1/378c2bed-1ce8-486a-a59d-1c97c2546511/dately-show-hainan.png", "https://elitetravel.mn/__l5e/assets-v1/8ce9b508-74d0-44a0-89ed-cf34d352091e/hainan-overview.png"],
    highlights: ["Dately Show", "Далайн амралт", "7 шөнийн байр", "Өглөөний цай"],
    includes: ["ОУ-ын тийз", "7 шөнийн байр", "Show хөтөлбөр", "Шилжүүлэлт", "Хөтөч"],
    excludes: ["Хувийн зардал", "Даатгал"],
    itinerary: [
      { day: "1–2", title: "Ирэлт · далай", detail: "Саньяд бууж, амралт." },
      { day: "3–5", title: "Show + амралт", detail: "Dately Show болон далайн өдрүүд." },
      { day: "6–7", title: "Чөлөөт өдөр", detail: "Арал, shopping." },
      { day: "8", title: "Буцах", detail: "УБ руу." },
    ],
  },
  {
    id: "hainan-sep",
    title: "Хайнань 9-р сарын сүүлийн аялал",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Үндсэн хөтөлбөртэй аялал. 7 хоног бүрийн Мягмар гарагт.",
    story: "09/29 – 10/06 огноотой Хайнань үндсэн аялал. Хямдралтай эрэлттэй сонголт.",
    price: 2590000,
    oldPrice: 3290000,
    duration: "8 өдөр · 7 шөнө",
    nights: 7,
    rating: 4.8,
    tag: "sale",
    discount: "-19%",
    dates: "09/29 – 10/06",
    stay: "Зочид буудал",
    departure: "Улаанбаатар",
    image: "https://elitetravel.mn/__l5e/assets-v1/269c7c28-b5a3-46ae-b9ee-4b239417cbfa/hainan-main-sep15.png",
    gallery: ["https://elitetravel.mn/__l5e/assets-v1/269c7c28-b5a3-46ae-b9ee-4b239417cbfa/hainan-main-sep15.png", "https://elitetravel.mn/__l5e/assets-v1/8ce9b508-74d0-44a0-89ed-cf34d352091e/hainan-overview.png"],
    highlights: ["Тогтмол огноо", "Үндсэн хөтөлбөр", "Далайн үзвэр", "Монгол хөтөч"],
    includes: ["Тийз", "7 шөнийн байр", "Үзвэр", "Шилжүүлэлт"],
    excludes: ["Хувийн зардал", "Даатгал"],
    itinerary: [
      { day: "1", title: "Нислэг", detail: "Санья руу." },
      { day: "2–6", title: "Хөтөлбөр", detail: "Үндсэн үзвэр + далай." },
      { day: "7–8", title: "Амралт · буцах", detail: "УБ руу." },
    ],
  },
  {
    id: "hainan-oct",
    title: "Хайнань 10-р сарын аялал",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Үндсэн хөтөлбөртэй аялал.",
    story: "10/06–10/13, 10/13–10/20, 10/20–10/27 — гурван огнооны сонголттой Хайнань аялал.",
    price: 2690000,
    duration: "8 өдөр · 7 шөнө",
    nights: 7,
    rating: 4.8,
    dates: "10/06–10/13 · 10/13–10/20 · 10/20–10/27",
    stay: "Зочид буудал",
    departure: "Улаанбаатар",
    image: "https://elitetravel.mn/__l5e/assets-v1/8ce9b508-74d0-44a0-89ed-cf34d352091e/hainan-overview.png",
    gallery: ["https://elitetravel.mn/__l5e/assets-v1/8ce9b508-74d0-44a0-89ed-cf34d352091e/hainan-overview.png", "https://elitetravel.mn/__l5e/assets-v1/269c7c28-b5a3-46ae-b9ee-4b239417cbfa/hainan-main-sep15.png"],
    highlights: ["3 огнооны сонголт", "Үндсэн хөтөлбөр", "8 өдөр", "Хөтөч"],
    includes: ["Тийз", "Байр", "Үзвэр", "Шилжүүлэлт"],
    excludes: ["Хувийн зардал", "Даатгал"],
    itinerary: [
      { day: "1", title: "Ирэлт", detail: "Санья." },
      { day: "2–7", title: "Хөтөлбөр", detail: "Далай + үзвэр." },
      { day: "8", title: "Буцах", detail: "УБ." },
    ],
  },
  {
    id: "hainan-main-a",
    title: "Хайнань үндсэн аялал",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Үндсэн хөтөлбөртэй аялал",
    story: "10/27–11/03 болон 11/03–11/10 огноотой Хайнань үндсэн аялал.",
    price: 3290000,
    duration: "8 өдөр · 7 шөнө",
    nights: 7,
    rating: 4.8,
    dates: "10/27–11/03 · 11/03–11/10",
    stay: "Зочид буудал",
    departure: "Улаанбаатар",
    image: "https://elitetravel.mn/__l5e/assets-v1/269c7c28-b5a3-46ae-b9ee-4b239417cbfa/hainan-main-sep15.png",
    gallery: ["https://elitetravel.mn/__l5e/assets-v1/269c7c28-b5a3-46ae-b9ee-4b239417cbfa/hainan-main-sep15.png"],
    highlights: ["Тогтмол огноо", "Үндсэн хөтөлбөр", "Далай", "Хөтөч"],
    includes: ["Тийз", "Байр", "Үзвэр", "Шилжүүлэлт"],
    excludes: ["Хувийн зардал"],
    itinerary: [
      { day: "1–8", title: "Үндсэн хөтөлбөр", detail: "Хайнань далай + үзвэр." },
    ],
  },
  {
    id: "hainan-main-b",
    title: "Хайнань үндсэн аялал 11/10–11/17",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Үндсэн хөтөлбөртэй аялал",
    story: "11/10–11/17 огноотой Хайнань үндсэн аялал.",
    price: 2990000,
    duration: "8 өдөр · 7 шөнө",
    nights: 7,
    rating: 4.8,
    dates: "11/10 – 11/17",
    stay: "Зочид буудал",
    departure: "Улаанбаатар",
    image: "https://elitetravel.mn/__l5e/assets-v1/269c7c28-b5a3-46ae-b9ee-4b239417cbfa/hainan-main-sep15.png",
    gallery: ["https://elitetravel.mn/__l5e/assets-v1/269c7c28-b5a3-46ae-b9ee-4b239417cbfa/hainan-main-sep15.png"],
    highlights: ["Тогтмол огноо", "Үндсэн хөтөлбөр", "Далай"],
    includes: ["Тийз", "Байр", "Үзвэр"],
    excludes: ["Хувийн зардал"],
    itinerary: [
      { day: "1–8", title: "Үндсэн хөтөлбөр", detail: "Хайнань." },
    ],
  },
  {
    id: "bali",
    title: "Бали, Индонез",
    destination: "Бали",
    destinationKey: "bali",
    description: "Үндсэн хөтөлбөртэй аялал. /Хүссэн үедээ/",
    story: "Бали арал — Ubud + далайн эрэг. Хүссэн үедээ эхлэх боломжтой уян хатан аялал.",
    price: 5790000,
    oldPrice: 6290000,
    duration: "9 өдөр · 8 шөнө",
    nights: 8,
    rating: 4.9,
    tag: "sale",
    discount: "-8%",
    dates: "Хүссэн үедээ",
    stay: "Ubud + далайн буудал",
    departure: "Улаанбаатар",
    image: "https://elitetravel.mn/__l5e/assets-v1/5c891b94-99c0-43e5-ba48-5bd368e46bfb/bali-island.png",
    gallery: ["https://elitetravel.mn/__l5e/assets-v1/5c891b94-99c0-43e5-ba48-5bd368e46bfb/bali-island.png", "https://elitetravel.mn/__l5e/assets-v1/2e9a9b43-175a-424a-b3b2-c1a5c1e94222/hero-jungle-tall.webp"],
    highlights: ["Уян хатан огноо", "Ubud + далай", "8 шөнө", "Соёлын үзвэр"],
    includes: ["Тийз", "Байр", "Үзвэр", "Дотоод шилжүүлэлт"],
    excludes: ["Хувийн зардал", "Даатгал"],
    itinerary: [
      { day: "1–3", title: "Ubud", detail: "Ой, temple, cafe." },
      { day: "4–8", title: "Далай", detail: "Beach days, sunset." },
      { day: "9", title: "Буцах", detail: "УБ." },
    ],
  },
  {
    id: "bts",
    title: "BTS үзвэртэй аялал",
    destination: "Удахгүй",
    destinationKey: "soon",
    description: "Шинэ аялал бэлтгэгдэж байна",
    story: "BTS үзвэртэй шинэ аялал бэлтгэгдэж байна. Waitlist-д бүртгүүлээрэй.",
    price: null,
    duration: "Coming soon",
    nights: null,
    rating: 5,
    tag: "soon",
    image: "https://elitetravel.mn/__l5e/assets-v1/53fbda70-e185-458e-ac5f-6c0ff65288a2/bts-tour.jpg",
    gallery: ["https://elitetravel.mn/__l5e/assets-v1/53fbda70-e185-458e-ac5f-6c0ff65288a2/bts-tour.jpg"],
    highlights: ["Концерт", "Хот үзэх", "Удахгүй"],
    includes: ["Тун удахгүй"],
    excludes: ["Баталгаажаагүй"],
    itinerary: [{ day: "Soon", title: "Бэлтгэгдэж байна", detail: "Дэлгэрэнгүй удахгүй." }],
  },
  {
    id: "shakira-egypt",
    title: "SHAKIRA Египет үзвэртэй аялал",
    destination: "Египет",
    destinationKey: "soon",
    description: "Шинэ аялал бэлтгэгдэж байна",
    story: "Shakira + Египет тусгай аялал бэлтгэгдэж байна.",
    price: null,
    duration: "Coming soon",
    nights: null,
    rating: 5,
    tag: "soon",
    image: "https://elitetravel.mn/__l5e/assets-v1/847e6995-61b5-4cbc-b64b-cee410b3a47d/shakira-egypt.png",
    gallery: ["https://elitetravel.mn/__l5e/assets-v1/847e6995-61b5-4cbc-b64b-cee410b3a47d/shakira-egypt.png"],
    highlights: ["Концерт", "Египет", "Удахгүй"],
    includes: ["Тун удахгүй"],
    excludes: ["Баталгаажаагүй"],
    itinerary: [{ day: "Soon", title: "Бэлтгэгдэж байна", detail: "Дэлгэрэнгүй удахгүй." }],
  },
];
