"use client";

import { news, type NewsCategory, type NewsItem } from "@/data/news";
import { getTour, formatPrice } from "@/data/tours";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const categories: ("Бүгд" | NewsCategory)[] = ["Бүгд", "Мэдээ", "Урамшуулал", "Зөвлөгөө"];

export const tone: Record<NewsCategory, string> = {
  Мэдээ: "bg-accent text-white",
  Урамшуулал: "bg-[#e8b86d] text-ink",
  Зөвлөгөө: "bg-white text-ink",
};

function Card({ item, big, onOpen }: { item: NewsItem; big?: boolean; onOpen: () => void }) {
  return (
    <motion.button
      layout
      type="button"
      layoutId={`news-${item.id}`}
      onClick={onOpen}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      className={`group relative block w-full overflow-hidden rounded-[1.5rem] text-left ${big ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      <div className={`relative ${big ? "aspect-[4/5] md:aspect-auto md:h-full md:min-h-[520px]" : "aspect-[4/5] sm:aspect-[4/3]"}`}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition duration-1000 group-hover:scale-105"
          sizes={big ? "(max-width:768px) 100vw, 66vw" : "(max-width:768px) 100vw, 33vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[0.65rem] font-semibold ${tone[item.category]}`}>
          {item.category}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
          <h3 className={`font-display font-semibold leading-[1.05] tracking-[-0.02em] ${big ? "text-3xl sm:text-5xl" : "text-2xl"}`}>
            {item.title}
          </h3>
          <p className={`mt-2 text-sm text-white/75 ${big ? "max-w-lg sm:text-base" : "line-clamp-2"}`}>{item.excerpt}</p>
          <p className="mt-3 text-xs font-medium text-[#7ef0e0]">{item.readMin} мин унших →</p>
        </div>
      </div>
    </motion.button>
  );
}

export function NewsReader({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  const tour = item.tourId ? getTour(item.tourId) : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Хаах" onClick={onClose} className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
      <motion.article
        layoutId={`news-${item.id}`}
        className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-bg-elevated sm:rounded-[1.75rem]"
        data-lenis-prevent
      >
        <div className="relative aspect-[16/10]">
          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="672px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Хаах"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/90 text-lg text-ink"
          >
            ×
          </button>
          <span className={`absolute bottom-4 left-5 rounded-full px-3 py-1 text-[0.65rem] font-semibold ${tone[item.category]}`}>{item.category}</span>
        </div>
        <div className="p-6 sm:p-8">
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em]">{item.title}</h2>
          <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-foam/85">
            {item.body.map((p) => (
              <motion.p key={p} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                {p}
              </motion.p>
            ))}
          </div>

          {tour ? (
            <Link
              href={`/tours/${tour.id}`}
              className="mt-7 flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-bg p-3 transition hover:border-accent"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                <Image src={tour.image} alt="" fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{tour.title}</p>
                <p className="text-sm text-muted">
                  {tour.duration} · <span className="font-semibold text-accent">{formatPrice(tour.price)}</span>
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">Үзэх</span>
            </Link>
          ) : null}
        </div>
      </motion.article>
    </motion.div>
  );
}

export function NewsPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>("Бүгд");
  const [open, setOpen] = useState<NewsItem | null>(null);
  const list = cat === "Бүгд" ? news : news.filter((n) => n.category === cat);

  return (
    <div>
      <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
              cat === c ? "border-transparent text-white" : "border-[var(--line)] bg-bg-elevated hover:border-accent"
            }`}
          >
            {cat === c ? <motion.span layoutId="news-cat" className="absolute inset-0 rounded-full bg-ink" /> : null}
            <span className="relative">
              {c} <span className="opacity-50">{c === "Бүгд" ? news.length : news.filter((n) => n.category === c).length}</span>
            </span>
          </button>
        ))}
      </div>

      <motion.div layout className="mt-6 grid gap-4 md:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((item, i) => (
            <Card key={item.id} item={item} big={i === 0} onOpen={() => setOpen(item)} />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>{open ? <NewsReader item={open} onClose={() => setOpen(null)} /> : null}</AnimatePresence>
    </div>
  );
}
