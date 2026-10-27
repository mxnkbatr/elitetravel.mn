"use client";

import { Contact } from "@/components/Contact";
import { destinations } from "@/data/tours";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const pillars = [
  {
    k: "01",
    title: "Curated Destinations",
    mn: "Сонгомол чиглэл",
    body: "Хайнань, Бали, Хонг Конг — бид өөрсдөө туршиж, итгэлтэй байгаа чиглэлүүдээ л санал болгодог.",
  },
  {
    k: "02",
    title: "Premium Experience",
    mn: "Тансаг туршлага",
    body: "Шилэн гүүр, дарвуулт завь, Атлантис усан парк, концертын тасалбар — мэргэжлийн хөтөлбөртэй.",
  },
  {
    k: "03",
    title: "Trusted Service",
    mn: "Найдвартай үйлчилгээ",
    body: "Монгол хөтөч, аяллын даатгал, урьдчилан тодорхой үнэ. Хуваан төлөх боломжтой.",
  },
];

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

export function About() {
  return (
    <div className="space-y-16 sm:space-y-24">
      <motion.p {...fade} className="max-w-3xl font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-[1.18] tracking-[-0.03em]">
        Бид аяллыг зөвхөн нэг газраас нөгөөд хүрэх хөдөлгөөн бус,{" "}
        <span className="text-accent">мартагдашгүй туршлага</span> гэж хардаг.
      </motion.p>

      <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.div
            key={p.k}
            {...fade}
            transition={{ ...fade.transition, delay: i * 0.1 }}
            className="group bg-bg-elevated p-7 transition-colors duration-500 hover:bg-[#062a2a] sm:p-9"
          >
            <span className="font-display text-sm font-semibold text-accent">{p.k}</span>
            <p className="mt-8 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-accent group-hover:text-[#7ef0e0]">
              {p.title}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold transition-colors group-hover:text-white">{p.mn}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted transition-colors group-hover:text-white/70">{p.body}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <motion.div {...fade} className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Бидний чиглэлүүд</h2>
          <Link href="/map" className="text-sm font-semibold text-accent">
            Бүгдийг үзэх →
          </Link>
        </motion.div>
        <div className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
          {destinations.map((d, i) => (
            <motion.div key={d.key} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }} className="w-[62vw] shrink-0 snap-start sm:w-auto">
              <Link href="/map" className="group relative block aspect-[3/4] overflow-hidden rounded-[1.25rem]">
                <Image src={d.image} alt={d.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width:640px) 62vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-[#f3e0c2]">{d.en}</p>
                  <p className="font-display text-2xl font-semibold">{d.name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div {...fade} className="flex flex-col gap-4 rounded-[1.5rem] border border-[var(--line)] bg-bg-elevated p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-accent">Хуваан төлөх</p>
          <p className="mt-1 text-sm text-muted sm:text-base">Pocket, Toki, Simple, Dari зээлийн апп болон fintech-үүдээр хуваан төлөх боломжтой.</p>
        </div>
        <Link href="#contact" className="btn-shine inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white">
          Холбогдох →
        </Link>
      </motion.div>

      <section id="contact" className="scroll-mt-28">
        <motion.h2 {...fade} className="mb-6 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Холбоо барих
        </motion.h2>
        <Contact />
      </section>
    </div>
  );
}
