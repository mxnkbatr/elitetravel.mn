import { ProfilePageView } from "@/components/ProfilePage";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профайл",
  description: "Таны хадгалсан аялал, сонирхол — Elite Travel profile.",
};

export default function ProfilePage() {
  return (
    <Section className="page-pad-top pb-10">
      <ProfilePageView />
    </Section>
  );
}
