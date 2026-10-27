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
  const root = useRef(null);
  const videoRef = useRef(null);
  const slideRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out", immediateRender: false } });
        tl.fromTo(".hero-brand", { y: 80, rotate: -6, scale: 0.88, opacity: 0 }, { y: 0, rotate: 0, scale: 1, opacity: 1, duration: 1 })
          .fromTo(".hero-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=0.55")
          .fromTo(".hero-rule", { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 0.7 }, "-=0.35")
          .fromTo(
            ".hero-slide > *",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.07, duration: 0.65 },
            "-=0.35",
          )
          .fromTo(".hero-dots button", { scale: 0 }, { scale: 1, stagger: 0.05, duration: 0.35 }, "-=0.4");

        gsap.to(".hero-media", {
          yPercent: 10,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".hero-copy", {
          yPercent: 18,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "55% top",
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
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) v.pause();
      else play();
    });
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
      { y: 28, opacity: 0, rotate: 1.5 },
      { y: 0, opacity: 1, rotate: 0, duration: 0.55, stagger: 0.05, ease: "power3.out" },
    );
  }, [index]);

  const slide = slides[index] ?? slides[0];

  return (
    <section
      ref={root}
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#062a2a]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-media absolute inset-0 z-0 will-change-transform">
        <video
          ref={videoRef}
          className="h-full w-full scale-105 object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/hero-frame.jpg"
          aria-hidden
        >
          <source src="/media/web-hero-background.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#041f1f]/78 via-[#062a2a]/45 to-transparent" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_70%_40%,rgba(46,196,182,0.14),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] h-44 bg-gradient-to-t from-bg via-bg/90 to-transparent" />

      <div className="hero-copy relative z-[3] mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-20 pt-[calc(7rem+env(safe-area-inset-top))] sm:justify-center sm:px-6 sm:pb-28">
        <div className="max-w-2xl">
          <p className="hero-brand font-display text-[clamp(2.4rem,7vw,4.5rem)] font-semibold lowercase leading-[0.92] tracking-[-0.05em] text-white">
            elite
          </p>
          <p className="hero-sub mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[#7ef0e0]">
            Travel Mongolia
          </p>

          <div className="hero-rule epic-rule mt-6 origin-left bg-gradient-to-r from-[#e8b86d] to-[#2ec4b6]" />

          <div className="relative mt-5 min-h-[13.5rem] sm:min-h-[15rem]">
            <div ref={slideRef} className="hero-slide" key={slide.id}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#f3e0c2]">
                  {slide.destination}
                </p>
                {slide.discount ? (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-[0.68rem] font-semibold text-white">
                    {slide.discount}
                  </span>
                ) : null}
                {slide.tag === "hot" ? (
                  <span className="rounded-full bg-[#e8b86d] px-2.5 py-0.5 text-[0.68rem] font-semibold text-ink">
                    Эрэлттэй
                  </span>
                ) : null}
              </div>

              <h1 className="mt-3 font-display text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-4xl md:text-[2.6rem]">
                {slide.title}
              </h1>

              <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-white/80 sm:text-lg">
                {slide.description}
              </p>

              <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="text-sm text-white/70">{slide.duration}</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-display text-2xl font-semibold text-[#7ef0e0]">
                    {formatPrice(slide.price)}
                  </p>
                  {slide.oldPrice ? (
                    <p className="text-sm text-white/50 line-through">
                      {formatPrice(slide.oldPrice)}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={\`/tours/\${slide.id}\`}
                  className="inline-flex h-12 items-center rounded-full bg-accent px-7 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(14,143,132,0.4)] transition hover:bg-accent-soft"
                >
                  Дэлгэрэнгүй үзэх
                </Link>
                <Link
                  href="/tours"
                  className="inline-flex h-12 items-center rounded-full border border-white/40 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  Бүх аялал
                </Link>
              </div>
            </div>
          </div>

          <div className="hero-dots mt-8 flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.title}
                onClick={() => setIndex(i)}
                className={\`h-1.5 rounded-full transition-all \${
                  i === index ? "w-8 bg-[#e8b86d]" : "w-1.5 bg-white/35 hover:bg-white/55"
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
console.log("hero written", fs.readFileSync("src/components/Hero.tsx", "utf8").includes("Эрэлттэй"));
