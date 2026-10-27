import fs from "fs";
import path from "path";

function write(rel, content) {
  fs.mkdirSync(path.dirname(path.join(process.cwd(), rel)), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), rel), content, "utf8");
  console.log("ok", rel);
}

write(
  "src/components/DestinationMap.tsx",
  `"use client";

import { motion } from "framer-motion";
import maplibregl, { type Map, type Marker } from "maplibre-gl";
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

export function DestinationMap({ active, onSelect }: DestinationMapProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const activeRef = useRef(active);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    if (!containerRef.current || !apiKey || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl(apiKey),
      center: [95, 25],
      zoom: 2.35,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      // soft commercial tint overlays site palette
      if (map.getLayer("background")) {
        try {
          map.setPaintProperty("background", "background-color", "#e8f6f2");
        } catch {
          /* style may not expose background */
        }
      }

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
                [(hub.lng + p.lng) / 2, Math.max(hub.lat, p.lat) + 8],
                [p.lng, p.lat],
              ],
            },
          })),
      };

      map.addSource("elite-routes", { type: "geojson", data: routes });
      map.addLayer({
        id: "elite-routes-line",
        type: "line",
        source: "elite-routes",
        paint: {
          "line-color": "#00a890",
          "line-width": 2,
          "line-opacity": 0.45,
          "line-dasharray": [1.2, 1.6],
        },
      });

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = pins.map((p) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "elite-map-pin";
        el.setAttribute("data-key", p.key);
        el.innerHTML = \`<span class="elite-map-dot"></span><span class="elite-map-label">\${p.en}</span>\`;
        if (p.hub) el.classList.add("is-hub");

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          if (p.hub) {
            map.flyTo({ center: [p.lng, p.lat], zoom: 4.2, essential: true });
            return;
          }
          onSelectRef.current(p.key);
          map.flyTo({ center: [p.lng, p.lat], zoom: 5.2, essential: true });
        });

        el.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          if (p.hub) return;
          onSelectRef.current(p.key);
          window.location.assign(tourHref(p.key));
        });

        return new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([p.lng, p.lat])
          .addTo(map);
      });

      syncActivePins(activeRef.current);
    });

    return () => {
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
      map.flyTo({ center: [pin.lng, pin.lat], zoom: 5.1, essential: true });
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
    <div className="epic-card relative overflow-hidden">
      <div className="relative px-3 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
              Live map · MapTiler
            </p>
            <p className="mt-1 font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
              Elite чиглэлүүд
            </p>
          </div>
          <p className="text-xs text-muted">Цэг дээр дарж ороорой</p>
        </div>

        <div className="relative overflow-hidden rounded-[1.1rem] border border-[var(--line)]">
          {!apiKey ? (
            <div className="grid aspect-[16/10] place-items-center bg-accent-mist px-6 text-center text-sm text-muted">
              MapTiler key байхгүй байна. <code className="mx-1 text-accent">.env.local</code> дээр
              NEXT_PUBLIC_MAPTILER_KEY нэмээд dev server-ээ restart хийнэ үү.
            </div>
          ) : (
            <div ref={containerRef} className="elite-map-canvas aspect-[16/10] w-full" />
          )}

          {apiKey && activePin && !activePin.hub ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => router.push(tourHref(activePin.key))}
              className="absolute bottom-3 right-3 z-10 inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(0,168,144,0.35)] transition hover:bg-accent-soft sm:bottom-4 sm:right-4"
            >
              {activePin.name} аялал руу →
            </motion.button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
`,
);

// map pin styles
const cssPath = path.join(process.cwd(), "src/app/globals.css");
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(".elite-map-canvas")) {
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
.elite-map-pin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.elite-map-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: var(--accent);
  border: 2.5px solid #fff;
  box-shadow: 0 0 0 6px rgba(0, 168, 144, 0.18);
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}
.elite-map-pin.is-hub .elite-map-dot {
  background: var(--gold);
  box-shadow: 0 0 0 8px rgba(255, 155, 66, 0.22);
}
.elite-map-pin.is-active .elite-map-dot {
  transform: scale(1.2);
  background: var(--accent);
  box-shadow: 0 0 0 10px rgba(0, 168, 144, 0.28);
}
.elite-map-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff;
  color: var(--ink);
  border: 1px solid var(--line);
  white-space: nowrap;
  box-shadow: 0 8px 20px rgba(10, 47, 43, 0.08);
}
.elite-map-pin.is-active .elite-map-label,
.elite-map-pin.is-hub .elite-map-label {
  background: var(--accent);
  color: #fff;
  border-color: transparent;
}
.elite-map-pin.is-hub .elite-map-label {
  background: var(--gold);
  color: var(--ink);
}
`;
  fs.writeFileSync(cssPath, css, "utf8");
  console.log("ok map css");
}

console.log("maptiler wired");
