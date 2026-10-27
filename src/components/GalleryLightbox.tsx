"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/** Photo grid that opens a full-screen, swipeable viewer. */
export function GalleryLightbox({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (step: number) => {
      setDir(step);
      setOpen((i) => (i == null ? i : (i + step + images.length) % images.length));
    },
    [images.length],
  );

  useEffect(() => {
    if (open == null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
    else if (info.offset.y > 120) setOpen(null);
  }

  return (
    <>
      <div className="hide-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:grid-rows-2 sm:overflow-visible sm:px-0">
        {images.map((src, i) => (
          <motion.button
            key={src}
            type="button"
            onClick={() => {
              setDir(1);
              setOpen(i);
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className={`group relative aspect-[4/5] w-[72vw] shrink-0 snap-start overflow-hidden rounded-[1.1rem] sm:w-auto ${
              i === 0 ? "sm:col-span-2 sm:row-span-2 sm:aspect-auto" : "sm:aspect-square"
            }`}
          >
            <Image src={src} alt={`${title} — зураг ${i + 1}`} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width:640px) 72vw, 25vw" />
            <span className="absolute inset-0 grid place-items-center bg-black/0 text-2xl text-white opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100" aria-hidden>
              ⤢
            </span>
            {i === 0 ? (
              <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.68rem] font-semibold text-white backdrop-blur-md">
                {images.length} зураг
              </span>
            ) : null}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open != null ? (
          <motion.div
            className="fixed inset-0 z-[95] flex flex-col bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between px-4 pb-2 pt-[calc(0.75rem+env(safe-area-inset-top))] text-white">
              <span className="font-num text-sm text-white/70">
                {open + 1} / {images.length}
              </span>
              <button type="button" onClick={() => setOpen(null)} aria-label="Хаах" className="grid size-10 place-items-center rounded-full bg-white/10 text-xl">
                ×
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={open}
                  custom={dir}
                  className="absolute inset-0 touch-none"
                  initial={{ x: `${dir * 100}%`, opacity: 0.5 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: `${dir * -100}%`, opacity: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 34 }}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.5}
                  onDragEnd={onDragEnd}
                >
                  <Image src={images[open]} alt={`${title} — зураг ${open + 1}`} fill className="object-contain" sizes="100vw" draggable={false} />
                </motion.div>
              </AnimatePresence>

              <button type="button" onClick={() => go(-1)} aria-label="Өмнөх" className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:grid">
                ‹
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Дараах" className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:grid">
                ›
              </button>
            </div>

            <div className="hide-scrollbar flex justify-center gap-2 overflow-x-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => {
                    setDir(i > open ? 1 : -1);
                    setOpen(i);
                  }}
                  className={`relative size-14 shrink-0 overflow-hidden rounded-lg transition ${i === open ? "ring-2 ring-[#e8b86d]" : "opacity-50"}`}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
