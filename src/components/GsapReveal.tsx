"use client";

import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { useRef, type ReactNode } from "react";

type GsapRevealProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  rotate?: number;
  scale?: number;
  delay?: number;
  stagger?: number;
  scrub?: boolean | number;
};

/** Scroll-triggered Gen Z entrance — skew/pop into place */
export function GsapReveal({
  children,
  className,
  y = 56,
  rotate = -2.5,
  scale = 0.94,
  delay = 0,
  stagger = 0.08,
  scrub = false,
}: GsapRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  registerGsap();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
      const els = targets.length ? targets : [root];

      gsap.from(els, {
        y,
        rotate,
        scale,
        opacity: 0,
        transformOrigin: "50% 80%",
        duration: scrub ? 1 : 0.9,
        delay,
        stagger: els.length > 1 ? stagger : 0,
        ease: "power4.out",
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: scrub ? "top 40%" : undefined,
          scrub: scrub || false,
          once: !scrub,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
