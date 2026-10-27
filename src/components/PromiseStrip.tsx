"use client";

import { motion } from "framer-motion";

const promises = [
  {
    title: "Explore",
    body: "Бодит чиглэл, бодит огноо — Хайнань, Хонг Конг, Бали.",
  },
  {
    title: "Dream",
    body: "Концерт, далай, хотын vibe — таны аялалд тааруулна.",
  },
  {
    title: "Discover",
    body: "Монгол хөтөч, ил тод үнэ, найдвартай зохион байгуулалт.",
  },
];

export function PromiseStrip() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6">
      <div className="dream-bleed absolute -inset-x-8 -top-10 bottom-0 -z-10 opacity-70" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-3">
        {promises.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="dream-glass rounded-[1.35rem] p-6 sm:p-7"
          >
            <div className="epic-rule mb-4" />
            <h3 className="font-display text-2xl font-semibold text-accent">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
