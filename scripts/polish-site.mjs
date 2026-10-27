import fs from "fs";
import path from "path";

function write(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("ok", rel);
}

write(
  "src/components/Marquee.tsx",
  `"use client";

import { motion } from "framer-motion";

const items = [
  "Hainan",
  "Hong Kong",
  "Bali",
  "Warm escapes",
  "Elite Travel",
  "Explore",
  "Dream",
  "Discover",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-[var(--line)] bg-bg-elevated/70 py-4">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap px-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {row.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-10 font-display text-xl font-semibold tracking-[-0.03em] text-foam/70 sm:text-2xl"
          >
            {t}
            <span className="inline-block size-1.5 rounded-full bg-[#e8a84a]" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
`,
);

write(
  "src/components/FeaturedTour.tsx",
  `"use client";

import { formatPrice, getTour } from "@/data/tours";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function FeaturedTour() {
  const tour = getTour("weeknd-hk") ?? getTour("bali");
  if (!tour) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="epic-card overflow-hidden"
      >
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[280px] aspect-[4/3] lg:aspect-auto lg:min-h-[440px]">
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
          </div>
          <div className="flex flex-col justify-center bg-bg-elevated p-6 sm:p-10">
            <div className="epic-rule mb-4" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
              Featured · {tour.destination}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              {tour.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              {tour.story}
            </p>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--line)] pt-5">
              <div>
                <p className="text-xs text-muted">{tour.duration}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="font-display text-2xl font-semibold text-accent">
                    {formatPrice(tour.price)}
                  </p>
                  {tour.oldPrice ? (
                    <p className="text-sm text-muted line-through">
                      {formatPrice(tour.oldPrice)}
                    </p>
                  ) : null}
                </div>
              </div>
              <Link
                href={\`/tours/\${tour.id}\`}
                className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-soft"
              >
                Дэлгэрэнгүй үзэх
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
`,
);

write(
  "src/components/PromiseStrip.tsx",
  `"use client";

import { motion } from "framer-motion";

const promises = [
  {
    title: "Explore",
    body: "Бодит чиглэл, бодит огноо — Хайнань, Хонг Конг, Бали.",
  },
  {
    title: "Dream",
    body: "Концерт, далай, хотын vibe — таны аялалд тааруулна.",
  },
  {
    title: "Discover",
    body: "Монгол хөтөч, ил тод үнэ, найдвартай зохион байгуулалт.",
  },
];

export function PromiseStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {promises.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.55 }}
            className="rounded-[1.25rem] border border-[var(--line)] bg-bg-elevated p-6"
          >
            <div className="epic-rule mb-4" />
            <h3 className="font-display text-2xl font-semibold text-accent">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
`,
);

write(
  "src/components/Hero.tsx",
  `"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#0a2f28]"
    >
      <motion.div className="absolute inset-0 z-0" style={{ y: imgY, scale: imgScale }}>
        <Image
          src="https://elitetravel.mn/__l5e/assets-v1/2e9a9b43-175a-424a-b3b2-c1a5c1e94222/hero-jungle-tall.webp"
          alt="Elite Travel destination"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/40 to-black/15" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_25%_45%,rgba(232,168,74,0.16),transparent_50%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-bg via-bg/85 to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-[3] mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-20 pt-[calc(7rem+env(safe-area-inset-top))] sm:justify-center sm:px-6 sm:pb-28"
      >
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-[clamp(2.8rem,8vw,5.5rem)] font-semibold lowercase leading-[0.92] tracking-[-0.05em] text-white"
          >
            elite
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
            className="mt-2 text-[0.75rem] font-semibold uppercase tracking-[0.32em] text-[#9af5db]"
          >
            Travel Mongolia
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.25, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="epic-rule mt-7 origin-left bg-gradient-to-r from-[#e8a84a] to-[#9af5db]"
          />

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl font-display text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.03em] text-white sm:text-4xl md:text-[2.75rem]"
          >
            Та манай аяллыг{" "}
            <span className="text-[#9af5db]">хүртэх эрхтэй</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55 }}
            className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/80 sm:text-lg"
          >
            Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с эхэлдэг.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/tours"
              className="inline-flex h-12 items-center rounded-full bg-accent px-7 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(11,107,92,0.35)] transition hover:bg-accent-soft"
            >
              Аяллууд үзэх
            </Link>
            <a
              href="tel:+97690031771"
              className="inline-flex h-12 items-center rounded-full border border-white/40 bg-white/10 px-5 text-sm font-medium text-white transition hover:bg-white/15"
            >
              +976 9003 1771
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
`,
);

write(
  "src/components/Destinations.tsx",
  `"use client";

import { destinations } from "@/data/tours";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Destinations({ showHeader = true }: { showHeader?: boolean }) {
  const [hero, ...rest] = destinations;

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeader ? (
          <motion.div
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
          >
            <div className="max-w-xl">
              <div className="epic-rule mb-4" />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
                Destinations
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-foam sm:text-4xl">
                Аяллын чиглэлүүд
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Хайнань, Хонг Конг, Бали — халуун орны elite escape.
              </p>
            </div>
            <Link
              href="/destinations"
              className="text-sm font-semibold text-accent transition hover:opacity-80"
            >
              Бүх чиглэл →
            </Link>
          </motion.div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-2">
          {hero ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="lg:col-span-7 lg:row-span-2"
            >
              <Link href="/destinations" className="epic-card group block h-full">
                <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-auto lg:h-full lg:min-h-[480px]">
                  <Image
                    src={hero.image}
                    alt={hero.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:1024px) 100vw, 58vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#ffe7a8]">
                      {hero.en}
                    </p>
                    <h3 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
                      {hero.name}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-white/80">{hero.blurb}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ) : null}

          {rest.map((d, i) => (
            <motion.div
              key={d.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 + i * 0.06, duration: 0.55 }}
              className="lg:col-span-5"
            >
              <Link href="/destinations" className="epic-card group block h-full">
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[230px]">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:1024px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#ffe7a8]">
                      {d.en}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-white">
                      {d.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/75">{d.blurb}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
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
            {limit ? (
              <Link href="/tours" className="hidden text-sm font-semibold text-accent sm:inline">
                Бүгдийг үзэх →
              </Link>
            ) : null}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-medium text-ink">
                        ★ {tour.rating.toFixed(1)}
                      </span>
                      {tour.discount ? (
                        <span className="rounded-full bg-accent px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                          {tour.discount}
                        </span>
                      ) : null}
                      {tour.tag === "hot" ? (
                        <span className="rounded-full bg-[#e8a84a] px-2.5 py-1 text-[0.7rem] font-semibold text-ink">
                          Эрэлттэй
                        </span>
                      ) : null}
                      {tour.tag === "soon" ? (
                        <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                          Удахгүй
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-3 p-4 sm:p-5">
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                        {tour.destination}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold leading-snug tracking-[-0.02em] transition group-hover:text-accent">
                        {tour.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{tour.description}</p>
                    </div>
                    <div className="flex items-end justify-between gap-3 border-t border-[var(--line)] pt-3">
                      <div>
                        <p className="text-xs text-muted">{tour.duration}</p>
                        <div className="mt-0.5 flex items-baseline gap-2">
                          <p className="text-base font-semibold text-accent">
                            {formatPrice(tour.price)}
                          </p>
                          {tour.oldPrice ? (
                            <p className="text-xs text-muted line-through">
                              {formatPrice(tour.oldPrice)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-accent opacity-0 transition group-hover:opacity-100">
                        Дэлгэрэнгүй →
                      </span>
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
import { Tours } from "@/components/Tours";
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
        <Tours limit={6} />

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

// clean unused 3d css
const cssPath = path.join(process.cwd(), "src/app/globals.css");
let css = fs.readFileSync(cssPath, "utf8");
css = css.replace(/\n\.scene-3d\{[\s\S]*?\}\n/, "\n");
css = css.replace(/\n\.scene-3d \{[\s\S]*?\n\}\n/, "\n");
css = css.replace(/\n\.gpu-3d \{[\s\S]*?\n\}\n/, "\n");
if (!css.includes(".line-clamp-2")) {
  css += `
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`;
}
fs.writeFileSync(cssPath, css, "utf8");
console.log("ok globals polish");
console.log("polish done");
