"use client";

import { BookingPlanner } from "@/components/BookingPlanner";
import type { Tour } from "@/data/tours";
import { scrollToY } from "@/lib/scroll";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const tourSections = [
  { id: "overview", label: "Тойм" },
  { id: "itinerary", label: "Хөтөлбөр" },
  { id: "included", label: "Багтсан" },
] as const;

/** Phone-only tab bar that sticks under the status bar and tracks the section in view. */
export function TourTabs({ onPrice }: { onPrice: () => void }) {
  const [active, setActive] = useState<string>(tourSections[0].id);

  useEffect(() => {
    const els = tourSections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  function go(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    scrollToY(el.getBoundingClientRect().top + window.scrollY - 72);
  }

  return (
    <div className="sticky top-[calc(0.5rem+env(safe-area-inset-top))] z-40 -mx-1 mt-4 sm:hidden">
      <div className="flex gap-1 rounded-full border border-[var(--line)] bg-bg-elevated/90 p-1 shadow-[0_8px_24px_rgba(6,42,42,0.08)] backdrop-blur-xl">
        {tourSections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(s.id)}
            className={`relative flex-1 rounded-full py-2 text-[0.8rem] font-semibold transition-colors ${active === s.id ? "text-white" : "text-muted"}`}
          >
            {active === s.id ? (
              <motion.span layoutId="tour-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
            ) : null}
            <span className="relative">{s.label}</span>
          </button>
        ))}
        <button type="button" onClick={onPrice} className="flex-1 rounded-full bg-accent/10 py-2 text-[0.8rem] font-semibold text-accent">
          Үнэ
        </button>
      </div>
    </div>
  );
}

/** Bottom sheet holding the two-step booking flow; drag down or tap outside to close. */
export function BookingSheet({ tour, open, onClose }: { tour: Tour; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[80] flex items-end sm:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Хаах" onClick={onClose} className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" />
          <motion.div
            role="dialog"
            aria-label="Захиалга"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose()}
            data-lenis-prevent
            className="relative max-h-[90svh] w-full overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-bg-elevated px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          >
            <div className="sticky top-0 z-10 -mx-5 bg-bg-elevated px-5 pb-3 pt-3">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-[var(--line)]" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="truncate font-display text-xl font-semibold">{tour.title}</p>
                <button type="button" onClick={onClose} aria-label="Хаах" className="grid size-8 shrink-0 place-items-center rounded-full bg-bg text-lg">
                  ×
                </button>
              </div>
            </div>
            <BookingPlanner tour={tour} variant="sheet" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
