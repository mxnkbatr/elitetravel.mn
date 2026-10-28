import { formatPrice, getTour } from "@/data/tours";
import { withTransforms } from "@/lib/cloudinary";
import { getTours } from "@/lib/server/content";
import { loadDisplayFont, localImageDataUrl, OgFrame, ogSize } from "@/lib/og";
import { ImageResponse } from "next/og";

export const alt = "Elite Travel аялал";
export const size = ogSize;
export const contentType = "image/png";

const placeEn = { hainan: "Hainan", hongkong: "Hong Kong", bali: "Bali", soon: "Coming soon" } as const;

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((t) => ({ id: t.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = getTour(await getTours(), id);
  const background = tour ? withTransforms(tour.image, "f_jpg,q_auto,c_fill,w_640,h_630") : (await localImageDataUrl("media/hero-frame.jpg"));
  const title = tour?.title ?? "Elite Travel";
  const price = tour ? formatPrice(tour.price).replace("₮", "MNT ") : "";
  const meta = tour ? [tour.duration, price].filter(Boolean).join("  ·  ") : undefined;
  const fonts = await loadDisplayFont(`${title}${meta ?? ""}elite`);

  return new ImageResponse(
    <OgFrame
      background={background}
      eyebrow={tour ? `Elite Travel · ${placeEn[tour.destinationKey]}` : "Elite Travel Mongolia"}
      title={title}
      meta={meta}
    />,
    { ...size, fonts },
  );
}
