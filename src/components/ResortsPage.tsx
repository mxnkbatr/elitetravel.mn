"use client";

import { formatFromPrice, resorts } from "@/data/places";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function ResortsPageView() {
  return (
    <div className="mx-auto max-w-6xl px-0">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {resorts.map((resort, i) => (
          <motion.article
            key={resort.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#122a26] sm:rounded-[1.35rem]"
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={resort.image}
                alt={resort.name}
                fill
                className="object-cover"
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              />
              <span className="absolute left-3 top-3 rounded-full bg-[#0c1f1c]/85 px-2.5 py-1 text-[0.7rem] font-medium text-foam">
                ★ {resort.rating.toFixed(1)}
              </span>
            </div>

            <div className="space-y-3 p-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                  {resort.country}
                </p>
                <h2 className="mt-1 font-display text-[1.15rem] font-semibold leading-snug tracking-[-0.02em]">
                  {resort.name}
                </h2>
                <p className="mt-0.5 text-sm text-foam/55">{resort.place}</p>
              </div>

              <p className="text-[0.875rem] leading-relaxed tracking-[0.01em] text-foam/70">
                {resort.blurb}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {resort.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[0.68rem] text-foam/65 ring-1 ring-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-3">
                <p className="min-w-0 truncate text-[0.95rem] font-semibold text-accent">
                  {formatFromPrice(resort.fromPrice)}
                </p>
                <Link
                  href="/contact"
                  className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-bg shadow-[0_8px_22px_rgba(94,235,195,0.35)] transition active:scale-95"
                >
                  Асуух
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
