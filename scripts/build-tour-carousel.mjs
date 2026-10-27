import fs from "fs";
import path from "path";

function write(rel, content) {
  fs.mkdirSync(path.dirname(path.join(process.cwd(), rel)), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), rel), content, "utf8");
  console.log("ok", rel);
}

write(
  "src/components/ToursCarousel.tsx",
  `"use client";

import { formatPrice, tours, type Tour } from "@/data/tours";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

function TourSlideCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={\`/tours/\${tour.id}\`}
      className="epic-card group block h-full w-[min(82vw,300px)] shrink-0 snap-start sm:w-[320px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-white/95 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-ink">
            {tour.destination}
          </span>
          {tour.discount ? (
            <span className="rounded-md bg-accent px-2 py-1 text-[0.65rem] font-semibold text-white">
              {tour.discount}
            </span>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3.5 text-white">
          <p className="text-xs font-medium text-white/90">{tour.duration}</p>
          <div className="text-right">
            <p className="font-display text-lg font-semibold leading-none">
              {formatPrice(tour.price)}
            </p>
            {tour.oldPrice ? (
              <p className="mt-0.5 text-[0.7rem] text-white/55 line-through">
                {formatPrice(tour.oldPrice)}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[1.05rem] font-semibold leading-snug tracking-[-0.02em] transition group-hover:text-accent">
            {tour.title}
          </h3>
          <span className="shrink-0 pt-0.5 text-xs font-semibold text-foam/70">
            ★ {tour.rating.toFixed(1)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted">{tour.description}</p>
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <span aria-hidden className="text-accent">
            ○
          </span>
          {tour.departure ?? "Улаанбаатар"} · {tour.destination}
        </p>
      </div>
    </Link>
  );
}

export function ToursCarousel() {
  const scroller = useRef<HTMLDivElement>(null);
  const list = tours.filter((t) => t.tag !== "soon");

  function scrollBy(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * 340, behavior: "smooth" });
  }

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="max-w-xl">
            <div className="epic-rule mb-4" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#e8a84a]">
              Best offers
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Мөрөөдлийн{" "}
              <span className="text-accent">аяллаа</span> сонго
            </h2>
            <p className="mt-3 text-sm text-muted sm:text-base">
              Хажуу тийш гүйлгээд Elite Travel-ийн аяллуудыг үзээрэй.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Зүүн"
              onClick={() => scrollBy(-1)}
              className="grid size-10 place-items-center rounded-full border border-[var(--line)] bg-bg-elevated text-foam transition hover:border-accent hover:text-accent"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Баруун"
              onClick={() => scrollBy(1)}
              className="grid size-10 place-items-center rounded-full border border-[var(--line)] bg-bg-elevated text-foam transition hover:border-accent hover:text-accent"
            >
              →
            </button>
            <Link
              href="/tours"
              className="ml-1 inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Бүх аялал →
            </Link>
          </div>
        </motion.div>
      </div>

      <div
        ref={scroller}
        className="hide-scrollbar snap-x-mandatory flex gap-4 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
      >
        {list.map((tour) => (
          <TourSlideCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  );
}
`,
);

write(
  "src/components/Tours.tsx",
  `"use client";

import { formatPrice, tours } from "@/data/tours";
import { filterChipClass } from "@/lib/ui";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const filters = [
  { key: "all", label: "Бүгд" },
  { key: "hainan", label: "Хайнань" },
  { key: "hongkong", label: "Хонг Конг" },
  { key: "bali", label: "Бали" },
  { key: "soon", label: "Удахгүй" },
] as const;

type ToursProps = {
  showHeader?: boolean;
  limit?: number;
  initialFilter?: string;
};

export function Tours({
  showHeader = true,
  limit,
  initialFilter = "all",
}: ToursProps) {
  const start = filters.some((f) => f.key === initialFilter) ? initialFilter : "all";
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>(
    start as (typeof filters)[number]["key"],
  );

  useEffect(() => {
    if (filters.some((f) => f.key === initialFilter)) {
      setFilter(initialFilter as (typeof filters)[number]["key"]);
    }
  }, [initialFilter]);

  const visible = useMemo(() => {
    const list =
      filter === "all" ? tours : tours.filter((t) => t.destinationKey === filter);
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }, [filter, limit]);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeader ? (
          <motion.div
            className="mb-6 flex items-end justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-xl">
              <div className="epic-rule mb-4" />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
                Tours
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Аяллууд
              </h2>
              <p className="mt-3 text-sm text-muted sm:text-base">
                elitetravel.mn дээрх бодит аяллууд — үнэ, огноо шинэчлэгдсэн.
              </p>
            </div>
          </motion.div>
        ) : null}

        <div className="hide-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={filterChipClass(filter === f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((tour, i) => (
              <motion.article
                layout
                key={tour.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: Math.min(i, 5) * 0.04, duration: 0.4 }}
                className="epic-card group"
              >
                <Link href={\`/tours/\${tour.id}\`} className="block">
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-medium text-ink">
                        ★ {tour.rating.toFixed(1)}
                      </span>
                      {tour.discount ? (
                        <span className="rounded-full bg-accent px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                          {tour.discount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-3 p-4 sm:p-5">
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                        {tour.destination}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold leading-snug tracking-[-0.02em]">
                        {tour.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{tour.description}</p>
                    </div>
                    <div className="flex items-end justify-between gap-3 border-t border-[var(--line)] pt-3">
                      <div>
                        <p className="text-xs text-muted">{tour.duration}</p>
                        <p className="mt-0.5 text-base font-semibold text-accent">
                          {formatPrice(tour.price)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-accent">Дэлгэрэнгүй →</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
`,
);

write(
  "src/app/page.tsx",
  `"use client";

import { Destinations } from "@/components/Destinations";
import { FeaturedTour } from "@/components/FeaturedTour";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { PromiseStrip } from "@/components/PromiseStrip";
import { Section } from "@/components/Section";
import { ToursCarousel } from "@/components/ToursCarousel";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Section className="space-y-16 py-14 sm:space-y-20 sm:py-20">
        <PromiseStrip />
        <Destinations />
        <FeaturedTour />
        <ToursCarousel />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-[1.5rem]"
          >
            <div className="absolute inset-0">
              <Image
                src="https://elitetravel.mn/__l5e/assets-v1/5c891b94-99c0-43e5-ba48-5bd368e46bfb/bali-island.png"
                alt=""
                fill
                className="object-cover"
                sizes="1152px"
              />
              <div className="absolute inset-0 bg-accent/85" />
            </div>
            <div className="relative px-6 py-12 text-white sm:px-10 sm:py-14">
              <div className="epic-rule mb-5 bg-gradient-to-r from-[#e8a84a] to-white/70" />
              <h2 className="max-w-lg font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Дараагийн аяллаа хамтдаа төлөвлөе
              </h2>
              <p className="mt-3 max-w-lg text-white/85">
                Instagram, Messenger эсвэл утсаар шууд холбогдоорой — Elite Travel зөвлөхүүд тусална.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-accent"
                >
                  Холбоо барих
                </Link>
                <a
                  href="tel:+97690031771"
                  className="inline-flex h-11 items-center rounded-full border border-white/45 px-5 text-sm font-medium text-white"
                >
                  +976 9003 1771
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
`,
);

console.log("carousel done");
