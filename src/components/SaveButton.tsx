"use client";

import { toggleSaved, useTraveller } from "@/lib/traveller-store";
import { AnimatePresence, motion } from "framer-motion";
import type { MouseEvent } from "react";

export function SaveButton({ tourId, className = "" }: { tourId: string; className?: string }) {
  const { saved } = useTraveller();
  const on = saved.includes(tourId);

  function onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(tourId);
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.8 }}
      aria-pressed={on}
      aria-label={on ? "Хадгалснаас хасах" : "Аяллыг хадгалах"}
      className={`grid size-9 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-md transition hover:bg-white ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z"
          fill={on ? "#e5484d" : "none"}
          stroke={on ? "#e5484d" : "currentColor"}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
      <AnimatePresence>
        {on ? (
          <motion.span
            key="burst"
            className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#e5484d]"
            initial={{ scale: 0.6, opacity: 0.9 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}
