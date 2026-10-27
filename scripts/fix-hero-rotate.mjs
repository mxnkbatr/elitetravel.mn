import fs from "fs";
import path from "path";

const content = `"use client";

import { formatPrice, tours } from "@/data/tours";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const slides = tours
  .filter((t) => t.tag !== "soon")
  .slice(0, 6)
  .map((t) => ({
    id: t.id,
    destination: t.destination,
    title: t.title,
    description: t.description,
    duration: t.duration,
    price: t.price,
    oldPrice: t.oldPrice,
    discount: t.discount,
    tag: t.tag,
  }));

const INTERVAL_MS = 5200;

export function Hero() {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const slide = slides[index] ?? slides[0];

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#0a2f28]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/72 via-black/42 to-black/18" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_25%_45%,rgba(232,168,74,0.16),transparent_50%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-bg via-bg/85 to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-[3] mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-20 pt-[calc(7rem+env(safe-area-inset-top))] sm:justify-center sm:px-6 sm:pb-28"
      >
        <div className="max-w-2xl">
          <p className="font-display text-[clamp(2.4rem,7vw,4.5rem)] font-semibold lowercase leading-[0.92] tracking-[-0.05em] text-white">
            elite
          </p>
          <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[#9af5db]">
            Travel Mongolia
          </p>

          <div className="epic-rule mt-6 origin-left bg-gradient-to-r from-[#e8a84a] to-[#9af5db]" />

          <div className="relative mt-5 min-h-[13.5rem] sm:min-h-[15rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#ffe7a8]">
                    {slide.destination}
                  </p>
                  {slide.discount ? (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-[0.68rem] font-semibold text-white">
                      {slide.discount}
                    </span>
                  ) : null}
                  {slide.tag === "hot" ? (
                    <span className="rounded-full bg-[#e8a84a] px-2.5 py-0.5 text-[0.68rem] font-semibold text-ink">
                      Эрэлттэй
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-4xl md:text-[2.6rem]">
                  {slide.title}
                </h1>

                <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-white/80 sm:text-lg">
                  {slide.description}
                </p>

                <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <p className="text-sm text-white/70">{slide.duration}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-display text-2xl font-semibold text-[#9af5db]">
                      {formatPrice(slide.price)}
                    </p>
                    {slide.oldPrice ? (
                      <p className="text-sm text-white/50 line-through">
                        {formatPrice(slide.oldPrice)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={\`/tours/\${slide.id}\`}
                    className="inline-flex h-12 items-center rounded-full bg-accent px-7 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(11,107,92,0.35)] transition hover:bg-accent-soft"
                  >
                    Дэлгэрэнгүй үзэх
                  </Link>
                  <Link
                    href="/tours"
                    className="inline-flex h-12 items-center rounded-full border border-white/40 bg-white/10 px-5 text-sm font-medium text-white transition hover:bg-white/15"
                  >
                    Бүх аялал
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.title}
                onClick={() => setIndex(i)}
                className={\`h-1.5 rounded-full transition-all \${
                  i === index
                    ? "w-8 bg-[#e8a84a]"
                    : "w-1.5 bg-white/35 hover:bg-white/55"
                }\`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
`;

fs.writeFileSync(path.join(process.cwd(), "src/components/Hero.tsx"), content, "utf8");
console.log("hero rotate ok", content.includes("Эрэлттэй"));
