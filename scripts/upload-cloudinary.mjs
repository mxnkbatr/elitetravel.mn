// Uploads site media to Cloudinary so the site no longer depends on the old
// elitetravel.mn asset host or ships large videos from /public.
//
//   node scripts/upload-cloudinary.mjs
//
// Reads CLOUDINARY_* from .env.local. Public IDs are derived from file names
// (elitetravel/tours/<name>, elitetravel/media/<name>) to match src/lib/cloudinary.ts.
// Re-running is safe: uploads overwrite the same public IDs.

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function loadEnv() {
  const env = {};
  for (const line of readFileSync(path.join(root, ".env.local"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

const env = loadEnv();
const cloud = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const key = env.CLOUDINARY_API_KEY;
const secret = env.CLOUDINARY_API_SECRET;
if (!cloud || !key || !secret) throw new Error("Missing CLOUDINARY_* values in .env.local");

/** Every elitetravel.mn asset referenced anywhere in src/ */
function remoteAssets() {
  const found = new Map();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = path.join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx?|mjs)$/.test(name)) {
        for (const m of readFileSync(p, "utf8").matchAll(/([0-9a-f-]{36}\/[\w.-]+\.(?:png|jpe?g|webp))/g)) {
          found.set(m[1], `https://elitetravel.mn/__l5e/assets-v1/${m[1]}`);
        }
      }
    }
  };
  walk(path.join(root, "src"));
  return [...found.entries()].map(([rel, url]) => ({
    file: url,
    publicId: `elitetravel/tours/${path.parse(rel).name}`,
    type: "image",
  }));
}

const localMedia = [
  { name: "web-hero-background.mp4", type: "video" },
  { name: "web-hero-seascape.mp4", type: "video" },
  { name: "hero-frame.jpg", type: "image" },
  { name: "web-hero-seascape-frame.jpg", type: "image" },
].map((m) => ({
  file: path.join(root, "public", "media", m.name),
  publicId: `elitetravel/media/${path.parse(m.name).name}`,
  type: m.type,
}));

function sign(params) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + secret).digest("hex");
}

async function upload({ file, publicId, type }) {
  const params = { overwrite: "true", public_id: publicId, timestamp: Math.floor(Date.now() / 1000) };
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.append(k, String(v));
  form.append("api_key", key);
  form.append("signature", sign(params));
  if (file.startsWith("http")) form.append("file", file);
  else form.append("file", new Blob([readFileSync(file)]), path.basename(file));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${type}/upload`, { method: "POST", body: form });
  const json = await res.json();
  if (!res.ok) throw new Error(`${publicId}: ${json.error?.message ?? res.status}`);
  return json;
}

const jobs = [...remoteAssets(), ...localMedia];
console.log(`Uploading ${jobs.length} files to ${cloud}…`);

let failed = 0;
for (const job of jobs) {
  try {
    const r = await upload(job);
    console.log(`✓ ${r.resource_type.padEnd(5)} ${r.public_id}  ${r.width}x${r.height}  ${Math.round(r.bytes / 1024)} KB`);
  } catch (e) {
    failed++;
    console.error(`✗ ${e.message}`);
  }
}
console.log(failed ? `${failed} failed` : "All uploaded");
process.exitCode = failed ? 1 : 0;
