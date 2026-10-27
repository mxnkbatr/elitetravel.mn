"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const stats = [
  { label: "Сонирхсон", value: "3" },
  { label: "Аялал", value: "0" },
  { label: "Удахгүй", value: "2" },
];

const saved = [
  {
    title: "Хайнань үндсэн аялал",
    meta: "8 өдөр · ₮2'690'000",
    href: "/tours/hainan-main",
  },
  {
    title: "Бали, Индонез",
    meta: "9 өдөр · ₮6'290'000",
    href: "/tours/bali",
  },
];

export function ProfilePageView() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[28px] glass-strong"
      >
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/40">
            <Image
              src="/elite-logo.png"
              alt="Profile"
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
              Profile
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Аялагч
            </h1>
            <p className="mt-2 text-sm tracking-[0.01em] text-foam/65">
              Explore. Dream. Discover. — таны хадгалсан аялал, сонирхол энд.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-bg"
          >
            Зөвлөгөө авах
          </Link>
        </div>

        <div className="grid grid-cols-3 border-t border-white/10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border-r border-white/10 px-4 py-4 text-center last:border-r-0"
            >
              <p className="font-display text-xl font-semibold text-accent">
                {s.value}
              </p>
              <p className="mt-1 text-[0.7rem] tracking-[0.04em] text-foam/55">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="rounded-[24px] glass-strong p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
            Хадгалсан аяллууд
          </h2>
          <Link href="/tours" className="text-sm text-accent">
            Бүгдийг үзэх
          </Link>
        </div>
        <div className="space-y-3">
          {saved.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/10 transition hover:bg-white/[0.07]"
            >
              <div>
                <p className="font-medium tracking-[0.01em]">{item.title}</p>
                <p className="mt-0.5 text-sm text-foam/55">{item.meta}</p>
              </div>
              <span className="text-accent">→</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/destinations"
          className="rounded-[22px] glass p-5 transition hover:bg-white/10"
        >
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-accent">
            Чиглэл
          </p>
          <p className="mt-2 font-display text-lg font-semibold">Аяллын чиглэлүүд</p>
        </Link>
        <Link
          href="/resorts"
          className="rounded-[22px] glass p-5 transition hover:bg-white/10"
        >
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-accent">
            Амралт
          </p>
          <p className="mt-2 font-display text-lg font-semibold">Амралтын газрууд</p>
        </Link>
        <Link
          href="/contact"
          className="rounded-[22px] glass p-5 transition hover:bg-white/10"
        >
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-accent">
            Холбоо
          </p>
          <p className="mt-2 font-display text-lg font-semibold">Захиалга өгөх</p>
        </Link>
      </div>
    </div>
  );
}
