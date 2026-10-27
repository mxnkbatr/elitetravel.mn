"use client";

import { useEffect } from "react";

/** Flags loaded images so the CSS shimmer skeleton stops repainting behind them. */
export function ImageLoadMarker() {
  useEffect(() => {
    const mark = (img: HTMLImageElement) => img.setAttribute("data-loaded", "");
    document.querySelectorAll<HTMLImageElement>("img[data-nimg]").forEach((img) => img.complete && mark(img));
    const onLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement) mark(e.target);
    };
    document.addEventListener("load", onLoad, true);
    return () => document.removeEventListener("load", onLoad, true);
  }, []);
  return null;
}
