import { loadDisplayFont, localImageDataUrl, OgFrame, ogSize } from "@/lib/og";
import { ImageResponse } from "next/og";

export const alt = "Elite Travel Mongolia — Халуун орны тансаг аялал";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const title = "Халуун орны тансаг аялал";
  const background = await localImageDataUrl("media/hero-frame.jpg");
  const fonts = await loadDisplayFont(`${title}elite`);

  return new ImageResponse(
    <OgFrame
      background={background}
      eyebrow="Elite Travel Mongolia"
      title={fonts.length ? title : "Explore. Dream. Discover."}
      meta="Hainan · Hong Kong · Bali"
    />,
    { ...size, fonts },
  );
}
