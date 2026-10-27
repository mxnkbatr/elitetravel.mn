import fs from "fs";
import path from "path";

const root = process.cwd();
function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content, { encoding: "utf8" });
  console.log("ok", rel);
}

write(
  "src/data/places.ts",
  `export type DestinationProfile = {
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
      "https://images.unsplash.com/photo-1537996194471-e667f967cdbb?auto=format&fit=crop&w=1400&q=80",
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
  const digits = String(price).replace(/\\B(?=(\\d{3})+(?!\\d))/g, "'");
  return \`₮\${digits}-с\`;
}
`,
);

write(
  "src/components/DestinationsPage.tsx",
  `"use client";

import { destinationProfiles, formatFromPrice } from "@/data/places";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function DestinationsPageView() {
  const [active, setActive] = useState(destinationProfiles[0].key);
  const selected =
    destinationProfiles.find((d) => d.key === active) ?? destinationProfiles[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {destinationProfiles.map((d) => {
          const on = d.key === active;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setActive(d.key)}
              className={\`shrink-0 rounded-full px-4 py-2.5 text-sm tracking-[0.01em] transition active:scale-95 \${
                on
                  ? "bg-accent font-semibold text-bg"
                  : "glass text-foam/75 hover:text-foam"
              }\`}
            >
              {d.name}
            </button>
          );
        })}
      </div>

      <motion.div
        key={selected.key}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-[28px] glass-strong"
      >
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[260px] sm:min-h-[340px]">
            <Image
              src={selected.image}
              alt={selected.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 55vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                {selected.en}
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                {selected.name}
              </h2>
            </div>
          </div>

          <div className="flex flex-col justify-between p-5 sm:p-7">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                Destination profile
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed tracking-[0.01em] text-foam/75">
                {selected.blurb}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-foam/45">
                    Vibe
                  </p>
                  <p className="mt-1 text-sm font-medium">{selected.vibe}</p>
                </div>
                <div className="rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-foam/45">
                    Улирал
                  </p>
                  <p className="mt-1 text-sm font-medium">{selected.bestSeason}</p>
                </div>
                <div className="col-span-2 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-foam/45">
                    Үнэ
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-accent">
                    {formatFromPrice(selected.fromPrice)}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {selected.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 text-sm text-foam/75"
                  >
                    <span className="text-accent">✦</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={\`/tours?dest=\${selected.tourFilter}\`}
                className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-bg"
              >
                Аяллууд үзэх
              </Link>
              <Link
                href="/resorts"
                className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium glass"
              >
                Амралтын газрууд
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {destinationProfiles.map((d, i) => (
          <motion.button
            key={d.key}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setActive(d.key)}
            className={\`overflow-hidden rounded-[22px] text-left transition \${
              d.key === active
                ? "ring-2 ring-accent"
                : "ring-1 ring-white/10 hover:ring-white/25"
            }\`}
          >
            <div className="relative h-36">
              <Image src={d.image} alt={d.name} fill className="object-cover" sizes="25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="font-display text-lg font-semibold">{d.name}</p>
                <p className="text-xs text-foam/65">{d.vibe}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
`,
);

write(
  "src/components/ResortsPage.tsx",
  `"use client";

import { formatFromPrice, resorts } from "@/data/places";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function ResortsPageView() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resorts.map((resort, i) => (
          <motion.article
            key={resort.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="overflow-hidden rounded-[24px] glass-strong"
          >
            <div className="relative h-48">
              <Image
                src={resort.image}
                alt={resort.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-bg/55 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
                ★ {resort.rating.toFixed(1)}
              </span>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
                  {resort.country}
                </p>
                <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">
                  {resort.name}
                </h2>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <p className="text-sm text-foam/60">{resort.place}</p>
              <p className="text-sm leading-relaxed tracking-[0.01em] text-foam/75">
                {resort.blurb}
              </p>
              <div className="flex flex-wrap gap-2">
                {resort.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[0.7rem] text-foam/70 ring-1 ring-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="font-semibold text-accent">
                  {formatFromPrice(resort.fromPrice)}
                </p>
                <Link
                  href="/contact"
                  className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium ring-1 ring-white/15 transition hover:bg-accent hover:text-bg hover:ring-accent"
                >
                  Асуух
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
`,
);

write(
  "src/components/ProfilePage.tsx",
  `"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const stats = [
  { label: "Сонирхсон", value: "3" },
  { label: "Аялал", value: "0" },
  { label: "Удахгүй", value: "2" },
];

const saved = [
  {
    title: "Хайнань үндсэн аялал",
    meta: "8 өдөр · ₮2'690'000",
    href: "/tours/hainan-main",
  },
  {
    title: "Бали, Индонез",
    meta: "9 өдөр · ₮6'290'000",
    href: "/tours/bali",
  },
];

export function ProfilePageView() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[28px] glass-strong"
      >
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/40">
            <Image
              src="/elite-logo.png"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
              Profile
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Аялагч
            </h1>
            <p className="mt-2 text-sm tracking-[0.01em] text-foam/65">
              Explore. Dream. Discover. — таны хадгалсан аялал, сонирхол энд.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-bg"
          >
            Зөвлөгөө авах
          </Link>
        </div>

        <div className="grid grid-cols-3 border-t border-white/10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border-r border-white/10 px-4 py-4 text-center last:border-r-0"
            >
              <p className="font-display text-xl font-semibold text-accent">
                {s.value}
              </p>
              <p className="mt-1 text-[0.7rem] tracking-[0.04em] text-foam/55">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="rounded-[24px] glass-strong p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
            Хадгалсан аяллууд
          </h2>
          <Link href="/tours" className="text-sm text-accent">
            Бүгдийг үзэх
          </Link>
        </div>
        <div className="space-y-3">
          {saved.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/10 transition hover:bg-white/[0.07]"
            >
              <div>
                <p className="font-medium tracking-[0.01em]">{item.title}</p>
                <p className="mt-0.5 text-sm text-foam/55">{item.meta}</p>
              </div>
              <span className="text-accent">→</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/destinations"
          className="rounded-[22px] glass p-5 transition hover:bg-white/10"
        >
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-accent">
            Чиглэл
          </p>
          <p className="mt-2 font-display text-lg font-semibold">Аяллын чиглэлүүд</p>
        </Link>
        <Link
          href="/resorts"
          className="rounded-[22px] glass p-5 transition hover:bg-white/10"
        >
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-accent">
            Амралт
          </p>
          <p className="mt-2 font-display text-lg font-semibold">Амралтын газрууд</p>
        </Link>
        <Link
          href="/contact"
          className="rounded-[22px] glass p-5 transition hover:bg-white/10"
        >
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-accent">
            Холбоо
          </p>
          <p className="mt-2 font-display text-lg font-semibold">Захиалга өгөх</p>
        </Link>
      </div>
    </div>
  );
}
`,
);

console.log("components written");
