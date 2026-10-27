"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const points = [
  {
    title: "Залууст зориулсан",
    text: "18–35 насны vibe — концерт, далай, хотын аялал.",
  },
  {
    title: "Цэвэр туршлага",
    text: "Тодорхой үнэ, тодорхой хөтөлбөр, шууд холбоо.",
  },
  {
    title: "Premium мэдрэмж",
    text: "Аяллын өмнө, дунд, дараа — бүгд нэг стандартаар.",
  },
];

type AboutProps = {
  showCta?: boolean;
};

export function About({ showCta = false }: AboutProps) {
  return (
    <section className="relative z-10">
      <div className="overflow-hidden rounded-[28px] glass-strong sm:rounded-[32px]">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 sm:p-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
              About
            </p>
            <h1 className="mt-3 max-w-md font-display text-[1.7rem] font-semibold tracking-[-0.03em] sm:text-4xl">
              Бидний тухай
            </h1>
            <p className="mt-3 max-w-lg font-display text-lg font-medium tracking-[-0.02em] text-foam/90 sm:text-xl">
              Сайн аялал төлөвлөгөөнөөс эхэлдэг
            </p>
            <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed tracking-[0.01em] text-foam/68 sm:text-base">
              Гайхалтай аялал Elite Travel-с эхэлдэг. Бид Монголын залууст
              зориулж Хонг Конг, Хайнань, Бали болон дэлхийн концерт аяллуудыг
              цэвэрхэн, ойлгомжтойгоор хүргэдэг.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {points.map((point, i) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10"
                >
                  <h2 className="font-display text-[1rem] font-semibold tracking-[-0.02em]">
                    {point.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed tracking-[0.01em] text-foam/60">
                    {point.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {showCta ? (
              <Link
                href="/contact"
                className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-semibold text-bg transition active:scale-95 hover:bg-accent-soft"
              >
                Холбоо барих
              </Link>
            ) : null}
          </div>

          <div className="relative min-h-[220px] overflow-hidden border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(94,235,195,0.3),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(43,184,150,0.18),transparent_40%),linear-gradient(160deg,#163530,#0c1f1c)]" />
            <div className="relative flex h-full min-h-[220px] flex-col justify-end p-6 sm:p-10">
              <p className="font-display text-5xl font-semibold tracking-[-0.04em] text-accent sm:text-6xl">
                4.9
              </p>
              <p className="mt-2 text-sm tracking-[0.01em] text-foam/70">
                Дундаж үнэлгээ · Explore. Dream. Discover.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
