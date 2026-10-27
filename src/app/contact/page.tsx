import { Contact } from "@/components/Contact";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Холбоо барих",
  description: "Elite Travel Mongolia-тай холбогдох.",
};

export default function ContactPage() {
  return (
    <Section className="page-pad-top space-y-8 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Contact"
          title="Холбоо барих"
          description="Instagram, Messenger эсвэл утсаар шууд холбогдоорой."
        />
        <div className="mt-8">
          <Contact />
        </div>
      </div>
    </Section>
  );
}
