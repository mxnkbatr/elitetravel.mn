import fs from "fs";
import path from "path";

function write(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("ok", rel);
}

const IMG = {
  hero: "https://elitetravel.mn/__l5e/assets-v1/2e9a9b43-175a-424a-b3b2-c1a5c1e94222/hero-jungle-tall.webp",
  logo: "https://elitetravel.mn/__l5e/assets-v1/82ebf29a-63bf-4858-a2e3-dda997244111/elite-logo.png",
  weeknd: "https://elitetravel.mn/__l5e/assets-v1/c38f5ae9-77ea-46f7-bed4-345fc9952db6/weeknd-hongkong.png",
  dately: "https://elitetravel.mn/__l5e/assets-v1/378c2bed-1ce8-486a-a59d-1c97c2546511/dately-show-hainan.png",
  hainanSep: "https://elitetravel.mn/__l5e/assets-v1/269c7c28-b5a3-46ae-b9ee-4b239417cbfa/hainan-main-sep15.png",
  hainanOct: "https://elitetravel.mn/__l5e/assets-v1/8ce9b508-74d0-44a0-89ed-cf34d352091e/hainan-overview.png",
  bali: "https://elitetravel.mn/__l5e/assets-v1/5c891b94-99c0-43e5-ba48-5bd368e46bfb/bali-island.png",
  bts: "https://elitetravel.mn/__l5e/assets-v1/53fbda70-e185-458e-ac5f-6c0ff65288a2/bts-tour.jpg",
  shakira: "https://elitetravel.mn/__l5e/assets-v1/847e6995-61b5-4cbc-b64b-cee410b3a47d/shakira-egypt.png",
};

write(
  "src/data/tours.ts",
  `export type Tour = {
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
  const digits = String(price).replace(/\\B(?=(\\d{3})+(?!\\d))/g, "'");
  return \`₮\${digits}\`;
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
    image: "${IMG.hainanOct}",
  },
  {
    key: "hongkong",
    name: "Хонг Конг",
    en: "Hong Kong",
    blurb: "Хот, концерт, night vibe",
    image: "${IMG.weeknd}",
  },
  {
    key: "bali",
    name: "Бали",
    en: "Bali",
    blurb: "Арал, Ubud, уян хатан огноо",
    image: "${IMG.bali}",
  },
  {
    key: "egypt",
    name: "Египет",
    en: "Egypt",
    blurb: "Удахгүй — концерт аялал",
    image: "${IMG.shakira}",
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
    image: "${IMG.weeknd}",
    gallery: ["${IMG.weeknd}", "${IMG.hero}"],
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
    image: "${IMG.dately}",
    gallery: ["${IMG.dately}", "${IMG.hainanOct}"],
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
    image: "${IMG.hainanSep}",
    gallery: ["${IMG.hainanSep}", "${IMG.hainanOct}"],
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
    image: "${IMG.hainanOct}",
    gallery: ["${IMG.hainanOct}", "${IMG.hainanSep}"],
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
    image: "${IMG.hainanSep}",
    gallery: ["${IMG.hainanSep}"],
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
    image: "${IMG.hainanSep}",
    gallery: ["${IMG.hainanSep}"],
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
    image: "${IMG.bali}",
    gallery: ["${IMG.bali}", "${IMG.hero}"],
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
    image: "${IMG.bts}",
    gallery: ["${IMG.bts}"],
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
    image: "${IMG.shakira}",
    gallery: ["${IMG.shakira}"],
    highlights: ["Концерт", "Египет", "Удахгүй"],
    includes: ["Тун удахгүй"],
    excludes: ["Баталгаажаагүй"],
    itinerary: [{ day: "Soon", title: "Бэлтгэгдэж байна", detail: "Дэлгэрэнгүй удахгүй." }],
  },
];
`,
);

write(
  "src/data/places.ts",
  `import { destinations, formatPrice, tours } from "@/data/tours";

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
    tourFilter: d.key as DestinationProfile["tourFilter"],
  };
});

export const resorts: Resort[] = [
  {
    id: "sanya",
    name: "Sanya Beach",
    place: "Санья",
    country: "Хайнань",
    blurb: "Хайнань аяллын гол амралтын бүс.",
    image: "${IMG.hainanOct}",
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
    image: "${IMG.bali}",
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
    image: "${IMG.weeknd}",
    tags: ["City", "Night"],
    rating: 4.9,
    fromPrice: 6290000,
  },
];

export function formatFromPrice(price: number | null) {
  if (price == null) return "Удахгүй";
  return formatPrice(price) + "-с";
}
`,
);

write(
  "src/app/globals.css",
  `@import "tailwindcss";

:root {
  /* Epic-inspired clean travel — light, teal, airy */
  --bg: #f6f3ee;
  --bg-soft: #fffdf9;
  --ink: #142824;
  --ink-soft: #3d524c;
  --muted: #6b7f78;
  --line: rgba(20, 40, 36, 0.1);
  --accent: #0b6b5c;
  --accent-soft: #148f7a;
  --accent-mist: #d8efe9;
  --foam: #142824;
  --shadow: 0 18px 50px rgba(20, 40, 36, 0.08);
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --dock-h: 0px;
  --nav-h: calc(4.5rem + env(safe-area-inset-top, 0px));
}

@theme inline {
  --color-bg: var(--bg);
  --color-bg-elevated: var(--bg-soft);
  --color-surface: var(--bg-soft);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-accent-deep: var(--accent);
  --color-foam: var(--ink);
  --color-muted: var(--muted);
  --color-mint: var(--accent);
  --color-mint-soft: var(--accent-soft);
  --color-mint-deep: var(--accent);
  --color-forest: var(--ink);
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
}

@utility font-display {
  font-family: var(--font-display), Georgia, "Times New Roman", serif;
  letter-spacing: -0.02em;
  font-feature-settings: "kern" 1, "liga" 1;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html {
  scroll-behavior: smooth;
  height: 100%;
}

body {
  margin: 0;
  min-height: 100%;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans), system-ui, sans-serif;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

::selection {
  background: color-mix(in oklab, var(--accent) 35%, white);
  color: var(--ink);
}

.ambient {
  display: none;
}

.app-main {
  position: relative;
  z-index: 10;
  min-height: 100dvh;
}

.page-pad-top {
  padding-top: calc(6.5rem + env(safe-area-inset-top, 0px));
}

.glass,
.glass-strong,
.liquid-sheet,
.ios-surface,
.glass-chip {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  box-shadow: none;
  backdrop-filter: none;
}

.glass::before,
.glass-strong::before {
  display: none;
}

.accent-shimmer {
  background: var(--accent);
  color: white;
  box-shadow: none;
  animation: none;
}

.hide-scrollbar {
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.snap-x-mandatory {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.snap-start {
  scroll-snap-align: start;
}

.epic-rule {
  width: 2.5rem;
  height: 2px;
  background: var(--accent);
}

.epic-card {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 1.25rem;
  overflow: hidden;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.epic-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}
`,
);

write(
  "next.config.ts",
  `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "elitetravel.mn" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
`,
);

console.log("data + css done");
