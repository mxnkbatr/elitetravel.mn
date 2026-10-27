"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-[calc(7rem+env(safe-area-inset-bottom,0px))] pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:items-center sm:pb-24 sm:pt-28">
      <div className="absolute inset-0 -z-20">
        <Image
          src="https://elitetravel.mn/__l5e/assets-v1/2e9a9b43-175a-424a-b3b2-c1a5c1e94222/hero-jungle-tall.webp"
          alt="Tropical destination atmosphere"
          fill
          priority
          className="object-cover object-[center_28%]"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/70 to-bg/25" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent"
        >
          Elite Travel Mongolia
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl font-display text-[2.15rem] font-semibold leading-[1.1] tracking-[-0.035em] text-foam sm:text-5xl md:text-[3.35rem]"
        >
          Та манай аяллыг{" "}
          <span className="text-accent">хүртэх эрхтэй</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="mt-4 max-w-md text-[0.95rem] leading-[1.6] text-foam/70 sm:text-lg"
        >
          Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с эхэлдэг.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mt-7 flex flex-wrap items-center gap-2.5"
        >
          <Link
            href="/tours"
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-bg shadow-[0_8px_24px_rgba(94,235,195,0.32)] transition active:scale-[0.98]"
          >
            Аяллууд үзэх
          </Link>
          <a
            href="tel:+97690031771"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-[#14302a] px-5 text-sm font-medium text-foam transition active:scale-[0.98]"
          >
            +976 9003 1771
          </a>
        </motion.div>
      </div>
    </section>
  );
}
