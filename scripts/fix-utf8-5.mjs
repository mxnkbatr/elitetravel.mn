import fs from "fs";
import path from "path";

const root = process.cwd();
function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content, { encoding: "utf8" });
  console.log("ok", rel);
}

write(
  "src/components/AppShell.tsx",
  `"use client";

import { Footer } from "@/components/Footer";
import { MobileDock } from "@/components/MobileDock";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Navbar />
      <main className="app-main flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <div
        className="pointer-events-none h-[var(--dock-h)] shrink-0 sm:hidden"
        aria-hidden
      />
      <MobileDock />
    </div>
  );
}
`,
);

write(
  "src/app/globals.css",
  `@import "tailwindcss";

:root {
  /* Midnight horizon — night sky + sunset accent */
  --bg: #0a0d14;
  --bg-elevated: #121826;
  --surface: #1a2233;
  --accent: #ff7a59;
  --accent-soft: #ffb39a;
  --accent-deep: #e85a38;
  --foam: #f4f6fb;
  --muted: rgba(244, 246, 251, 0.68);
  --glass: rgba(18, 24, 38, 0.5);
  --glass-strong: rgba(12, 16, 26, 0.72);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-highlight: rgba(255, 122, 89, 0.2);
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --dock-h: calc(5.75rem + env(safe-area-inset-bottom, 0px));
  --nav-h: calc(4.25rem + env(safe-area-inset-top, 0px));
}

@theme inline {
  --color-bg: var(--bg);
  --color-bg-elevated: var(--bg-elevated);
  --color-surface: var(--surface);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-accent-deep: var(--accent-deep);
  --color-foam: var(--foam);
  --color-muted: var(--muted);
  --color-mint: var(--accent);
  --color-mint-soft: var(--accent-soft);
  --color-mint-deep: var(--accent-deep);
  --color-forest: var(--surface);
  --font-display: var(--font-geologica);
  --font-sans: var(--font-golos);
}

@utility font-display {
  font-family: var(--font-geologica), "Golos Text", system-ui, sans-serif;
  letter-spacing: -0.025em;
  font-feature-settings: "kern" 1, "liga" 1;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html {
  scroll-behavior: smooth;
  height: 100%;
}

body {
  margin: 0;
  min-height: 100%;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--foam);
  font-family: var(--font-golos), system-ui, sans-serif;
  font-weight: 400;
  letter-spacing: 0.005em;
  line-height: 1.55;
  overflow-x: hidden;
  overscroll-behavior-y: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

h1,
h2,
h3,
h4 {
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}

::selection {
  background: color-mix(in oklab, var(--accent) 55%, transparent);
  color: var(--bg);
}

.glass {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.09),
    rgba(255, 255, 255, 0.02)
  );
  backdrop-filter: blur(22px) saturate(140%);
  -webkit-backdrop-filter: blur(22px) saturate(140%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-strong {
  background: linear-gradient(
    160deg,
    rgba(20, 26, 40, 0.9),
    rgba(10, 13, 20, 0.82)
  );
  backdrop-filter: blur(28px) saturate(150%);
  -webkit-backdrop-filter: blur(28px) saturate(150%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  isolation: isolate;
}

.ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 70% 45% at 12% -8%, rgba(255, 122, 89, 0.16), transparent 55%),
    radial-gradient(ellipse 55% 40% at 92% 8%, rgba(88, 140, 255, 0.12), transparent 50%),
    radial-gradient(ellipse 50% 40% at 50% 100%, rgba(20, 28, 48, 0.95), transparent 60%),
    var(--bg);
}

.app-main {
  position: relative;
  z-index: 10;
  min-height: 100dvh;
}

.page-pad-top {
  padding-top: calc(6.25rem + env(safe-area-inset-top, 0px));
}

.snap-x-mandatory {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.snap-start {
  scroll-snap-align: start;
}

.hide-scrollbar {
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.mint-shimmer,
.accent-shimmer {
  background: linear-gradient(
    110deg,
    var(--accent) 0%,
    var(--accent-soft) 40%,
    var(--accent) 80%
  );
  background-size: 200% 100%;
  animation: shimmer 4.5s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  .mint-shimmer,
  .accent-shimmer {
    animation: none;
  }
}
`,
);

console.log("batch 5 done");
