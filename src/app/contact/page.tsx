import { Contact } from "@/components/Contact";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Холбоо барих",
  description: "Elite Travel-тай Instagram, Messenger эсвэл утсаар холбогдоорой.",
};

export default function ContactPage() {
  return (
    <Section className="page-pad-top pb-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <PageHeader
          eyebrow="Contact"
          title="Холбоо барих"
          description="Дуртай аялаа сонгоод шууд холбогдоорой. Бид хурдан хариулъя."
        />
        <Contact showIntro={false} />
      </div>
    </Section>
  );
}
