import fs from "fs";

const t = fs.readFileSync("src/data/tours.ts", "utf8");
const d = fs.readFileSync("src/components/TourDetailView.tsx", "utf8");
const m = t.match(/title: "([^"]+)"/);
console.log("first title:", m && m[1]);
console.log("includes Хайнань:", t.includes("Хайнань"));
console.log("includes mojibake Ð:", t.includes("Ð"));
console.log("has story:", t.includes("story:"));
console.log("detail itinerary mn:", d.includes("Өдөр тутмын"));
console.log("detail mojibake:", d.includes("Ð"));
console.log("codepoint sample:", [...(m?.[1] || "")].slice(0, 8).map((c) => c.codePointAt(0).toString(16)));
