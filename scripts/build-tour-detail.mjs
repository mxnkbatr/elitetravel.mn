import fs from "fs";
import path from "path";

const root = process.cwd();
function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, { encoding: "utf8" });
  console.log("ok", rel);
}

write(
  "src/data/tours.ts",
  `export type TourItineraryDay = {
  day: string;
  title: string;
  detail: string;
};

export type Tour = {
  id: string;
  title: string;
  destination: string;
  destinationKey: "hainan" | "hongkong" | "bali" | "soon";
  description: string;
  story: string;
  price: number | null;
  duration: string;
  nights: number | null;
  rating: number;
  tag?: "hot" | "soon";
  image: string;
  gallery: string[];
  dates?: string;
  stay?: string;
  groupSize?: string;
  departure?: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: TourItineraryDay[];
};

export function getTour(id: string) {
  return tours.find((t) => t.id === id);
}

export const destinations = [
  {
    key: "hainan",
    name: "Хайнань",
    en: "Hainan",
    blurb: "Далай, нар, амралт",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "hongkong",
    name: "Хонг Конг",
    en: "Hong Kong",
    blurb: "Хот, концерт, гэрэл",
    image:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "bali",
    name: "Бали",
    en: "Bali",
    blurb: "Арал, сэрүүн vibe",
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "egypt",
    name: "Египет",
    en: "Egypt",
    blurb: "Удахгүй нээгдэнэ",
    image:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1400&q=80",
  },
] as const;

export const tours: Tour[] = [
  {
    id: "weeknd-hk",
    title: "The Weeknd: Hong Kong аялал",
    destination: "Хонг Конг",
    destinationKey: "hongkong",
    description: "Тусгай аялал — концерт + хот",
    story:
      "Victoria Harbour-ийн гэрлүүд, хотын хурд, The Weeknd-ийн тайз — нэг аялалд. Концертын оройг төвлөрүүлж, үлдсэн өдрүүдээр хот үзэх, night vibe мэдрэх хөтөлбөртэй.",
    price: 6590000,
    duration: "5 өдөр · 4 шөнө",
    nights: 4,
    rating: 4.9,
    tag: "hot",
    dates: "Концертын огноогоор",
    stay: "4 одтой зочид буудал · Kowloon / Central",
    groupSize: "Жижиг групп",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "The Weeknd концертын тасалбар",
      "4 одтой зочид буудал",
      "Онгоцны тийз + шилжүүлэлт",
      "Хот үзэх хөтөлбөр",
    ],
    includes: [
      "ОУ-ын тийз (UB ↔ HKG)",
      "4 шөнийн байр, өглөөний цайтай",
      "Концертын тасалбар",
      "Нисэх буудлын шилжүүлэлт",
      "Хот үзэх хөтөлбөр (1 өдөр)",
      "Монгол хөтөч",
    ],
    excludes: [
      "Хувийн зардал, хоол (огшлоо/орой)",
      "Нэмэлт үзвэр, шоппинг",
      "Аяллын даатгал",
    ],
    itinerary: [
      {
        day: "1-р өдөр",
        title: "Нислэг · суурьшил",
        detail: "UB-аас нисэж, зочид буудалд суурьшина. Орой Victoria Harbour-ийн гэрлүүдийг үзнэ.",
      },
      {
        day: "2-р өдөр",
        title: "Хот үзэх",
        detail: "Central, Peak эсвэл street food route — хотын vibe мэдрэх өдөр.",
      },
      {
        day: "3-р өдөр",
        title: "Концертын орой",
        detail: "Бэлтгэл + The Weeknd show. Шөнийн дараа буудал руу буцаана.",
      },
      {
        day: "4-р өдөр",
        title: "Чөлөөт цаг",
        detail: "Шоппинг, кафе, photo spot — өөрийнхөөрөө өнгөрүүлнэ.",
      },
      {
        day: "5-р өдөр",
        title: "Буцах нислэг",
        detail: "Check-out, шилжүүлэлт, Улаанбаатар руу буцна.",
      },
    ],
  },
  {
    id: "dately-hainan",
    title: "Dately Show: Hainan Escape",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Тусгай хөтөлбөртэй амралт",
    story:
      "Саньягийн далай + Dately Show — залуусын эрэлттэй combo. Өдөр бүр далай, орой show vibe. Амрахыг хүссэн ч event мэдрэмжтэй байхыг хүссэн хүмүүст.",
    price: 2990000,
    duration: "8 өдөр · 7 шөнө",
    nights: 7,
    rating: 4.8,
    tag: "hot",
    dates: "Show-ийн хуваариар",
    stay: "Далайн эргийн зочид буудал · Sanya",
    groupSize: "Групп аялал",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Dately Show тусгай хөтөлбөр",
      "Далайн эргийн амралт",
      "7 шөнийн байр",
      "Өглөөний цай багтсан",
    ],
    includes: [
      "ОУ-ын тийз",
      "7 шөнийн байр + өглөөний цай",
      "Dately Show хөтөлбөр",
      "Шилжүүлэлт",
      "Үндсэн үзвэрүүд",
      "Монгол хөтөч",
    ],
    excludes: ["Хувийн зардал", "Нэмэлт усан спорт", "Даатгал"],
    itinerary: [
      {
        day: "1–2",
        title: "Ирэлт · далай",
        detail: "Саньяд бууж, буудалд суурьшина. Далайн эрэг, pool time.",
      },
      {
        day: "3–5",
        title: "Show + амралт",
        detail: "Dately Show орой, өдөр нь арал эсвэл далай.",
      },
      {
        day: "6–7",
        title: "Чөлөөт өдрүүд",
        detail: "Арал, shopping, cafe — хүссэнээрээ.",
      },
      {
        day: "8",
        title: "Буцах",
        detail: "Check-out, нислэг УБ руу.",
      },
    ],
  },
  {
    id: "hainan-main",
    title: "Хайнань үндсэн аялал",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Үндсэн хөтөлбөртэй далайн аялал",
    story:
      "Elite Travel-ийн хамгийн тогтмол огноотой Хайнань аялал. Далай, үзвэр, групп vibe — анх удаа явах хүмүүст тохиромжтой, үнэ/чанарын тэнцвэртэй.",
    price: 2690000,
    duration: "8 өдөр · 7 шөнө",
    nights: 7,
    rating: 4.8,
    dates: "Тогтмол огноотой",
    stay: "3–4 одтой зочид буудал · Sanya",
    groupSize: "Групп аялал",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Тогтмол огноотой хөтөлбөр",
      "Далайн үзвэрүүд",
      "Групп аялал",
      "Монгол хөтөч",
    ],
    includes: [
      "ОУ-ын тийз",
      "7 шөнийн байр + өглөөний цай",
      "Үндсэн үзвэрүүд",
      "Шилжүүлэлт",
      "Монгол хөтөч",
    ],
    excludes: ["Хувийн зардал", "Нэмэлт усан спорт", "Даатгал"],
    itinerary: [
      {
        day: "1",
        title: "Нислэг · Sanya",
        detail: "Ирэлт, буудал, далайн эргийн эхний алхалт.",
      },
      {
        day: "2–4",
        title: "Үзвэр + далай",
        detail: "Үндсэн хөтөлбөрийн үзвэрүүд, далайн өдрүүд.",
      },
      {
        day: "5–7",
        title: "Амралт",
        detail: "Чөлөөт цаг, арал эсвэл хотын хэсэг.",
      },
      {
        day: "8",
        title: "Буцах",
        detail: "Нислэг Улаанбаатар руу.",
      },
    ],
  },
  {
    id: "hainan-flex",
    title: "Хайнань уян хатан аялал",
    destination: "Хайнань",
    destinationKey: "hainan",
    description: "Хүссэн үедээ эхлэх боломжтой",
    story:
      "Огноогоо өөрөө сонгох уян хатан аялал. Илүү тансаг байр, хувийн хэрэгцээнд тохируулсан хөтөлбөр — хос, найзуудтайгаа явахад тохиромжтой.",
    price: 3290000,
    duration: "8 өдөр · 7 шөнө",
    nights: 7,
    rating: 4.8,
    dates: "Уян хатан огноо",
    stay: "Илүү тансаг далайн буудал",
    groupSize: "Жижиг / private",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Уян хатан огноо",
      "Илүү тансаг байр",
      "Хувийн хэрэгцээнд тохируулна",
      "Далай + хотын combo",
    ],
    includes: [
      "ОУ-ын тийз",
      "7 шөнийн тансаг байр",
      "Шилжүүлэлт",
      "Тохируулсан үзвэр",
      "Зөвлөгөө / support",
    ],
    excludes: ["Хувийн зардал", "Нэмэлт үйлчилгээ", "Даатгал"],
    itinerary: [
      {
        day: "1",
        title: "Ирэлт",
        detail: "Саньяд бууж, буудалд суурьшина.",
      },
      {
        day: "2–6",
        title: "Таны хөтөлбөр",
        detail: "Далай, арал, хот — хүссэнээрээ хольж болно.",
      },
      {
        day: "7–8",
        title: "Амралт · буцах",
        detail: "Сүүлийн өдөр chill, дараа нь УБ руу.",
      },
    ],
  },
  {
    id: "bali",
    title: "Бали, Индонез",
    destination: "Бали",
    destinationKey: "bali",
    description: "Арал + Ubud үндсэн хөтөлбөр",
    story:
      "Убудын ногоон ой, далайн эрэг, соёлын үзвэр — reset хийхэд тохиромжтой 9 өдөр. Сэрүүн vibe хайж буй залууст.",
    price: 6290000,
    duration: "9 өдөр · 8 шөнө",
    nights: 8,
    rating: 4.9,
    dates: "Хүссэн үедээ эхлэх боломжтой",
    stay: "Ubud + далайн эргийн буудал",
    groupSize: "Жижиг групп / уян",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Убуд + далайн эрэг",
      "8 шөнийн байр",
      "Соёлын үзвэрүүд",
      "Хүссэн үедээ эхлэх боломжтой",
    ],
    includes: [
      "ОУ-ын тийз",
      "8 шөнийн байр",
      "Үндсэн үзвэрүүд",
      "Дотоод шилжүүлэлт",
      "Зөвлөгөө / support",
    ],
    excludes: ["Хувийн зардал", "Нэмэлт spa / activity", "Даатгал"],
    itinerary: [
      {
        day: "1–2",
        title: "Ubud",
        detail: "Ой, temple, cafe — сэрүүн эхлэл.",
      },
      {
        day: "3–5",
        title: "Соёл + nature",
        detail: "Үзвэр, rice terrace, local vibe.",
      },
      {
        day: "6–8",
        title: "Далайн эрэг",
        detail: "Seminyak / beach days, sunset.",
      },
      {
        day: "9",
        title: "Буцах",
        detail: "Нислэг УБ руу.",
      },
    ],
  },
  {
    id: "bts",
    title: "BTS үзвэртэй аялал",
    destination: "Удахгүй",
    destinationKey: "soon",
    description: "Шинэ аялал бэлтгэгдэж байна",
    story:
      "Концерт + хот үзэх шинэ хөтөлбөр бэлтгэгдэж байна. Сонирхож байгаа бол холбогдоод waitlist-д бүртгүүлээрэй — нээгдэхэд эхний мэдээг хүргэнэ.",
    price: null,
    duration: "Coming soon",
    nights: null,
    rating: 5,
    tag: "soon",
    dates: "Удахгүй зарлана",
    stay: "Тун удахгүй",
    groupSize: "Тун удахгүй",
    departure: "Улаанбаатар",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Концертын тасалбар",
      "Хот үзэх хөтөлбөр",
      "Байр + шилжүүлэлт",
      "Удахгүй нээгдэнэ",
    ],
    includes: ["Тун удахгүй дэлгэрэнгүй зарлана"],
    excludes: ["Одоогоор баталгаажаагүй"],
    itinerary: [
      {
        day: "Soon",
        title: "Хөтөлбөр бэлтгэгдэж байна",
        detail: "Нээгдэхэд өдөр тутмын хуваарь нийтлэгдэнэ.",
      },
    ],
  },
];

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
`,
);

write(
  "src/components/TourDetailView.tsx",
  `"use client";

import { formatPrice, relatedTours, type Tour } from "@/data/tours";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function TourDetailView({ tour }: { tour: Tour }) {
  const related = relatedTours(tour.id, 3);
  const facts = [
    { label: "Үргэлжлэх", value: tour.duration },
    { label: "Огноо", value: tour.dates ?? "Холбогдоно уу" },
    { label: "Байр", value: tour.stay ?? "—" },
    { label: "Гарц", value: tour.departure ?? "Улаанбаатар" },
  ];

  return (
    <div className="relative pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/tours"
          className="mb-4 inline-flex items-center gap-2 text-sm tracking-[0.01em] text-foam/65 transition hover:text-foam"
        >
          ← Аяллууд руу буцах
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[28px]"
        >
          <div className="relative h-[58vw] min-h-[280px] max-h-[460px] sm:h-[420px]">
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/35 to-bg/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-bg/55 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
                  ★ {tour.rating.toFixed(1)}
                </span>
                {tour.tag === "hot" && (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-bg">
                    Эрэлттэй
                  </span>
                )}
                {tour.tag === "soon" && (
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
                    Удахгүй
                  </span>
                )}
                {tour.groupSize ? (
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
                    {tour.groupSize}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
                {tour.destination}
              </p>
              <h1 className="mt-1 max-w-2xl font-display text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">
                {tour.title}
              </h1>
              <p className="mt-2 max-w-xl text-sm tracking-[0.01em] text-foam/75 sm:text-base">
                {tour.description}
                {tour.nights != null ? \` · \${tour.nights} шөнө\` : ""}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick facts */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {facts.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl glass-strong px-3.5 py-3"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.14em] text-foam/45">
                {f.label}
              </p>
              <p className="mt-1 text-sm font-medium leading-snug tracking-[0.01em]">
                {f.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            {/* Story */}
            <section className="rounded-[24px] glass-strong p-5 sm:p-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                Overview
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                Аяллын тухай
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed tracking-[0.01em] text-foam/72">
                {tour.story}
              </p>
            </section>

            {/* Highlights */}
            <section className="rounded-[24px] glass-strong p-5 sm:p-6">
              <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">
                Онцлох зүйлс
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {tour.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-white/[0.04] px-4 py-3 text-sm tracking-[0.01em] ring-1 ring-white/8"
                  >
                    <span className="mt-0.5 text-accent">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Itinerary */}
            <section className="rounded-[24px] glass-strong p-5 sm:p-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                Itinerary
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.02em]">
                Өдөр тутмын хөтөлбөр
              </h2>
              <ol className="mt-5 space-y-0">
                {tour.itinerary.map((step, i) => (
                  <li key={step.day + step.title} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < tour.itinerary.length - 1 ? (
                      <span className="absolute left-[11px] top-7 h-[calc(100%-1.25rem)] w-px bg-white/10" />
                    ) : null}
                    <span className="relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-[0.65rem] font-semibold text-accent ring-1 ring-accent/30">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
                        {step.day}
                      </p>
                      <h3 className="mt-1 font-display text-base font-semibold tracking-[-0.02em]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed tracking-[0.01em] text-foam/65">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Includes / excludes */}
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] glass-strong p-5">
                <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
                  Юу багтсан бэ
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {tour.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm tracking-[0.01em] text-foam/75"
                    >
                      <span className="mt-0.5 text-accent">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[24px] glass-strong p-5">
                <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
                  Багтаагүй
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {tour.excludes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm tracking-[0.01em] text-foam/55"
                    >
                      <span className="mt-0.5 text-foam/35">–</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Gallery */}
            {tour.gallery.length > 0 ? (
              <section>
                <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.02em]">
                  Зургууд
                </h2>
                <div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
                  {tour.gallery.map((src) => (
                    <div
                      key={src}
                      className="relative h-44 w-[72vw] shrink-0 overflow-hidden rounded-[20px] sm:h-48 sm:w-auto"
                    >
                      <Image
                        src={src}
                        alt={tour.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 72vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Desktop sticky price card */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-[24px] glass-strong p-6">
                <p className="text-xs tracking-[0.02em] text-foam/50">Үнэ</p>
                <p className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em] text-accent">
                  {formatPrice(tour.price)}
                </p>
                <p className="mt-2 text-sm text-foam/60">{tour.duration}</p>
                <Link
                  href="/contact"
                  className="mt-5 flex h-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-bg transition hover:bg-accent-soft active:scale-95"
                >
                  {tour.tag === "soon" ? "Waitlist-д бүртгүүлэх" : "Захиалга өгөх"}
                </Link>
                <a
                  href="tel:+97690031771"
                  className="mt-3 flex h-12 items-center justify-center rounded-full text-sm font-medium glass transition active:scale-95"
                >
                  +976 9003 1771
                </a>
              </div>
              <div className="rounded-[22px] bg-white/[0.03] p-4 text-sm tracking-[0.01em] text-foam/60 ring-1 ring-white/8">
                Асуулт байвал шууд залгаарай — аяллын зөвлөх 10:00–20:00 цагт хариулна.
              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                More trips
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold tracking-[-0.02em]">
                Төстэй аяллууд
              </h2>
            </div>
            <Link href="/tours" className="text-sm font-medium text-accent">
              Бүгдийг үзэх →
            </Link>
          </div>
          <div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
            {related.map((r) => (
              <Link
                key={r.id}
                href={\`/tours/\${r.id}\`}
                className="w-[74vw] shrink-0 overflow-hidden rounded-[22px] glass-strong transition active:scale-[0.98] sm:w-auto"
              >
                <div className="relative h-36">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 74vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
                </div>
                <div className="p-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                    {r.destination}
                  </p>
                  <h3 className="mt-1 font-display text-base font-semibold tracking-[-0.02em]">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-sm text-accent">{formatPrice(r.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile sticky CTA — clears dock */}
      <div className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[55] px-3 sm:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-[1.35rem] glass-strong p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <div className="min-w-0 flex-1 pl-2">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-foam/45">
              Үнэ
            </p>
            <p className="truncate font-display text-lg font-semibold text-accent">
              {formatPrice(tour.price)}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-accent px-5 text-sm font-semibold text-bg active:scale-95"
          >
            {tour.tag === "soon" ? "Waitlist" : "Захиалах"}
          </Link>
        </div>
      </div>
    </div>
  );
}
`,
);

write(
  "src/app/tours/[id]/page.tsx",
  `import { TourDetailView } from "@/components/TourDetailView";
import { getTour, tours } from "@/data/tours";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type TourDetailProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return tours.map((tour) => ({ id: tour.id }));
}

export async function generateMetadata({
  params,
}: TourDetailProps): Promise<Metadata> {
  const { id } = await params;
  const tour = getTour(id);
  if (!tour) return { title: "Аялал" };
  return {
    title: tour.title,
    description: tour.story,
  };
}

export default async function TourDetailPage({ params }: TourDetailProps) {
  const { id } = await params;
  const tour = getTour(id);
  if (!tour) notFound();

  return (
    <div className="page-pad-top">
      <TourDetailView tour={tour} />
    </div>
  );
}
`,
);

console.log("tour detail done");
