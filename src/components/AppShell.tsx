"use client";

import { AiHelper } from "@/components/AiHelper";
import { Footer } from "@/components/Footer";
import { ImageLoadMarker } from "@/components/ImageLoadMarker";
import { IntroCurtain } from "@/components/IntroCurtain";
import { MobileDock } from "@/components/MobileDock";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SearchOverlay } from "@/components/SearchOverlay";
import { SmoothScroll } from "@/components/SmoothScroll";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  // The staff panel has its own chrome and skips the intro, nav and chat
  if (usePathname().startsWith("/admin")) return <>{children}</>;

  return (
    <div className="relative flex min-h-dvh flex-col">
      <IntroCurtain />
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
      <AiHelper />
    </div>
  );
}
