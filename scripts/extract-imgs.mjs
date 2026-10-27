import fs from "fs";

const h = fs.readFileSync("scripts/_elite-home.html", "utf8");
const all = [...h.matchAll(/https?:\/\/[^"'\\\s<>]+/g)].map((m) => m[0]);
const media = all.filter((u) =>
  /webp|jpg|jpeg|png|__l5e|cdn|cloudinary|unsplash|image|assets/i.test(u),
);
console.log([...new Set(media)].slice(0, 50).join("\n"));

// also relative asset paths
const rel = [...h.matchAll(/\/__l5e\/[^"'\\\s<>]+/g)].map((m) => m[0]);
console.log("---rel---");
console.log([...new Set(rel)].slice(0, 40).join("\n"));
