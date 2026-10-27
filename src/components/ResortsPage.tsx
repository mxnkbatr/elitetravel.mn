"use client";

import { destinationProfiles } from "@/data/places";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function ResortsPage() {
  const resorts = destinationProfiles.filter((d) =>
    ["hainan", "bali"].includes(d.key),
  );

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {resorts.map((r, i) => (
        <motion.article
          key={r.key}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="epic-card overflow-hidden"
        >
          <div className="relative aspect-[16/11]">
            <Image
              src={r.image}
              alt={r.name}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-3 p-5">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                {r.en}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em]">
                {r.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{r.blurb}</p>
            </div>
            <Link
              href={`/tours?dest=${r.key}`}
              className="inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-semibold text-white"
            >
              Аялал үзэх
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
