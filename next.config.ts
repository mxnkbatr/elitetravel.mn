import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  // Чиглэл → map page, Холбоо → contact block on About
  async redirects() {
    return [
      { source: "/destinations", destination: "/map", permanent: true },
      { source: "/contact", destination: "/about#contact", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
