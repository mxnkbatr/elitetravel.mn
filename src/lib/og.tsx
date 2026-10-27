import { readFile } from "node:fs/promises";
import path from "node:path";

export const ogSize = { width: 1200, height: 630 };

/** Cormorant Garamond subset for the given text — default OG font has no Cyrillic. */
export async function loadDisplayFont(text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return [];
    const data = await (await fetch(src)).arrayBuffer();
    return [{ name: "Display", data, weight: 700 as const, style: "normal" as const }];
  } catch {
    return [];
  }
}

export async function localImageDataUrl(publicPath: string) {
  const buf = await readFile(path.join(process.cwd(), "public", publicPath));
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

/** Text panel on the left, photo on the right — tour posters already carry their own lettering. */
export function OgFrame({
  background,
  eyebrow,
  title,
  meta,
}: {
  background: string;
  eyebrow: string;
  title: string;
  meta?: string;
}) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "#062a2a" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560, padding: "56px 56px 60px" }}>
        <div style={{ display: "flex", fontFamily: "Display", fontSize: 52, color: "white" }}>elite</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: "#7ef0e0", textTransform: "uppercase" }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", width: 72, height: 4, marginTop: 20, backgroundColor: "#e8b86d" }} />
          <div style={{ display: "flex", marginTop: 22, fontFamily: "Display", fontSize: 62, lineHeight: 1.05, color: "white" }}>
            {title}
          </div>
          {meta ? (
            <div style={{ display: "flex", marginTop: 22, fontFamily: "Display", fontSize: 30, color: "#f3d199" }}>{meta}</div>
          ) : null}
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={background} alt="" width={640} height={630} style={{ width: 640, height: 630, objectFit: "cover" }} />
    </div>
  );
}
