import { About } from "@/components/About";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бидний тухай",
  description: "Elite Travel Mongolia — Explore. Dream. Discover.",
};

export default function AboutPage() {
  return (
    <Section className="page-pad-top space-y-8 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="About"
          title="Бидний тухай"
          description="Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с эхэлдэг."
        />
        <div className="mt-8">
          <About />
        </div>
      </div>
    </Section>
  );
}
