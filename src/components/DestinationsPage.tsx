"use client";

import { destinationProfiles, formatFromPrice } from "@/data/places";
import { filterChipClass } from "@/lib/ui";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function DestinationsPageView() {
  const [active, setActive] = useState(destinationProfiles[0].key);
  const selected =
    destinationProfiles.find((d) => d.key === active) ?? destinationProfiles[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {destinationProfiles.map((d) => {
          const on = d.key === active;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setActive(d.key)}
              className={filterChipClass(on)}
            >
              {d.name}
            </button>
          );
        })}
      </div>

      <motion.div
        key={selected.key}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="liquid-sheet overflow-hidden rounded-[1.5rem]"
      >
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[260px] sm:min-h-[340px]">
            <Image
              src={selected.image}
              alt={selected.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 55vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                {selected.en}
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                {selected.name}
              </h2>
            </div>
          </div>

          <div className="flex flex-col justify-between p-5 sm:p-7">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                Destination profile
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed tracking-[0.01em] text-foam/75">
                {selected.blurb}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-foam/45">
                    Vibe
                  </p>
                  <p className="mt-1 text-sm font-medium">{selected.vibe}</p>
                </div>
                <div className="rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-foam/45">
                    Улирал
                  </p>
                  <p className="mt-1 text-sm font-medium">{selected.bestSeason}</p>
                </div>
                <div className="col-span-2 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-foam/45">
                    Үнэ
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-accent">
                    {formatFromPrice(selected.fromPrice)}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {selected.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 text-sm text-foam/75"
                  >
                    <span className="text-accent">✦</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/tours?dest=${selected.tourFilter}`}
                className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-bg"
              >
                Аяллууд үзэх
              </Link>
              <Link
                href="/resorts"
                className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium glass"
              >
                Амралтын газрууд
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {destinationProfiles.map((d, i) => (
          <motion.button
            key={d.key}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setActive(d.key)}
            className={`overflow-hidden rounded-[22px] text-left transition ${
              d.key === active
                ? "ring-2 ring-accent"
                : "ring-1 ring-white/10 hover:ring-white/25"
            }`}
          >
            <div className="relative h-36">
              <Image src={d.image} alt={d.name} fill className="object-cover" sizes="25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="font-display text-lg font-semibold">{d.name}</p>
                <p className="text-xs text-foam/65">{d.vibe}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
