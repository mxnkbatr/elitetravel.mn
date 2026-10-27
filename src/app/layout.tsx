import { AppShell } from "@/components/AppShell";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const body = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Elite Travel Mongolia | Explore. Dream. Discover.",
    template: "%s Â· Elite Travel",
  },
  description:
    "Ð¥Ð¾Ð½Ð³ ÐÐ¾Ð½Ð³, Ð¥Ð°Ð¹Ð½Ð°Ð½Ñ, ÐÐ°Ð»Ð¸ Ð±Ð¾Ð»Ð¾Ð½ ÐºÐ¾Ð½ÑÐµÑÑ Ð°ÑÐ»Ð»ÑÑÐ´ â Elite Travel Mongolia.",
  metadataBase: new URL("https://elitetravel.mn"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#eef5f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full bg-bg font-sans text-foam antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
