import fs from "fs";

const p = "src/components/Hero.tsx";
let s = fs.readFileSync(p, "utf8");

const replacements = [
  [/Дэлгэрэнгүй үзэх/g, "Дэлгэрэнгүй үзэх"],
  [/Бүх аялал/g, "Бүх аялал"],
  [/Эрэлттэй/g, "Эрэлттэй"],
];

// If already good, skip. Otherwise patch by known English anchors.
if (!s.includes("Дэлгэрэнгүй үзэх")) {
  s = s.replace(
    /(href=\{`\/tours\/\$\{slide\.id\}`\}[\s\S]*?>)[\s\S]*?(<\/Link>)/,
    `$1Дэлгэрэнгүй үзэх$2`,
  );
}
if (!s.includes("Бүх аялал")) {
  s = s.replace(
    /(href="\/tours"[\s\S]*?>)[\s\S]*?(<\/Link>)/,
    `$1Бүх аялал$2`,
  );
}
if (!s.includes("Эрэлттэй")) {
  s = s.replace(
    /(slide\.tag === "hot" \? \([\s\S]*?<span[^>]*>)([\s\S]*?)(<\/span>)/,
    `$1Эрэлттэй$3`,
  );
}

fs.writeFileSync(p, s, "utf8");
const out = fs.readFileSync(p, "utf8");
console.log({
  detail: out.includes("Дэлгэрэнгүй үзэх"),
  all: out.includes("Бүх аялал"),
  hot: out.includes("Эрэлттэй"),
});
