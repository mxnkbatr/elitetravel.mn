import fs from "fs";
import path from "path";

const swaps = [
  ["#0b6b5c", "#00a890"],
  ["#0B6B5C", "#00a890"],
  ["#148f7a", "#12c4a8"],
  ["#e8a84a", "#ff9b42"],
  ["#E8A84A", "#ff9b42"],
  ["#ffe7a8", "#ffe0c2"],
  ["#9af5db", "#5ef0d0"],
  ["#f6f3ee", "#f2faf7"],
  ["#c97a28", "#e8842a"],
  ["#5fd4b8", "#5ef0d0"],
  ["rgba(11,107,92,", "rgba(0,168,144,"],
  ["rgba(232,168,74,", "rgba(255,155,66,"],
  ["rgba(20,40,36,", "rgba(10,47,43,"],
];

const files = [
  "src/components/DestinationMap.tsx",
  "src/components/EliteLogo.tsx",
  "src/components/Hero.tsx",
  "src/components/Marquee.tsx",
  "src/components/Navbar.tsx",
  "src/components/ToursCarousel.tsx",
  "src/components/Destinations.tsx",
  "src/components/TourDetailView.tsx",
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/components/ThemeProvider.tsx",
];

for (const rel of files) {
  const full = path.join(process.cwd(), rel);
  if (!fs.existsSync(full)) continue;
  let s = fs.readFileSync(full, "utf8");
  let before = s;
  for (const [a, b] of swaps) s = s.split(a).join(b);
  if (s !== before) {
    fs.writeFileSync(full, s, "utf8");
    console.log("tinted", rel);
  }
}

// fix globals mint theme token collision
const cssPath = path.join(process.cwd(), "src/app/globals.css");
let css = fs.readFileSync(cssPath, "utf8");
css = css.replace(
  `--color-mint: var(--accent);
  --color-mint-soft: var(--accent-soft);
  --color-mint-deep: var(--accent);`,
  `--color-mint-soft: var(--accent-soft);
  --color-mint-deep: var(--accent);`,
);
fs.writeFileSync(cssPath, css, "utf8");
console.log("youth tint done");
