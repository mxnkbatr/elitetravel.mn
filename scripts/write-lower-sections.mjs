import fs from "fs";

fs.writeFileSync(
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
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6">
      <div className="dream-bleed absolute -inset-x-8 -top-10 bottom-0 -z-10 opacity-70" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-3">
        {promises.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="dream-glass rounded-[1.35rem] p-6 sm:p-7"
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
  "utf8",
);

fs.writeFileSync(
  "src/components/Marquee.tsx",
  `"use client";

import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { useRef } from "react";

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
  registerGsap();
  const root = useRef(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector(".marquee-track");
      if (!track) return;

      gsap.to(track, {
        xPercent: -50,
        duration: 22,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: root },
  );

  const row = [...items, ...items];

  return (
    <div
      ref={root}
      className="relative overflow-hidden border-y border-white/10 bg-[#0a2a26] py-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(46,196,182,0.18),transparent_60%)]" />
      <div className="marquee-track relative z-[1] flex w-max gap-10 whitespace-nowrap px-4 will-change-transform">
        {row.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-10 font-display text-xl font-semibold tracking-[-0.03em] text-white/75 sm:text-2xl"
          >
            {t}
            <span className="inline-block size-1.5 rounded-full bg-[#e8b86d]" />
          </span>
        ))}
      </div>
    </div>
  );
}
`,
  "utf8",
);

fs.writeFileSync(
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
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="dream-glass overflow-hidden rounded-[1.5rem]"
      >
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[280px] aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[440px]">
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041f1f]/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#041f1f]/15" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <div className="epic-rule mb-4" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
              Featured · {tour.destination}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              {tour.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{tour.story}</p>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--line)] pt-5">
              <div>
                <p className="text-xs text-muted">{tour.duration}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="font-display text-2xl font-semibold text-accent">
                    {formatPrice(tour.price)}
                  </p>
                  {tour.oldPrice ? (
                    <p className="text-sm text-muted line-through">{formatPrice(tour.oldPrice)}</p>
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
  "utf8",
);

fs.writeFileSync(
  "src/app/page.tsx",
  `"use client";

import { CinematicBand } from "@/components/CinematicBand";
import { Destinations } from "@/components/Destinations";
import { FeaturedTour } from "@/components/FeaturedTour";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { PromiseStrip } from "@/components/PromiseStrip";
import { Section } from "@/components/Section";
import { ToursCarousel } from "@/components/ToursCarousel";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

function HomeCta() {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[1.6rem]"
      >
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="h-full w-full scale-105 object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/section-banner-frame.jpg"
            aria-hidden
          >
            <source src="/media/section-banner.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#041f1f]/62" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(46,196,182,0.25),transparent_55%)]" />
        </div>
        <div className="relative px-6 py-14 text-white sm:px-10 sm:py-16">
          <div className="epic-rule mb-5 bg-gradient-to-r from-[#e8b86d] to-[#7ef0e0]" />
          <h2 className="max-w-lg font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Дараагийн аяллаа хамтдаа төлөвлөе
          </h2>
          <p className="mt-3 max-w-lg text-white/85">
            Instagram, Messenger эсвэл утсаар шууд холбогдоорой — Elite Travel зөвлөхүүд тусална.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-ink"
            >
              Холбоо барих
            </Link>
            <a
              href="tel:+97690031771"
              className="inline-flex h-11 items-center rounded-full border border-white/45 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-sm"
            >
              +976 9003 1771
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Section className="space-y-16 py-10 sm:space-y-20 sm:py-16">
        <ToursCarousel />
        <PromiseStrip />
      </Section>

      <CinematicBand
        eyebrow="Coastal dream"
        title="Далай, нар, мөрөөдлийн чиглэлүүд"
        body="Dreamina cinematic vibe — Elite Travel-ийн бодит аяллуудтай танилцаарай."
        ctaHref="/destinations"
        ctaLabel="Чиглэлүүд үзэх →"
      />

      <Section className="space-y-16 py-12 sm:space-y-20 sm:py-16">
        <Destinations />
        <FeaturedTour />
        <HomeCta />
      </Section>
    </>
  );
}
`,
  "utf8",
);

console.log("lower sections written");
