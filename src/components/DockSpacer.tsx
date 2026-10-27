"use client";

import { usePathname } from "next/navigation";

export function DockSpacer() {
  const pathname = usePathname();
  const isTourDetail = /^\/tours\/[^/]+/.test(pathname);
  if (isTourDetail) {
    return (
      <div
        className="pointer-events-none h-[calc(4.75rem+env(safe-area-inset-bottom))] shrink-0 sm:hidden"
        aria-hidden
      />
    );
  }
  return (
    <div
      className="pointer-events-none h-[var(--dock-h)] shrink-0 sm:hidden"
      aria-hidden
    />
  );
}
