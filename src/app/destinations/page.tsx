import { DestinationsPageView } from "@/components/DestinationsPage";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Чиглэлүүд",
  description: "Хайнань, Хонг Конг, Бали болон бусад чиглэлүүд.",
};

export default function DestinationsPage() {
  return (
    <Section className="page-pad-top space-y-8 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Destinations"
          title="Аяллын чиглэлүүд"
          description="elitetravel.mn дээрх бодит чиглэлүүд — далай, хот, концерт."
        />
        <div className="mt-8">
          <DestinationsPageView />
        </div>
      </div>
    </Section>
  );
}
