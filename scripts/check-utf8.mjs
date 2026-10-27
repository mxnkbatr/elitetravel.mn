import fs from "fs";

for (const f of [
  "src/data/tours.ts",
  "src/app/layout.tsx",
  "src/app/tours/page.tsx",
  "scripts/build-epic-site.mjs",
]) {
  const buf = fs.readFileSync(f);
  const s = buf.toString("utf8");
  const hasHainan = s.includes("Хайнань") || s.includes("\u0425\u0430\u0439\u043d\u0430\u043d\u044c");
  const hasMojibake = s.includes("Ð¥") || s.includes("Ñ");
  console.log(f, {
    hasHainan,
    hasMojibake,
    sample: [...s].filter((c) => c.charCodeAt(0) > 127).slice(0, 12).join(""),
  });
}
