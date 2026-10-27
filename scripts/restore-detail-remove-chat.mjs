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
              sizes="(max-width:1152px) calc(100vw - 2rem), 1152px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/35 to-bg/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-bg/55 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
                  ★ {tour.rating.toFixed(1)}
                </span>
                {tour.tag === "hot" && (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-bg shadow-[0_6px_18px_rgba(94,235,195,0.35)]">
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

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="rounded-2xl glass-strong px-3.5 py-3">
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

            <section className="rounded-[24px] glass-strong p-5 sm:p-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                Itinerary
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.02em]">
                Өдөр тутмын хөтөлбөр
              </h2>
              <ol className="mt-5 space-y-0">
                {tour.itinerary.map((step, i) => (
                  <li
                    key={step.day + step.title}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
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

      <div className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[55] px-3 sm:hidden">
        <div className="glass-strong mx-auto flex max-w-md items-center gap-3 rounded-[1.55rem] p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          <div className="min-w-0 flex-1 pl-2">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-foam/45">Үнэ</p>
            <p className="truncate font-display text-lg font-semibold text-accent">
              {formatPrice(tour.price)}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-accent px-5 text-sm font-semibold text-bg shadow-[0_8px_22px_rgba(94,235,195,0.4)] active:scale-95"
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
    <div className="page-pad-top">
      <TourDetailView tour={tour} />
    </div>
  );
}
`,
  "utf8",
);

fs.writeFileSync(
  "src/components/AppShell.tsx",
  `"use client";

import { Footer } from "@/components/Footer";
import { MobileDock } from "@/components/MobileDock";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Navbar />
      <main className="app-main flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <div
        className="pointer-events-none h-[var(--dock-h)] shrink-0 sm:hidden"
        aria-hidden
      />
      <MobileDock />
    </div>
  );
}
`,
  "utf8",
);

for (const f of ["src/components/ChatBot.tsx", "src/components/AiChatbot.tsx"]) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log("removed", f);
  }
}

console.log("detail restored + chat removed");
