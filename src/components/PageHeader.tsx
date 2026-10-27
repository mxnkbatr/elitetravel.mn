"use client";

import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { useRef } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  registerGsap();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".ph-item", {
        y: 48,
        rotate: -2,
        opacity: 0,
        stagger: 0.09,
        duration: 0.8,
        ease: "power4.out",
      });
      gsap.from(".ph-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.75,
        ease: "power3.inOut",
        delay: 0.05,
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="max-w-2xl">
      <div className="ph-rule epic-rule mb-4" />
      <p className="ph-item text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
        {eyebrow}
      </p>
      <h1 className="ph-item mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="ph-item mt-3 text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
