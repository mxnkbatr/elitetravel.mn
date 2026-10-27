"use client";

import { destinationProfiles } from "@/data/places";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type DestinationsProps = {
  showHeader?: boolean;
};

export function Destinations({ showHeader = true }: DestinationsProps) {
  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-6xl">
        {showHeader ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
            className="mb-6 flex items-end justify-between gap-4"
          >
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
                Destinations
              </p>
              <h2 className="mt-2 font-display text-[1.7rem] font-semibold tracking-[-0.03em] sm:text-4xl">
                Аяллын чиглэлүүд
              </h2>
            </div>
            <Link
              href="/destinations"
              className="hidden shrink-0 text-sm font-medium text-accent sm:inline"
            >
              Бүгдийг үзэх →
            </Link>
          </motion.div>
        ) : null}

        <div className="hide-scrollbar -mx-4 flex snap-x-mandatory gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {destinationProfiles.map((dest, i) => (
            <motion.div
              key={dest.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="snap-start w-[78vw] shrink-0 sm:w-auto"
            >
              <Link
                href="/destinations"
                className="relative block h-[21rem] overflow-hidden rounded-[26px] sm:h-[23rem]"
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width:640px) 78vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <div className="rounded-2xl border border-white/10 bg-[#10241f]/95 p-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
                      {dest.en}
                    </p>
                    <h3 className="mt-1 font-display text-[1.35rem] font-semibold tracking-[-0.02em]">
                      {dest.name}
                    </h3>
                    <p className="mt-1 text-sm tracking-[0.01em] text-foam/70">
                      {dest.blurb}
                    </p>
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
