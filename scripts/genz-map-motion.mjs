import fs from "fs";
import path from "path";

function write(rel, content) {
  fs.writeFileSync(path.join(process.cwd(), rel), content, "utf8");
  console.log("ok", rel);
}

write(
  "src/components/DestinationMap.tsx",
  `"use client";

import { motion } from "framer-motion";
import { Map, Marker, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type MapPin = {
  key: string;
  name: string;
  en: string;
  lng: number;
  lat: number;
  hub?: boolean;
};

const pins: MapPin[] = [
  { key: "ub", name: "Улаанбаатар", en: "Ulaanbaatar", lng: 106.917, lat: 47.918, hub: true },
  { key: "hongkong", name: "Хонг Конг", en: "Hong Kong", lng: 114.1694, lat: 22.3193 },
  { key: "hainan", name: "Хайнань", en: "Hainan", lng: 109.508, lat: 18.247 },
  { key: "bali", name: "Бали", en: "Bali", lng: 115.1889, lat: -8.4095 },
  { key: "egypt", name: "Египет", en: "Egypt", lng: 31.2357, lat: 30.0444 },
];

type DestinationMapProps = {
  active: string;
  onSelect: (key: string) => void;
};

function tourHref(key: string) {
  return \`/tours?dest=\${key === "egypt" ? "soon" : key}\`;
}

function styleUrl(key: string) {
  const style = process.env.NEXT_PUBLIC_MAPTILER_STYLE || "streets-v2";
  return \`https://api.maptiler.com/maps/\${style}/style.json?key=\${key}\`;
}

const blobs = [
  { className: "genz-blob genz-blob-a", delay: 0 },
  { className: "genz-blob genz-blob-b", delay: 0.4 },
  { className: "genz-blob genz-blob-c", delay: 0.8 },
];

export function DestinationMap({ active, onSelect }: DestinationMapProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const activeRef = useRef(active);
  const onSelectRef = useRef(onSelect);
  const dashRef = useRef(0);
  const rafRef = useRef(0);
  const driftRef = useRef(0);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    if (!containerRef.current || !apiKey || mapRef.current) return;

    const map = new Map({
      container: containerRef.current,
      style: styleUrl(apiKey),
      center: [95, 22],
      zoom: 2.2,
      pitch: 28,
      bearing: -12,
      attributionControl: {},
    });

    map.addControl(new NavigationControl({ visualizePitch: true }), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      const hub = pins.find((p) => p.hub)!;
      const routes: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: pins
          .filter((p) => !p.hub)
          .map((p) => ({
            type: "Feature",
            properties: { key: p.key },
            geometry: {
              type: "LineString",
              coordinates: [
                [hub.lng, hub.lat],
                [(hub.lng + p.lng) / 2 - 4, (hub.lat + p.lat) / 2 + 12],
                [p.lng, p.lat],
              ],
            },
          })),
      };

      map.addSource("elite-routes", { type: "geojson", data: routes });
      map.addLayer({
        id: "elite-routes-glow",
        type: "line",
        source: "elite-routes",
        paint: {
          "line-color": "#5ef0d0",
          "line-width": 6,
          "line-opacity": 0.22,
          "line-blur": 1.2,
        },
      });
      map.addLayer({
        id: "elite-routes-line",
        type: "line",
        source: "elite-routes",
        paint: {
          "line-color": "#00a890",
          "line-width": 2.4,
          "line-opacity": 0.75,
          "line-dasharray": [0.8, 1.6],
        },
      });

      // flowing dash + gentle camera morph loop
      const tick = (t: number) => {
        dashRef.current = (t / 180) % 24;
        if (map.getLayer("elite-routes-line")) {
          try {
            map.setPaintProperty("elite-routes-line", "line-dasharray", [
              0.6 + Math.sin(t / 600) * 0.35,
              1.4,
            ]);
          } catch {
            /* ignore */
          }
        }
        // idle camera drift — Gen Z living map
        if (!map.isMoving()) {
          driftRef.current += 0.008;
          const b = -12 + Math.sin(driftRef.current) * 6;
          const p = 26 + Math.cos(driftRef.current * 0.7) * 5;
          map.easeTo({ bearing: b, pitch: p, duration: 1200, easing: (x) => x });
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = pins.map((p, i) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "elite-map-pin";
        el.style.setProperty("--pin-delay", \`\${i * 0.12}s\`);
        el.setAttribute("data-key", p.key);
        el.innerHTML = \`
          <span class="elite-map-ring"></span>
          <span class="elite-map-ring elite-map-ring-2"></span>
          <span class="elite-map-dot"></span>
          <span class="elite-map-label">\${p.en}</span>
        \`;
        if (p.hub) el.classList.add("is-hub");

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          el.classList.add("is-pop");
          window.setTimeout(() => el.classList.remove("is-pop"), 450);
          if (p.hub) {
            map.flyTo({
              center: [p.lng, p.lat],
              zoom: 4.4,
              pitch: 45,
              bearing: 20,
              essential: true,
            });
            return;
          }
          onSelectRef.current(p.key);
          map.flyTo({
            center: [p.lng, p.lat],
            zoom: 5.4,
            pitch: 48,
            bearing: -18,
            essential: true,
            speed: 0.85,
            curve: 1.4,
          });
        });

        el.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          if (p.hub) return;
          onSelectRef.current(p.key);
          window.location.assign(tourHref(p.key));
        });

        return new Marker({ element: el, anchor: "bottom" })
          .setLngLat([p.lng, p.lat])
          .addTo(map);
      });

      syncActivePins(activeRef.current);

      // entrance zoom morph
      map.flyTo({
        center: [95, 22],
        zoom: 2.55,
        pitch: 32,
        bearing: -8,
        duration: 2200,
        essential: true,
      });
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    syncActivePins(active);
    const map = mapRef.current;
    const pin = pins.find((p) => p.key === active);
    if (map && pin && !pin.hub) {
      map.flyTo({
        center: [pin.lng, pin.lat],
        zoom: 5.3,
        pitch: 46,
        bearing: -16,
        essential: true,
      });
    }
  }, [active]);

  function syncActivePins(key: string) {
    markersRef.current.forEach((marker) => {
      const el = marker.getElement();
      const k = el.getAttribute("data-key");
      el.classList.toggle("is-active", k === key);
    });
  }

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const activePin = pins.find((p) => p.key === active);

  return (
    <motion.div
      className="epic-card relative overflow-hidden"
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {blobs.map((b) => (
        <div key={b.className} className={b.className} style={{ animationDelay: \`\${b.delay}s\` }} />
      ))}

      <div className="relative px-3 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <motion.p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-accent"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              Live map · Gen motion
            </motion.p>
            <p className="mt-1 font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
              Elite чиглэлүүд
            </p>
          </div>
          <p className="text-xs text-muted">Цэг дээр дар — map өөрөө хөдөлнө</p>
        </div>

        <div className="genz-map-shell relative overflow-hidden rounded-[1.1rem] border border-[var(--line)]">
          <div className="genz-scanline" aria-hidden />
          {!apiKey ? (
            <div className="grid aspect-[16/10] place-items-center bg-accent-mist px-6 text-center text-sm text-muted">
              MapTiler key байхгүй байна. <code className="mx-1 text-accent">.env.local</code> дээр
              NEXT_PUBLIC_MAPTILER_KEY нэмээд restart хийнэ үү.
            </div>
          ) : (
            <div ref={containerRef} className="elite-map-canvas aspect-[16/10] w-full" />
          )}

          {apiKey && activePin && !activePin.hub ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push(tourHref(activePin.key))}
              className="absolute bottom-3 right-3 z-10 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(0,168,144,0.45)] sm:bottom-4 sm:right-4"
            >
              {activePin.name} аялал руу →
            </motion.button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
`,
);

const cssPath = path.join(process.cwd(), "src/app/globals.css");
let css = fs.readFileSync(cssPath, "utf8");
// replace old map pin block with genz version
const start = css.indexOf(".elite-map-canvas .maplibregl-canvas");
if (start !== -1) {
  css = css.slice(0, start);
}
css += `
.elite-map-canvas .maplibregl-canvas {
  outline: none;
}
.elite-map-canvas .maplibregl-ctrl-group {
  border: 1px solid var(--line) !important;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: var(--shadow);
}
.genz-map-shell {
  isolation: isolate;
}
.genz-scanline {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(94, 240, 208, 0.07) 48%,
    transparent 52%,
    transparent 100%
  );
  background-size: 100% 220%;
  animation: genz-scan 4.5s linear infinite;
  mix-blend-mode: soft-light;
}
@keyframes genz-scan {
  0% { background-position: 0 -40%; }
  100% { background-position: 0 140%; }
}
.genz-blob {
  pointer-events: none;
  position: absolute;
  border-radius: 40% 60% 55% 45%;
  filter: blur(28px);
  opacity: 0.55;
  animation: genz-morph 8s ease-in-out infinite;
}
.genz-blob-a {
  width: 220px;
  height: 180px;
  left: -40px;
  top: -30px;
  background: rgba(0, 168, 144, 0.35);
}
.genz-blob-b {
  width: 260px;
  height: 200px;
  right: -50px;
  top: 20%;
  background: rgba(255, 155, 66, 0.28);
  animation-duration: 10s;
  animation-direction: reverse;
}
.genz-blob-c {
  width: 180px;
  height: 160px;
  left: 35%;
  bottom: -40px;
  background: rgba(94, 240, 208, 0.3);
  animation-duration: 7s;
}
@keyframes genz-morph {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); border-radius: 40% 60% 55% 45%; }
  33% { transform: translate(18px, -14px) scale(1.12) rotate(8deg); border-radius: 55% 45% 40% 60%; }
  66% { transform: translate(-12px, 16px) scale(0.92) rotate(-6deg); border-radius: 45% 55% 60% 40%; }
  100% { transform: translate(0, 0) scale(1) rotate(0deg); border-radius: 40% 60% 55% 45%; }
}
.elite-map-pin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  animation: genz-float 3.2s ease-in-out infinite;
  animation-delay: var(--pin-delay, 0s);
}
@keyframes genz-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}
.elite-map-ring {
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 2px solid rgba(0, 168, 144, 0.45);
  top: -7px;
  animation: genz-ring 2.2s ease-out infinite;
  pointer-events: none;
}
.elite-map-ring-2 {
  animation-delay: 0.7s;
  border-color: rgba(255, 155, 66, 0.4);
}
@keyframes genz-ring {
  0% { transform: scale(0.55); opacity: 0.85; }
  100% { transform: scale(2.1); opacity: 0; }
}
.elite-map-dot {
  position: relative;
  z-index: 1;
  width: 15px;
  height: 15px;
  border-radius: 999px;
  background: var(--accent);
  border: 2.5px solid #fff;
  box-shadow: 0 0 0 6px rgba(0, 168, 144, 0.2), 0 0 18px rgba(0, 168, 144, 0.45);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), background 0.25s ease, box-shadow 0.25s ease;
}
.elite-map-pin.is-hub .elite-map-dot {
  background: var(--gold);
  box-shadow: 0 0 0 8px rgba(255, 155, 66, 0.25), 0 0 22px rgba(255, 155, 66, 0.5);
}
.elite-map-pin.is-active .elite-map-dot {
  transform: scale(1.28);
  box-shadow: 0 0 0 12px rgba(0, 168, 144, 0.28), 0 0 28px rgba(94, 240, 208, 0.65);
}
.elite-map-pin.is-pop .elite-map-dot {
  animation: genz-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes genz-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.55) rotate(-8deg); }
  100% { transform: scale(1.28) rotate(0deg); }
}
.elite-map-label {
  position: relative;
  z-index: 1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 5px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--ink);
  border: 1px solid var(--line);
  white-space: nowrap;
  box-shadow: 0 10px 24px rgba(10, 47, 43, 0.12);
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
}
.elite-map-pin:hover .elite-map-label {
  transform: translateY(-2px) scale(1.04) rotate(-1deg);
}
.elite-map-pin.is-active .elite-map-label {
  background: var(--accent);
  color: #fff;
  border-color: transparent;
  transform: scale(1.06);
}
.elite-map-pin.is-hub .elite-map-label {
  background: var(--gold);
  color: var(--ink);
  border-color: transparent;
}

@media (prefers-reduced-motion: reduce) {
  .genz-blob,
  .genz-scanline,
  .elite-map-pin,
  .elite-map-ring {
    animation: none !important;
  }
}
`;
fs.writeFileSync(cssPath, css, "utf8");
console.log("genz motion done");
