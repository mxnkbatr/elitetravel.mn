"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(5.75rem+env(safe-area-inset-top,0px))] sm:pb-24 sm:pt-28">
      <div className="absolute inset-0 -z-20">
        <Image
          src="https://elitetravel.mn/__l5e/assets-v1/2e9a9b43-175a-424a-b3b2-c1a5c1e94222/hero-jungle-tall.webp"
          alt="Tropical destination atmosphere"
          fill
          priority
          className="object-cover object-[center_30%] scale-[1.02]"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/25 via-bg/45 to-bg" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(94,235,195,0.22),transparent_48%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex items-center rounded-full glass-chip px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent"
        >
          Elite Travel Mongolia
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl font-display text-[2.05rem] font-semibold leading-[1.12] tracking-[-0.03em] text-foam sm:text-5xl md:text-[3.25rem]"
        >
          Та манай аяллыг{" "}
          <span className="bg-gradient-to-r from-accent via-accent-soft to-accent bg-clip-text text-transparent">
            хүртэх эрхтэй
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="mt-5 max-w-md text-[0.95rem] leading-[1.65] tracking-[0.01em] text-foam/75 sm:text-lg"
        >
          Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с эхэлдэг.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/tours"
            className="accent-shimmer inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold tracking-[0.01em] text-bg transition active:scale-[0.98] hover:scale-[1.02]"
          >
            Аяллууд үзэх
          </Link>
          <a
            href="tel:+97690031771"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium tracking-[0.01em] text-foam glass transition active:scale-[0.98]"
          >
            +976 9003 1771
          </a>
        </motion.div>
      </div>
    </section>
  );
}
