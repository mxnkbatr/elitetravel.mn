"use client";

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
    <div className="relative w-full max-w-[100vw] overflow-x-hidden pb-16 sm:pb-20">
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
                <span className="rounded-full bg-white/92 px-2.5 py-1 text-xs font-medium text-ink">
                  ★ {tour.rating.toFixed(1)}
                </span>
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
              <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#5ef0d0]">
                {tour.destination}
              </p>
              <h1 className="mt-1 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                {tour.title}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">{tour.description}</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <section>
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

            <section>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Хөтөлбөр</h2>
              <div className="mt-4 space-y-3">
                {tour.itinerary.map((day) => (
                  <div
                    key={day.day + day.title}
                    className="rounded-2xl border border-[var(--line)] bg-bg-elevated px-4 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      {day.day}
                    </p>
                    <p className="mt-1 font-medium text-foam">{day.title}</p>
                    <p className="mt-1 text-sm text-muted">{day.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-display text-xl font-semibold">Орсон</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {tour.includes.map((x) => (
                    <li key={x}>· {x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">Ороогүй</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {tour.excludes.map((x) => (
                    <li key={x}>· {x}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.5rem] border border-[var(--line)] bg-bg-elevated p-5 shadow-[var(--shadow)]">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">Үнэ / хүн</p>
                  <p className="mt-1 font-display text-3xl font-semibold text-accent">
                    {formatPrice(tour.price)}
                  </p>
                  {tour.oldPrice ? (
                    <p className="text-sm text-muted line-through">{formatPrice(tour.oldPrice)}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {facts.map((f) => (
                  <div key={f.label} className="rounded-xl bg-accent-mist/60 px-3 py-2.5">
                    <p className="text-[0.65rem] uppercase tracking-[0.12em] text-muted">{f.label}</p>
                    <p className="mt-0.5 text-sm font-medium text-foam">{f.value}</p>
                  </div>
                ))}
              </div>

              <a
                href="tel:+97690031771"
                className="mt-5 flex h-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white transition hover:bg-accent-soft"
              >
                Захиалах · +976 9003 1771
              </a>
              <a
                href="https://www.instagram.com/elitetravel.mn/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex h-11 items-center justify-center rounded-full border border-[var(--line)] text-sm font-medium text-foam"
              >
                Instagram-аар асуух
              </a>
            </div>
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
    </div>
  );
}
