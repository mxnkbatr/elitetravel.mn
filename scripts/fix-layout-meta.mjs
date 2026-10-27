import fs from "fs";

const content = `import { AppShell } from "@/components/AppShell";
import type { Metadata, Viewport } from "next";
import { Geologica, Golos_Text } from "next/font/google";
import "./globals.css";

const display = Geologica({
  variable: "--font-geologica",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const body = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Elite Travel Mongolia | Explore. Dream. Discover.",
    template: "%s · Elite Travel",
  },
  description:
    "Залууст зориулсан premium аялал — Хонг Конг, Хайнань, Бали болон концерт аяллууд.",
  metadataBase: new URL("https://elitetravel.mn"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Elite Travel",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c1f1c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="mn"
      className={\`\${display.variable} \${body.variable} h-full antialiased\`}
    >
      <body className="min-h-full font-sans text-foam">
        <div className="ambient" aria-hidden />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
`;

fs.writeFileSync("src/app/layout.tsx", content, "utf8");
console.log("ok layout");
