import { DestinationsPageView } from "@/components/DestinationsPage";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Чиглэлүүд",
  description: "Хайнань, Хонг Конг, Бали болон удахгүй нээгдэх чиглэлүүдийн profile.",
};

export default function DestinationsPage() {
  return (
    <Section className="page-pad-top space-y-6 pb-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Destinations"
          title="Аяллын чиглэлүүд"
          description="Чиглэл бүрийн profile-ийг харж, vibe болон үнээсээ сонгоорой."
        />
      </div>
      <DestinationsPageView />
    </Section>
  );
}
