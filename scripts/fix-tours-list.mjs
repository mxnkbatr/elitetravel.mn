import fs from "fs";

const content = `"use client";

import { formatPrice, tours } from "@/data/tours";
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
    <section className="relative z-10">
      <div className="mx-auto max-w-6xl">
        {showHeader ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 flex items-end justify-between gap-4"
          >
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
                Tours
              </p>
              <h2 className="mt-2 font-display text-[1.7rem] font-semibold tracking-[-0.03em] sm:text-4xl">
                Эрэлттэй аяллууд
              </h2>
              <p className="mt-3 max-w-lg text-sm tracking-[0.01em] text-foam/65 sm:text-base">
                Концерт, далай, хот — таны vibe-д таарсан аяллыг сонгоорой.
              </p>
            </div>
            {limit ? (
              <Link
                href="/tours"
                className="hidden shrink-0 text-sm font-medium text-accent sm:inline"
              >
                Бүгдийг үзэх →
              </Link>
            ) : null}
          </motion.div>
        ) : null}

        <div className="hide-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={\`shrink-0 rounded-full px-4 py-2.5 text-sm tracking-[0.01em] transition active:scale-95 \${
                  active
                    ? "bg-accent font-semibold text-bg"
                    : "glass text-foam/75 hover:text-foam"
                }\`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((tour) => (
              <motion.article
                layout
                key={tour.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-[24px] glass-strong"
              >
                <Link href={\`/tours/\${tour.id}\`} className="block">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <span className="rounded-full bg-bg/55 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
                        ★ {tour.rating.toFixed(1)}
                      </span>
                      {tour.tag === "hot" && (
                        <span className="rounded-full bg-accent/90 px-2.5 py-1 text-xs font-semibold text-bg">
                          Эрэлттэй
                        </span>
                      )}
                      {tour.tag === "soon" && (
                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
                          Удахгүй
                        </span>
                      )}
                    </div>
                    <p className="absolute bottom-3 left-3 font-display text-2xl font-semibold tracking-[-0.02em]">
                      {tour.destination.toUpperCase()}
                    </p>
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="font-display text-[1.05rem] font-semibold leading-snug tracking-[-0.02em]">
                        {tour.title}
                      </h3>
                      <p className="mt-1 text-sm tracking-[0.01em] text-foam/60">
                        {tour.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs tracking-[0.01em] text-foam/50">
                          {tour.duration}
                        </p>
                        <p className="mt-0.5 text-base font-semibold tracking-[0.01em] text-accent">
                          {formatPrice(tour.price)}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium tracking-[0.01em] ring-1 ring-white/15 transition group-hover:bg-accent group-hover:text-bg group-hover:ring-accent">
                        Дэлгэрэнгүй
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {limit ? (
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/tours"
              className="inline-flex h-11 items-center rounded-full px-6 text-sm font-medium glass"
            >
              Бүх аяллыг үзэх
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
`;

fs.writeFileSync("src/components/Tours.tsx", content, "utf8");
console.log("ok Tours.tsx");
