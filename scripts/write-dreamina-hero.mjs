import fs from "fs";

const hero = `"use client";

import { formatPrice, tours } from "@/data/tours";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const slides = tours
  .filter((t) => t.tag !== "soon")
  .slice(0, 6)
  .map((t) => ({
    id: t.id,
    destination: t.destination,
    title: t.title,
    description: t.description,
    duration: t.duration,
    price: t.price,
    oldPrice: t.oldPrice,
    discount: t.discount,
    tag: t.tag,
  }));

const INTERVAL_MS = 5200;

export function Hero() {
  registerGsap();
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", immediateRender: false } });
        tl.fromTo(".hero-panel", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 })
          .fromTo(".hero-rule", { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 0.55 }, "-=0.45")
          .fromTo(".hero-brand", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=0.35")
          .fromTo(
            ".hero-slide > *",
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 },
            "-=0.25",
          );

        gsap.to(".hero-media", {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: root },
  );

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const play = () => {
      v.play().catch(() => {});
    };
    play();
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;
    gsap.fromTo(
      el.children,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power2.out" },
    );
  }, [index]);

  const slide = slides[index] ?? slides[0];

  return (
    <section
      ref={root}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#c8ddd8]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-media absolute inset-0 z-0 will-change-transform">
        <video
          ref={videoRef}
          className="h-full w-full scale-105 object-cover object-[center_40%]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/dreamina-hero-frame.jpg"
          aria-hidden
        >
          <source src="/media/dreamina-hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dreamina-style soft wash — keep right scenery open */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-white/75 via-white/35 to-transparent sm:from-white/70 sm:via-white/25" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#eef5f2] via-transparent to-white/20" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative z-[3] mx-auto flex min-h-[100svh] max-w-6xl items-center px-4 pb-16 pt-[calc(6.5rem+env(safe-area-inset-top))] sm:px-6 sm:pb-20">
        <div className="hero-panel w-full max-w-lg rounded-[1.75rem] border border-white/50 bg-white/55 p-6 shadow-[0_24px_60px_rgba(10,42,38,0.1)] backdrop-blur-md sm:p-8">
          <div className="hero-rule mb-5 h-[3px] w-12 origin-left rounded-full bg-[#1d7063]" />

          <p className="hero-brand font-display text-[clamp(2.2rem,6vw,3.4rem)] font-semibold lowercase leading-[0.95] tracking-[-0.045em] text-[#1d7063]">
            elite
          </p>
          <p className="mt-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#1d7063]/70">
            Travel Mongolia
          </p>

          <div className="relative mt-5 min-h-[11.5rem] sm:min-h-[12.5rem]">
            <div ref={slideRef} className="hero-slide" key={slide.id}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#1d7063]/80">
                  {slide.destination}
                </p>
                {slide.discount ? (
                  <span className="rounded-full bg-[#1d7063] px-2.5 py-0.5 text-[0.65rem] font-semibold text-white">
                    {slide.discount}
                  </span>
                ) : null}
                {slide.tag === "hot" ? (
                  <span className="rounded-full bg-[#e8b86d] px-2.5 py-0.5 text-[0.65rem] font-semibold text-ink">
                    Эрэлттэй
                  </span>
                ) : null}
              </div>

              <h1 className="mt-2.5 font-display text-[1.55rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[#143f39] sm:text-[2rem]">
                {slide.title}
              </h1>

              <p className="mt-2.5 max-w-md text-sm leading-relaxed text-[#355952] sm:text-[0.95rem]">
                {slide.description}
              </p>

              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-sm text-[#5a7a73]">{slide.duration}</p>
                <p className="font-display text-xl font-semibold text-[#1d7063]">
                  {formatPrice(slide.price)}
                </p>
                {slide.oldPrice ? (
                  <p className="text-sm text-[#5a7a73]/70 line-through">
                    {formatPrice(slide.oldPrice)}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={\`/tours/\${slide.id}\`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1d7063] px-6 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(29,112,99,0.35)] transition hover:bg-[#185a50]"
                >
                  Дэлгэрэнгүй үзэх
                  <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs">→</span>
                </Link>
                <Link
                  href="/tours"
                  className="inline-flex h-11 items-center rounded-full border border-[#1d7063]/25 bg-white/60 px-5 text-sm font-medium text-[#1d7063] transition hover:bg-white"
                >
                  Бүх аялал
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.title}
                onClick={() => setIndex(i)}
                className={\`h-1.5 rounded-full transition-all \${
                  i === index ? "w-8 bg-[#1d7063]" : "w-1.5 bg-[#1d7063]/25 hover:bg-[#1d7063]/45"
                }\`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync("src/components/Hero.tsx", hero, "utf8");
console.log("ok", fs.readFileSync("src/components/Hero.tsx", "utf8").includes("dreamina-hero.mp4"));
