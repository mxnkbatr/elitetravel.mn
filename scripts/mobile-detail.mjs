import fs from "fs";

fs.writeFileSync(
  "src/components/TourDetailView.tsx",
  `"use client";

import { formatPrice, relatedTours, type Tour } from "@/data/tours";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function TourDetailView({ tour }: { tour: Tour }) {
  const related = relatedTours(tour.id, 3);
  const facts = [
    { label: "Хугацаа", value: tour.duration },
    { label: "Огноо", value: tour.dates ?? "Холбогдоно уу" },
    { label: "Байр", value: tour.stay ?? "—" },
    { label: "Гарц", value: tour.departure ?? "Улаанбаатар" },
  ];

  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden pb-[calc(8.5rem+env(safe-area-inset-bottom))] sm:pb-14">
      {/* Mobile: edge-to-edge hero */}
      <section className="relative w-full">
        <div className="relative aspect-[4/5] w-full max-h-[70svh] overflow-hidden sm:mx-auto sm:mt-3 sm:aspect-[21/9] sm:max-h-none sm:h-[380px] sm:max-w-6xl sm:rounded-[1.75rem] lg:h-[440px]">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/20" />

          <Link
            href="/tours"
            className="absolute left-3 top-3 z-20 inline-flex h-9 items-center gap-1 rounded-full glass-chip px-3 text-[0.8125rem] font-medium text-foam sm:left-5 sm:top-5 sm:h-10 sm:px-3.5"
          >
            ← Буцах
          </Link>

          <div className="absolute inset-x-0 bottom-0 z-10 p-4 pb-5 sm:p-7">
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full glass-chip px-2 py-0.5 text-[0.7rem] font-medium">
                ★ {tour.rating.toFixed(1)}
              </span>
              {tour.tag === "hot" ? (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[0.7rem] font-semibold text-bg">
                  Эрэлттэй
                </span>
              ) : null}
              {tour.tag === "soon" ? (
                <span className="rounded-full glass-chip px-2 py-0.5 text-[0.7rem] font-semibold">
                  Удахгүй
                </span>
              ) : null}
              {tour.groupSize ? (
                <span className="rounded-full glass-chip px-2 py-0.5 text-[0.7rem]">
                  {tour.groupSize}
                </span>
              ) : null}
            </div>
            <p className="mt-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
              {tour.destination}
            </p>
            <h1 className="mt-1 break-words font-display text-[1.65rem] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              {tour.title}
            </h1>
            <p className="mt-1.5 break-words text-[0.875rem] leading-snug text-foam/70 sm:text-base">
              {tour.description}
              {tour.nights != null ? \` · \${tour.nights} шөнө\` : ""}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-3 sm:px-6">
        {/* Mobile: compact iOS list rows (not 2x2 desktop cards) */}
        <div className="mt-3 overflow-hidden rounded-[1.25rem] glass-strong sm:mt-5">
          <ul className="divide-y divide-white/10 sm:grid sm:grid-cols-2 sm:divide-x lg:grid-cols-4 sm:divide-y-0">
            {facts.map((f) => (
              <li
                key={f.label}
                className="flex items-baseline justify-between gap-3 px-3.5 py-3 sm:block sm:px-4 sm:py-3.5"
              >
                <p className="shrink-0 text-[0.65rem] uppercase tracking-[0.12em] text-foam/40">
                  {f.label}
                </p>
                <p className="min-w-0 text-right text-[0.84rem] font-medium leading-snug tracking-[0.01em] break-words sm:mt-1 sm:text-left">
                  {f.value}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Price strip — mobile only, above content */}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-[1.25rem] glass-strong px-3.5 py-3 sm:hidden">
          <div className="min-w-0">
            <p className="text-[0.6rem] uppercase tracking-[0.12em] text-foam/40">Үнэ</p>
            <p className="truncate font-display text-xl font-semibold text-accent">
              {formatPrice(tour.price)}
            </p>
          </div>
          <p className="shrink-0 text-right text-[0.75rem] text-foam/55">{tour.duration}</p>
        </div>

        <div className="mt-3 space-y-3 sm:mt-5 sm:space-y-5 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)] lg:items-start lg:gap-6 lg:space-y-0">
          <div className="min-w-0 space-y-3 sm:space-y-5">
            <section className="rounded-[1.25rem] glass-strong p-4 sm:p-5">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-accent">
                Overview
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold tracking-[-0.02em] sm:text-xl">
                Аяллын тухай
              </h2>
              <p className="mt-2.5 break-words text-[0.9rem] leading-[1.65] text-foam/72 sm:text-[0.95rem]">
                {tour.story}
              </p>
            </section>

            <section className="rounded-[1.25rem] glass-strong p-4 sm:p-5">
              <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
                Онцлох зүйлс
              </h2>
              <ul className="mt-2">
                {tour.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 border-b border-white/8 py-2.5 text-[0.875rem] last:border-b-0 last:pb-0 first:pt-1"
                  >
                    <span className="mt-0.5 text-accent">✦</span>
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[1.25rem] glass-strong p-4 sm:p-5">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-accent">
                Itinerary
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold tracking-[-0.02em]">
                Өдөр тутмын хөтөлбөр
              </h2>
              <ol className="mt-3">
                {tour.itinerary.map((step, i) => (
                  <li
                    key={step.day + step.title}
                    className="relative flex gap-3 pb-4 last:pb-0"
                  >
                    {i < tour.itinerary.length - 1 ? (
                      <span className="absolute left-[11px] top-6 h-[calc(100%-0.75rem)] w-px bg-white/10" />
                    ) : null}
                    <span className="relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[0.65rem] font-semibold text-accent ring-1 ring-white/15">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-accent">
                        {step.day}
                      </p>
                      <h3 className="mt-0.5 break-words font-display text-[0.95rem] font-semibold tracking-[-0.02em]">
                        {step.title}
                      </h3>
                      <p className="mt-1 break-words text-[0.8125rem] leading-relaxed text-foam/60">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="overflow-hidden rounded-[1.25rem] glass-strong">
              <div className="border-b border-white/10 p-4 sm:p-5">
                <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
                  Юу багтсан бэ
                </h2>
                <ul className="mt-2.5 space-y-2">
                  {tour.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[0.875rem] text-foam/75"
                    >
                      <span className="mt-0.5 shrink-0 text-accent">✓</span>
                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 sm:p-5">
                <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
                  Багтаагүй
                </h2>
                <ul className="mt-2.5 space-y-2">
                  {tour.excludes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[0.875rem] text-foam/50"
                    >
                      <span className="mt-0.5 shrink-0 text-foam/30">–</span>
                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {tour.gallery.length > 0 ? (
              <section className="min-w-0">
                <h2 className="mb-2.5 px-0.5 font-display text-lg font-semibold tracking-[-0.02em]">
                  Зургууд
                </h2>
                <div className="hide-scrollbar flex snap-x-mandatory gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0">
                  {tour.gallery.map((src) => (
                    <div
                      key={src}
                      className="relative h-36 w-[78%] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-[1.1rem] sm:h-44 sm:w-auto sm:max-w-none"
                    >
                      <Image
                        src={src}
                        alt={tour.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 78vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Desktop book card */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[1.5rem] glass-strong p-6">
              <p className="text-xs text-foam/50">Үнэ</p>
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
                className="mt-2.5 flex h-12 items-center justify-center rounded-full text-sm font-medium glass transition active:scale-95"
              >
                +976 9003 1771
              </a>
            </div>
          </aside>
        </div>

        <section className="mt-7 min-w-0 sm:mt-9">
          <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
            <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
              Төстэй аяллууд
            </h2>
            <Link href="/tours" className="text-sm font-medium text-accent">
              Бүгд →
            </Link>
          </div>
          <div className="hide-scrollbar flex snap-x-mandatory gap-2.5 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0">
            {related.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="w-[72%] max-w-[260px] shrink-0 snap-start sm:w-auto sm:max-w-none"
              >
                <Link
                  href={\`/tours/\${r.id}\`}
                  className="block overflow-hidden rounded-[1.15rem] glass-strong active:scale-[0.98]"
                >
                  <div className="relative h-28 sm:h-32">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:640px) 72vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/90 to-transparent" />
                  </div>
                  <div className="p-3">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-accent">
                      {r.destination}
                    </p>
                    <h3 className="mt-0.5 line-clamp-2 break-words font-display text-[0.9rem] font-semibold tracking-[-0.02em]">
                      {r.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-accent">
                      {formatPrice(r.price)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky buy bar — room for dock + chat FAB */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.85rem+env(safe-area-inset-bottom))] z-[55] px-3 pr-[4.6rem] sm:hidden">
        <div className="pointer-events-auto glass-strong glass-float mx-auto flex max-w-md items-center gap-2.5 rounded-[1.35rem] p-2 pl-3">
          <div className="min-w-0 flex-1">
            <p className="text-[0.58rem] uppercase tracking-[0.1em] text-foam/40">Үнэ</p>
            <p className="truncate font-display text-base font-semibold text-accent">
              {formatPrice(tour.price)}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-10 shrink-0 items-center rounded-full bg-accent px-4 text-[0.8125rem] font-semibold text-bg active:scale-95"
          >
            {tour.tag === "soon" ? "Waitlist" : "Захиалах"}
          </Link>
        </div>
      </div>
    </div>
  );
}
`,
  "utf8",
);

fs.writeFileSync(
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
    <div className="w-full max-w-[100vw] overflow-x-hidden pt-[calc(4.25rem+env(safe-area-inset-top,0px))]">
      <TourDetailView tour={tour} />
    </div>
  );
}
`,
  "utf8",
);

// Harden glass so ::before can't cause horizontal overflow
let css = fs.readFileSync("src/app/globals.css", "utf8");
if (!css.includes(".glass-strong {") || !css.includes("overflow: hidden;")) {
  css = css.replace(
    `.glass,
.glass-strong {
  position: relative;
  isolation: isolate;`,
    `.glass,
.glass-strong {
  position: relative;
  isolation: isolate;
  overflow: hidden;`,
  );
  fs.writeFileSync("src/app/globals.css", css, "utf8");
  console.log("ok glass overflow");
}

console.log("mobile detail done");
