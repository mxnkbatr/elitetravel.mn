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
    <div className="relative w-full max-w-[100vw] overflow-x-hidden pb-[calc(9.75rem+env(safe-area-inset-bottom))] sm:pb-12">
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-6">
        <Link
          href="/tours"
          className="mb-3 inline-flex max-w-full items-center gap-1.5 text-[0.8125rem] tracking-[0.01em] text-foam/65 transition hover:text-foam sm:mb-4 sm:text-sm"
        >
          <span aria-hidden>←</span>
          <span className="truncate">Аяллууд руу буцах</span>
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-[1.25rem] sm:rounded-[28px]"
        >
          <div className="relative aspect-[4/5] w-full max-h-[58svh] min-h-[240px] sm:aspect-auto sm:h-[420px] sm:max-h-none sm:min-h-0">
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width:640px) 100vw, (max-width:1152px) calc(100vw - 2rem), 1152px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-8">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="rounded-full bg-bg/55 px-2 py-0.5 text-[0.7rem] font-medium backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-xs">
                  ★ {tour.rating.toFixed(1)}
                </span>
                {tour.tag === "hot" ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[0.7rem] font-semibold text-bg shadow-[0_6px_18px_rgba(94,235,195,0.35)] sm:px-2.5 sm:py-1 sm:text-xs">
                    Эрэлттэй
                  </span>
                ) : null}
                {tour.tag === "soon" ? (
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.7rem] font-semibold backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-xs">
                    Удахгүй
                  </span>
                ) : null}
                {tour.groupSize ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.7rem] font-medium backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-xs">
                    {tour.groupSize}
                  </span>
                ) : null}
              </div>

              <p className="mt-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent sm:mt-3 sm:text-[0.7rem] sm:tracking-[0.22em]">
                {tour.destination}
              </p>
              <h1 className="mt-1 max-w-full break-words font-display text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-5xl sm:leading-[1.1]">
                {tour.title}
              </h1>
              <p className="mt-1.5 max-w-xl text-[0.8125rem] leading-snug tracking-[0.01em] text-foam/75 sm:mt-2 sm:text-base">
                {tour.description}
                {tour.nights != null ? ` · ${tour.nights} шөнө` : ""}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Facts — compact on phone */}
        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-4 sm:gap-2 sm:grid-cols-4">
          {facts.map((f) => (
            <div
              key={f.label}
              className="min-w-0 rounded-[14px] border border-white/10 bg-[#122a26] px-2.5 py-2.5 sm:rounded-2xl sm:px-3.5 sm:py-3"
            >
              <p className="text-[0.58rem] uppercase tracking-[0.12em] text-foam/45 sm:text-[0.65rem] sm:tracking-[0.14em]">
                {f.label}
              </p>
              <p className="mt-0.5 break-words text-[0.78rem] font-medium leading-snug tracking-[0.01em] sm:mt-1 sm:text-sm">
                {f.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="min-w-0 space-y-4 sm:space-y-6">
            <section className="rounded-[1.15rem] glass-strong p-4 sm:rounded-[24px] sm:p-6">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent sm:text-[0.7rem] sm:tracking-[0.2em]">
                Overview
              </p>
              <h2 className="mt-1.5 font-display text-lg font-semibold tracking-[-0.02em] sm:mt-2 sm:text-2xl">
                Аяллын тухай
              </h2>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed tracking-[0.01em] text-foam/72 sm:mt-3 sm:text-[0.95rem]">
                {tour.story}
              </p>
            </section>

            <section className="rounded-[1.15rem] glass-strong p-4 sm:rounded-[24px] sm:p-6">
              <h2 className="font-display text-lg font-semibold tracking-[-0.02em] sm:text-xl">
                Онцлох зүйлс
              </h2>
              <ul className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-2.5">
                {tour.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex min-w-0 items-start gap-2.5 rounded-xl bg-white/[0.04] px-3 py-2.5 text-[0.8125rem] tracking-[0.01em] ring-1 ring-white/8 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
                  >
                    <span className="mt-0.5 shrink-0 text-accent">✦</span>
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[1.15rem] glass-strong p-4 sm:rounded-[24px] sm:p-6">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent sm:text-[0.7rem]">
                Itinerary
              </p>
              <h2 className="mt-1.5 font-display text-lg font-semibold tracking-[-0.02em] sm:mt-2 sm:text-xl">
                Өдөр тутмын хөтөлбөр
              </h2>
              <ol className="mt-4 space-y-0 sm:mt-5">
                {tour.itinerary.map((step, i) => (
                  <li
                    key={step.day + step.title}
                    className="relative flex gap-3 pb-5 last:pb-0 sm:gap-4 sm:pb-6"
                  >
                    {i < tour.itinerary.length - 1 ? (
                      <span className="absolute left-[11px] top-7 h-[calc(100%-1.25rem)] w-px bg-white/10" />
                    ) : null}
                    <span className="relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-[0.65rem] font-semibold text-accent ring-1 ring-accent/30">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent sm:text-[0.68rem] sm:tracking-[0.16em]">
                        {step.day}
                      </p>
                      <h3 className="mt-0.5 break-words font-display text-[0.95rem] font-semibold tracking-[-0.02em] sm:mt-1 sm:text-base">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed tracking-[0.01em] text-foam/65 sm:mt-1.5 sm:text-sm">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="rounded-[1.15rem] glass-strong p-4 sm:rounded-[24px] sm:p-5">
                <h2 className="font-display text-base font-semibold tracking-[-0.02em] sm:text-lg">
                  Юу багтсан бэ
                </h2>
                <ul className="mt-2.5 space-y-2 sm:mt-3 sm:space-y-2.5">
                  {tour.includes.map((item) => (
                    <li
                      key={item}
                      className="flex min-w-0 items-start gap-2 text-[0.8125rem] tracking-[0.01em] text-foam/75 sm:gap-2.5 sm:text-sm"
                    >
                      <span className="mt-0.5 shrink-0 text-accent">✓</span>
                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.15rem] glass-strong p-4 sm:rounded-[24px] sm:p-5">
                <h2 className="font-display text-base font-semibold tracking-[-0.02em] sm:text-lg">
                  Багтаагүй
                </h2>
                <ul className="mt-2.5 space-y-2 sm:mt-3 sm:space-y-2.5">
                  {tour.excludes.map((item) => (
                    <li
                      key={item}
                      className="flex min-w-0 items-start gap-2 text-[0.8125rem] tracking-[0.01em] text-foam/55 sm:gap-2.5 sm:text-sm"
                    >
                      <span className="mt-0.5 shrink-0 text-foam/35">–</span>
                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {tour.gallery.length > 0 ? (
              <section className="min-w-0">
                <h2 className="mb-2.5 font-display text-lg font-semibold tracking-[-0.02em] sm:mb-3 sm:text-xl">
                  Зургууд
                </h2>
                <div className="hide-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0">
                  {tour.gallery.map((src) => (
                    <div
                      key={src}
                      className="relative h-36 w-[68vw] max-w-[280px] shrink-0 overflow-hidden rounded-[14px] sm:h-48 sm:w-auto sm:max-w-none sm:rounded-[20px]"
                    >
                      <Image
                        src={src}
                        alt={tour.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 68vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

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
                  className="mt-5 flex h-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-bg shadow-[0_8px_24px_rgba(94,235,195,0.35)] transition hover:bg-accent-soft active:scale-95"
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

        <section className="mt-7 min-w-0 sm:mt-10">
          <div className="mb-3 flex items-end justify-between gap-2 sm:mb-4 sm:gap-3">
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent sm:text-[0.7rem]">
                More trips
              </p>
              <h2 className="mt-0.5 truncate font-display text-lg font-semibold tracking-[-0.02em] sm:mt-1 sm:text-xl">
                Төстэй аяллууд
              </h2>
            </div>
            <Link
              href="/tours"
              className="shrink-0 text-[0.8125rem] font-medium text-accent sm:text-sm"
            >
              Бүгд →
            </Link>
          </div>
          <div className="hide-scrollbar -mx-3 flex gap-2.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/tours/${r.id}`}
                className="w-[72vw] max-w-[280px] shrink-0 overflow-hidden rounded-[1.1rem] glass-strong transition active:scale-[0.98] sm:w-auto sm:max-w-none sm:rounded-[22px]"
              >
                <div className="relative h-28 sm:h-36">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 72vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-accent sm:text-[0.65rem]">
                    {r.destination}
                  </p>
                  <h3 className="mt-0.5 line-clamp-2 font-display text-[0.9rem] font-semibold tracking-[-0.02em] sm:mt-1 sm:text-base">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-[0.8125rem] text-accent sm:text-sm">
                    {formatPrice(r.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile sticky buy bar — clears dock */}
      <div className="fixed inset-x-0 bottom-[calc(4.85rem+env(safe-area-inset-bottom))] z-[55] px-3 sm:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2.5 rounded-[1.35rem] border border-white/10 bg-[#0f2420]/96 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="min-w-0 flex-1 pl-2.5">
            <p className="text-[0.58rem] uppercase tracking-[0.1em] text-foam/45">Үнэ</p>
            <p className="truncate font-display text-[1.05rem] font-semibold leading-tight text-accent">
              {formatPrice(tour.price)}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-10 shrink-0 items-center rounded-full bg-accent px-4 text-[0.8125rem] font-semibold text-bg shadow-[0_8px_22px_rgba(94,235,195,0.4)] active:scale-95"
          >
            {tour.tag === "soon" ? "Waitlist" : "Захиалах"}
          </Link>
        </div>
      </div>
    </div>
  );
}
