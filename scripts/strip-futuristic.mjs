import fs from "fs";
import path from "path";

function write(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("ok", rel);
}

write(
  "src/components/Hero.tsx",
  `"use client";

import { EliteLogo } from "@/components/EliteLogo";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const floaters = [
  { left: "14%", top: "30%", delay: 0, size: 7 },
  { left: "72%", top: "24%", delay: 0.8, size: 10 },
  { left: "58%", top: "62%", delay: 1.4, size: 6 },
  { left: "28%", top: "68%", delay: 0.4, size: 8 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
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

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/65 via-black/38 to-black/15" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_30%_40%,rgba(232,168,74,0.18),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-bg via-bg/80 to-transparent" />

      {floaters.map((f, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute z-[2] rounded-full"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            background: "radial-gradient(circle, rgba(255,230,170,0.9), rgba(232,168,74,0))",
            boxShadow: "0 0 14px rgba(232,168,74,0.35)",
          }}
          animate={{ y: [0, -14, 0], opacity: [0.3, 0.85, 0.3] }}
          transition={{
            duration: 4.5 + i * 0.4,
            delay: f.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-[3] mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-[calc(7rem+env(safe-area-inset-top))] sm:justify-center sm:px-6 sm:pb-24"
      >
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7"
          >
            <EliteLogo size="hero" light showWordmark />
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="epic-rule mb-5 origin-left bg-gradient-to-r from-[#e8a84a] to-[#9af5db]"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55 }}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/75"
          >
            Warm escapes · Mongolia
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl md:text-[4.25rem]"
          >
            Та манай аяллыг{" "}
            <span className="text-[#9af5db]">хүртэх эрхтэй</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/80 sm:text-lg"
          >
            Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с эхэлдэг.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.55 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/tours"
                className="inline-flex h-12 items-center rounded-full bg-accent px-7 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(11,107,92,0.35)] transition hover:bg-accent-soft"
              >
                Аяллууд үзэх
              </Link>
            </motion.div>
            <motion.a
              href="tel:+97690031771"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-12 items-center rounded-full border border-white/40 bg-white/10 px-5 text-sm font-medium text-white"
            >
              +976 9003 1771
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 6, 0], opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        <div className="h-8 w-5 rounded-full border border-white/35 p-1">
          <motion.div
            className="mx-auto h-1.5 w-1 rounded-full bg-[#e8a84a]"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
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
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeader ? (
          <motion.div
            className="mb-8 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
          >
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
          </motion.div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <motion.div
              key={d.key}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <Link href="/destinations" className="epic-card group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
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
  "src/app/page.tsx",
  `"use client";

import { Destinations } from "@/components/Destinations";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Tours } from "@/components/Tours";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Section className="space-y-16 py-14 sm:space-y-20 sm:py-20">
        <Destinations />
        <Tours limit={6} />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[1.5rem] bg-accent px-6 py-10 text-white sm:px-10 sm:py-12"
          >
            <div className="relative">
              <div className="epic-rule mb-5 bg-gradient-to-r from-[#e8a84a] to-white/70" />
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Аяллаа захиалах уу?
              </h2>
              <p className="mt-3 max-w-lg text-white/80">
                Instagram, Messenger эсвэл утсаар шууд холбогдоорой — Elite Travel зөвлөхүүд тусална.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/contact"
                    className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-accent"
                  >
                    Холбоо барих
                  </Link>
                </motion.div>
                <a
                  href="tel:+97690031771"
                  className="inline-flex h-11 items-center rounded-full border border-white/40 px-5 text-sm font-medium text-white"
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

console.log("futuristic stripped");
