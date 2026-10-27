"use client";

import { AnimatePresence, motion } from "framer-motion";
import { INTRO_KEY } from "@/lib/intro";
import { useEffect, useState } from "react";


const ARC = "M 40 150 C 140 40, 300 20, 420 70";

/** First-visit curtain: the brand E, a plane drawing its flight path, then the reveal. */
export function IntroCurtain() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.intro !== "1") return;
    setShow(true);
    const id = window.setTimeout(() => {
      setShow(false);
      // Drop the static pre-paint cover now; the animated curtain still sits on top while it lifts
      delete document.documentElement.dataset.intro;
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        /* private mode — intro may replay, harmless */
      }
    }, 2100);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="intro"
          className="intro-curtain fixed inset-0 z-[100] grid place-items-center bg-[#062a2a] text-[#f3e0c2]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(46,196,182,0.18),transparent_60%)]" />
          <div className="relative flex flex-col items-center">
            <svg width="460" height="190" viewBox="0 0 460 190" className="absolute -top-16 left-1/2 w-[min(460px,90vw)] -translate-x-1/2 overflow-visible" aria-hidden>
              <motion.path
                d={ARC}
                fill="none"
                stroke="#e8b86d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1 0"
                initial={{ pathLength: 0, opacity: 0.9 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.35, duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.g
                initial={{ offsetDistance: "0%", opacity: 0 }}
                animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                transition={{ delay: 0.35, duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
                style={{ offsetPath: `path("${ARC}")`, offsetRotate: "auto 90deg" }}
              >
                <path
                  transform="translate(-12 -12)"
                  fill="#f3e0c2"
                  d="M21 15.5v-1.8l-8-5V3.6a1.6 1.6 0 0 0-3.2 0v5.1l-8 5v1.8l8-2.5v4.6l-2.2 1.7V21l3.8-1.1 3.8 1.1v-1.7l-2.2-1.7V13l8 2.5Z"
                />
              </motion.g>
            </svg>

            <motion.span
              initial={{ y: 40, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[7rem] font-semibold leading-none"
            >
              E
            </motion.span>
            <motion.span
              initial={{ letterSpacing: "0.9em", opacity: 0 }}
              animate={{ letterSpacing: "0.42em", opacity: 1 }}
              transition={{ delay: 0.45, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 pl-[0.42em] font-display text-2xl font-semibold uppercase"
            >
              Elite
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-2 text-[0.68rem] uppercase tracking-[0.5em]"
            >
              — Travel —
            </motion.span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
