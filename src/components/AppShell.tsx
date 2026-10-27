"use client";

import { Footer } from "@/components/Footer";
import { ImageLoadMarker } from "@/components/ImageLoadMarker";
import { MobileDock } from "@/components/MobileDock";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SearchOverlay } from "@/components/SearchOverlay";
import { SmoothScroll } from "@/components/SmoothScroll";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <SmoothScroll />
      <ImageLoadMarker />
      <ScrollProgress />
      <Navbar />
      <main className="app-main flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <MobileDock />
      <SearchOverlay />
    </div>
  );
}
