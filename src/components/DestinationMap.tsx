"use client";

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
  return `/tours?dest=${key === "egypt" ? "soon" : key}`;
}

function styleUrl(key: string) {
  const style = process.env.NEXT_PUBLIC_MAPTILER_STYLE || "streets-v2";
  return `https://api.maptiler.com/maps/${style}/style.json?key=${key}`;
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

    let usedFallback = false;
    map.on("error", () => {
      if (usedFallback || map.getSource("elite-routes")) return;
      usedFallback = true;
      try {
        // MapTiler 403/origin block → keep motion live on MapLibre demo style
        map.setStyle("https://demotiles.maplibre.org/style.json");
      } catch {
        /* ignore */
      }
    });

    const bootLayers = () => {
      if (map.getSource("elite-routes")) return;
      cancelAnimationFrame(rafRef.current);
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
          "line-color": "#2ec4b6",
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
          "line-color": "#0e8f84",
          "line-width": 2.4,
          "line-opacity": 0.75,
          "line-dasharray": [0.8, 1.6],
        },
      });

      // flowing dashes + idle camera morph (no stacked easeTo)
      let userTouch = false;
      const onInteract = () => {
        userTouch = true;
      };
      const onIdle = () => {
        userTouch = false;
      };
      map.on("dragstart", onInteract);
      map.on("zoomstart", onInteract);
      map.on("pitchstart", onInteract);
      map.on("rotatestart", onInteract);
      map.on("touchstart", onInteract);
      map.on("idle", onIdle);

      const tick = (t: number) => {
        const phase = (t / 90) % 40;
        dashRef.current = phase;
        if (map.getLayer("elite-routes-line")) {
          try {
            const a = 0.35 + ((phase % 8) / 8) * 1.4;
            const b = 2.2 - a * 0.35;
            map.setPaintProperty("elite-routes-line", "line-dasharray", [a, b]);
            map.setPaintProperty(
              "elite-routes-glow",
              "line-opacity",
              0.14 + Math.sin(t / 700) * 0.1,
            );
          } catch {
            /* ignore */
          }
        }
        if (!userTouch && !map.isMoving()) {
          driftRef.current += 0.012;
          const b = -12 + Math.sin(driftRef.current) * 10;
          const p = 28 + Math.cos(driftRef.current * 0.65) * 8;
          map.setBearing(b);
          map.setPitch(p);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = pins.map((p, i) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "elite-map-pin";
        el.style.setProperty("--pin-delay", `${i * 0.12}s`);
        el.setAttribute("data-key", p.key);
        el.innerHTML = `
          <span class="elite-map-ring"></span>
          <span class="elite-map-ring elite-map-ring-2"></span>
          <span class="elite-map-dot"></span>
          <span class="elite-map-label">${p.en}</span>
        `;
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
    };

    map.on("load", bootLayers);
    map.on("style.load", bootLayers);

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
        <div key={b.className} className={b.className} style={{ animationDelay: `${b.delay}s` }} />
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
