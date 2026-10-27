import fs from "fs";

const p = "src/components/FeaturedTour.tsx";
let s = fs.readFileSync(p, "utf8");
const label = "Дэлгэрэнгүй үзэх";
if (!s.includes(label)) {
  s = s.replace(
    /(href=\{`\/tours\/\$\{tour\.id\}`\}[\s\S]*?>)[\s\S]*?(<\/Link>)/,
    `$1${label}$2`,
  );
  fs.writeFileSync(p, s, "utf8");
}
console.log("ok", fs.readFileSync(p, "utf8").includes(label));
