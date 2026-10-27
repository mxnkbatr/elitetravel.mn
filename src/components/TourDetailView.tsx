"use client";

import { BookingPlanner } from "@/components/BookingPlanner";
import { SaveButton } from "@/components/SaveButton";
import { BookingSheet, TourTabs } from "@/components/TourMobile";
import { formatPrice, isBookable, relatedTours, type ItineraryDay, type Tour } from "@/data/tours";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function TourDetailView({ tour }: { tour: Tour }) {
  const related = relatedTours(tour.id, 3);
  const [sheetOpen, setSheetOpen] = useState(false);
  const bookable = isBookable(tour);
  const facts = [
    { label: "Үргэлжлэх", value: tour.duration },
    { label: "Огноо", value: tour.dates ?? "Холбогдоно уу" },
    { label: "Байр", value: tour.stay ?? "—" },
    { label: "Гарц", value: tour.departure ?? "Улаанбаатар" },
  ];

  return (
    <div className="relative w-full max-w-[100vw] overflow-x-clip pb-16 sm:pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 pt-[calc(5.5rem+env(safe-area-inset-top))] sm:px-6">
        <Link
          href="/tours"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-accent"
        >
          <span aria-hidden>←</span>
          Аяллууд руу буцах
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="epic-card overflow-hidden"
        >
          <div className="relative aspect-[4/5] w-full max-h-[56svh] min-h-[240px] sm:aspect-[21/9] sm:max-h-none">
            <SaveButton tourId={tour.id} className="absolute right-4 top-4 z-10 size-11" />
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width:640px) 100vw, 1152px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8">
              <div className="flex flex-wrap gap-2">
                {tour.status === "ended" ? (
                  <span className="rounded-full bg-white/92 px-2.5 py-1 text-xs font-semibold text-ink">
                    Дууссан аялал
                  </span>
                ) : null}
                {tour.tag === "hot" ? (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">
                    Эрэлттэй
                  </span>
                ) : null}
                {tour.tag === "soon" ? (
                  <span className="rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
                    Удахгүй
                  </span>
                ) : null}
                {tour.discount ? (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">
                    {tour.discount}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#7ef0e0]">
                {tour.destination}
              </p>
              <h1 className="mt-1 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                {tour.title}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">{tour.description}</p>
            </div>
          </div>
        </motion.div>

        {bookable ? <TourTabs onPrice={() => setSheetOpen(true)} /> : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="min-w-0 space-y-8">
            <section id="overview">
              <div className="epic-rule mb-4" />
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Танилцуулга</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{tour.story}</p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Онцлох</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-2xl border border-[var(--line)] bg-bg-elevated px-4 py-3 text-sm text-foam"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            {tour.gallery.length ? (
              <section>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Зургийн цомог</h2>
                <div className="hide-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
                  {tour.gallery.map((src, i) => (
                    <div
                      key={src}
                      className="relative aspect-[4/5] w-[72vw] shrink-0 snap-start overflow-hidden rounded-[1.1rem] sm:aspect-[4/3] sm:w-auto"
                    >
                      <Image
                        src={src}
                        alt={`${tour.title} — зураг ${i + 1}`}
                        fill
                        className="object-cover transition duration-700 hover:scale-105"
                        sizes="(max-width:640px) 72vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {tour.itinerary.length ? (
            <section id="itinerary">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Хөтөлбөр</h2>
              <ol className="relative mt-6 space-y-6 border-l border-dashed border-accent/35 pl-7">
                {tour.itinerary.map((day, i) => (
                  <motion.li
                    key={day.day + day.title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                  >
                    <span className="absolute -left-[2.15rem] top-0.5 grid size-5 place-items-center rounded-full bg-accent text-[0.6rem] font-bold text-white ring-4 ring-bg">
                      {i + 1}
                    </span>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">{day.day}</p>
                    <p className="mt-1 font-display text-lg font-semibold text-foam">{day.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{day.detail}</p>
                    <DayMeta day={day} />
                  </motion.li>
                ))}
              </ol>
            </section>
            ) : null}

            {tour.includes.length ? (
            <section id="included" className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-[var(--line)] bg-bg-elevated p-5">
                <h3 className="font-display text-xl font-semibold">Үнэд багтсан</h3>
                <ul className="mt-3 space-y-2.5 text-sm text-foam">
                  {tour.includes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-accent text-[0.55rem] text-white">✓</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.25rem] border border-[var(--line)] bg-bg-elevated p-5">
                <h3 className="font-display text-xl font-semibold">Үнэд ороогүй</h3>
                <ul className="mt-3 space-y-2.5 text-sm text-muted">
                  {tour.excludes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-muted/20 text-[0.6rem]">–</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            ) : null}

            {tour.notes?.length ? (
              <section className="rounded-[1.25rem] border border-[#e8b86d]/40 bg-[#e8b86d]/10 p-5">
                <h3 className="font-display text-xl font-semibold">Анхаарах зүйлс</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foam/85">
                  {tour.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="grid grid-cols-2 gap-2">
              {facts.map((f) => (
                <div key={f.label} className="rounded-xl border border-[var(--line)] bg-bg-elevated px-3 py-2.5">
                  <p className="text-[0.62rem] uppercase tracking-[0.12em] text-muted">{f.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-foam">{f.value}</p>
                </div>
              ))}
            </div>

            {bookable ? (
              <div className="hidden sm:block">
                <BookingPlanner tour={tour} />
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-[var(--line)] bg-bg-elevated p-5 shadow-[var(--shadow)]">
                <p className="font-display text-2xl font-semibold">
                  {tour.status === "ended" ? "Энэ аялал дууссан" : "Тун удахгүй"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {tour.status === "ended"
                    ? "Дараагийн огноо болон ижил төстэй аяллын талаар манай багаас лавлаарай."
                    : "Мэдээлэл гармагц хамгийн түрүүнд мэдэх бол бидэнтэй холбогдоорой."}
                </p>
                <a
                  href="tel:+97690031771"
                  className="mt-5 flex h-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white transition hover:bg-accent-soft"
                >
                  Залгах · +976 9003 1771
                </a>
                <a
                  href="https://ig.me/m/elitetravelmn"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex h-11 items-center justify-center rounded-full border border-[var(--line)] text-sm font-medium text-foam"
                >
                  Instagram-аар асуух
                </a>
              </div>
            )}
          </aside>
        </div>

        {related.length ? (
          <section className="mt-14">
            <div className="epic-rule mb-4" />
            <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Төстэй аяллууд</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {related.map((t) => (
                <Link key={t.id} href={`/tours/${t.id}`} className="epic-card group block">
                  <div className="relative aspect-[16/11]">
                    <Image
                      src={t.image}
                      alt={t.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="33vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent">
                      {t.destination}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold leading-snug">{t.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-accent">{formatPrice(t.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {/* Mobile: booking bar always within thumb reach */}
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--line)] bg-bg-elevated/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.65rem] text-muted">Үнэ / хүн</p>
            <p className="truncate font-num text-xl font-semibold leading-tight text-accent">{formatPrice(tour.price)}</p>
          </div>
          <a
            href="tel:+97690031771"
            className="grid size-12 shrink-0 place-items-center rounded-full border border-[var(--line)] text-lg"
            aria-label="Залгах"
          >
            ☏
          </a>
          {bookable ? (
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="btn-shine inline-flex h-12 shrink-0 items-center rounded-full bg-accent px-6 text-sm font-semibold text-white active:scale-95"
            >
              Захиалах
            </button>
          ) : (
            <a href="tel:+97690031771" className="inline-flex h-12 shrink-0 items-center rounded-full bg-accent px-6 text-sm font-semibold text-white">
              Лавлах
            </a>
          )}
        </div>
      </div>

      {bookable ? <BookingSheet tour={tour} open={sheetOpen} onClose={() => setSheetOpen(false)} /> : null}
    </div>
  );
}

function DayMeta({ day }: { day: ItineraryDay }) {
  const items = [
    day.flight && { icon: "✈", text: day.flight },
    day.meals && { icon: "◐", text: `Хоол: ${day.meals}` },
    day.hotel && { icon: "⌂", text: day.hotel },
    day.host && { icon: "★", text: day.host },
  ].filter(Boolean) as { icon: string; text: string }[];

  if (!items.length) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {items.map((m) => (
        <li
          key={m.text}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-bg-elevated px-2.5 py-1 text-[0.72rem] text-foam/80"
        >
          <span aria-hidden className="text-accent">
            {m.icon}
          </span>
          {m.text}
        </li>
      ))}
    </ul>
  );
}
