import fs from "fs";

const res = await fetch("https://elitetravel.mn", {
  headers: { "user-agent": "Mozilla/5.0" },
});
const html = await res.text();
fs.writeFileSync("scripts/_elite-home.html", html, "utf8");
console.log("status", res.status, "len", html.length);

const imgs = [...html.matchAll(/https:\/\/[^"'\\s>]+\.(?:webp|jpg|jpeg|png)/gi)].map(
  (m) => m[0],
);
console.log("unique imgs", [...new Set(imgs)].slice(0, 25));

const titles = [...html.matchAll(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/gi)].map((m) =>
  m[1].replace(/<[^>]+>/g, "").trim(),
);
console.log("titles", titles.filter(Boolean).slice(0, 30));

const prices = [...html.matchAll(/₮[\d'’]+/g)].map((m) => m[0]);
console.log("prices", [...new Set(prices)]);
