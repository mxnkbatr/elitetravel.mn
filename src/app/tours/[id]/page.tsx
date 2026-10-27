import { TourDetailView } from "@/components/TourDetailView";
import { getTour, tours } from "@/data/tours";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type TourDetailProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return tours.map((tour) => ({ id: tour.id }));
}

export async function generateMetadata({
  params,
}: TourDetailProps): Promise<Metadata> {
  const { id } = await params;
  const tour = getTour(id);
  if (!tour) return { title: "Аялал" };
  return {
    title: tour.title,
    description: tour.story,
  };
}

export default async function TourDetailPage({ params }: TourDetailProps) {
  const { id } = await params;
  const tour = getTour(id);
  if (!tour) notFound();

  return (
    <div className="page-pad-top">
      <TourDetailView tour={tour} />
    </div>
  );
}
