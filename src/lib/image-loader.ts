"use client";

import type { ImageLoaderProps } from "next/image";

/** Cloudinary resizes and picks webp/avif per browser; local files pass through. */
export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  if (src.includes("res.cloudinary.com") && src.includes("/image/upload/")) {
    const q = quality ? `q_${quality}` : "q_auto";
    return src.replace("/image/upload/", `/image/upload/f_auto,${q},c_limit,w_${width}/`);
  }
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
