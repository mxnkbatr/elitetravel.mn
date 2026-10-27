import fs from "fs";

let layout = fs.readFileSync("src/app/layout.tsx", "utf8");
layout = layout.replace(/themeColor:\s*"[^"]+"/, 'themeColor: "#0c1f1c"');
fs.writeFileSync("src/app/layout.tsx", layout, "utf8");
console.log("layout themeColor updated");

let contact = fs.readFileSync("src/components/Contact.tsx", "utf8");
contact = contact.replace(
  /rgba\(255,\s*122,\s*89,\s*0\.2\),\s*rgba\(10,\s*13,\s*20,\s*0\.35\)/,
  "rgba(94,235,195,0.18),rgba(12,31,28,0.3)",
);
fs.writeFileSync("src/components/Contact.tsx", contact, "utf8");
console.log("contact gradient updated", contact.includes("94,235,195"));
