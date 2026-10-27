"use client";

import type Lenis from "lenis";

/** Lenis owns the scroll position when active, so programmatic scrolls must go through it. */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function scrollToY(y: number) {
  if (instance) {
    // Lenis clamps to a cached scroll limit; refresh it in case content grew since load
    instance.resize();
    instance.scrollTo(y, { duration: 0.9, force: true });
  }
  else window.scrollTo({ top: y, behavior: "smooth" });
}
