import { PageHeader } from "@/components/PageHeader";
import { ProfilePage } from "@/components/ProfilePage";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профайл",
  description: "Таны Elite Travel профайл.",
};

export default function ProfileRoute() {
  return (
    <Section className="page-pad-top space-y-8 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Profile"
          title="Профайл"
          description="Хадгалсан аялал, холбоо барих мэдээлэл."
        />
        <div className="mt-8">
          <ProfilePage />
        </div>
      </div>
    </Section>
  );
}
