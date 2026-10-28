import { TourDetailView } from "@/components/TourDetailView";
import { getTour } from "@/data/tours";
import { getTours } from "@/lib/server/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tour = getTour(await getTours(), id);
  if (!tour) return { title: "Аялал" };
  return {
    title: tour.title,
    description: tour.description,
  };
}

export default async function TourDetailPage({ params }: Props) {
  const { id } = await params;
  const tour = getTour(await getTours(), id);
  if (!tour) notFound();
  return <TourDetailView tour={tour} />;
}
