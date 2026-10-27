"use client";

import { DestinationMap } from "@/components/DestinationMap";
import { destinationProfiles, formatFromPrice } from "@/data/places";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { filterChipClass } from "@/lib/ui";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export function DestinationsPageView() {
  registerGsap();
  const root = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(destinationProfiles[0].key);
  const selected =
    destinationProfiles.find((d) => d.key === active) ?? destinationProfiles[0];

  useGSAP(
    () => {
      gsap.from(".dest-map-wrap", {
        y: 60,
        scale: 0.94,
        rotate: -1.5,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });
      gsap.from(".dest-chip", {
        y: 20,
        scale: 0.8,
        opacity: 0,
        stagger: 0.06,
        duration: 0.45,
        ease: "back.out(1.8)",
        delay: 0.35,
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!detailRef.current) return;
      gsap.fromTo(
        detailRef.current,
        { y: 36, opacity: 0, rotate: 1.2 },
        { y: 0, opacity: 1, rotate: 0, duration: 0.55, ease: "power3.out" },
      );
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );

  function selectDestination(key: string) {
    setActive(key);
    window.setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 60);
  }

  return (
    <div ref={root} className="space-y-8">
      <div className="dest-map-wrap">
        <DestinationMap active={active} onSelect={selectDestination} />
      </div>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {destinationProfiles.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => selectDestination(d.key)}
            className={`dest-chip ${filterChipClass(d.key === active)}`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div ref={detailRef} className="epic-card overflow-hidden">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[280px] aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
            <Image
              src={selected.image}
              alt={selected.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 55vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center space-y-5 p-6 sm:p-8">
            <div>
              <div className="epic-rule mb-4" />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                {selected.en}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                {selected.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {selected.blurb}
              </p>
              <p className="mt-2 text-sm text-muted">Шилдэг улирал: {selected.bestSeason}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.highlights.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-mist px-3 py-1.5 text-xs font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-end justify-between gap-4 border-t border-[var(--line)] pt-5">
              <div>
                <p className="text-xs text-muted">Эхлэх үнэ</p>
                <p className="mt-1 text-lg font-semibold text-accent">
                  {formatFromPrice(selected.fromPrice)}
                </p>
              </div>
              <Link
                href={`/tours?dest=${selected.key === "egypt" ? "soon" : selected.key}`}
                className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-soft"
              >
                Аяллууд үзэх
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
