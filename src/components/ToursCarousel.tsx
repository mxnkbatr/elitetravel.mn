"use client";

import { formatPrice, tours, type Tour } from "@/data/tours";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_MS = 3400;

function TourSlideCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.id}`}
      className="dream-glass group block h-full w-[min(78vw,280px)] shrink-0 snap-start overflow-hidden rounded-[1.25rem] sm:w-[300px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="300px"
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
  const [paused, setPaused] = useState(false);
  const list = tours.filter((t) => t.tag !== "soon");

  const scrollBy = useCallback((dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("a.dream-glass");
    const step = (card?.offsetWidth ?? 280) + 16;
    const max = el.scrollWidth - el.clientWidth;
    let next = el.scrollLeft + dir * step;

    if (dir === 1 && el.scrollLeft >= max - 8) {
      next = 0;
    } else if (dir === -1 && el.scrollLeft <= 8) {
      next = max;
    }

    el.scrollTo({ left: next, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (paused || list.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => scrollBy(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, list.length, scrollBy]);

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <div className="epic-rule mb-4" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#e8b86d]">
              Best offers
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Мөрөөдлийн <span className="text-accent">аяллаа</span> сонго
            </h2>
            <p className="mt-3 text-sm text-muted sm:text-base">
              Өөрөө шилжинэ — эсвэл хажуу тийш гүйлгээд үзээрэй.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
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
        </div>

        <div
          ref={scroller}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          className="hide-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-1 px-1 pb-3"
        >
          {list.map((tour) => (
            <TourSlideCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
