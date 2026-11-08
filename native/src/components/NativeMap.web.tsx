import { useEffect, useRef } from "react";
import { View } from "react-native";
import { MAP_DESTINATIONS, MAP_HUB, MAP_STYLE_URL, OPENING_BOUNDS, ROUTE_COLLECTION, focusBounds } from "../lib/map-pins";

/**
 * Browser preview of the same MapLibre + OpenFreeMap map the website uses.
 * The iOS/Android view is NativeMap.tsx and is not what this file draws.
 */
export function NativeMap({ active, onSelect, onUnavailable }: { active: string; onSelect: (key: string) => void; onUnavailable?: () => void }) {
  const activeRef = useRef(active);
  const onSelectRef = useRef(onSelect);
  const focusRef = useRef<(key: string) => void>(() => {});
  activeRef.current = active;
  onSelectRef.current = onSelect;

  useEffect(() => {
    const node = document.getElementById("elite-map-host");
    if (!node) {
      onUnavailable?.();
      return;
    }
    let cancelled = false;
    let map: import("maplibre-gl").Map | null = null;
    let timer = 0;
    const pins: HTMLElement[] = [];

    void import("maplibre-gl")
      .then(({ Map, Marker, setWorkerUrl }) => {
        if (cancelled) return;
        if (!document.getElementById("maplibre-css")) {
          const link = document.createElement("link");
          link.id = "maplibre-css";
          link.rel = "stylesheet";
          link.href = "/maplibre-gl.css";
          document.head.appendChild(link);
        }
        setWorkerUrl("/maplibre-gl-worker.mjs");
        if (!document.getElementById("elite-map-ctrl")) {
          const style = document.createElement("style");
          style.id = "elite-map-ctrl";
          style.textContent = ".maplibregl-ctrl-bottom-right{top:62px;bottom:auto;right:8px}";
          document.head.appendChild(style);
        }
        map = new Map({
          container: node,
          style: MAP_STYLE_URL,
          bounds: [
            [OPENING_BOUNDS[0], OPENING_BOUNDS[1]],
            [OPENING_BOUNDS[2], OPENING_BOUNDS[3]],
          ],
          attributionControl: { compact: true },
          renderWorldCopies: false,
          fadeDuration: 0,
        });
        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();
        let loaded = false;
        timer = window.setTimeout(() => {
          if (!cancelled && !loaded) onUnavailable?.();
        }, 8000);
        map.on("load", () => {
          loaded = true;
          window.clearTimeout(timer);
          if (!map) return;
          if (map.getLayer("water")) map.setPaintProperty("water", "fill-color", "#cfe8e3");
          if (map.getLayer("background")) map.setPaintProperty("background", "background-color", "#f5f7f2");
          map.addSource("routes", { type: "geojson", data: ROUTE_COLLECTION });
          map.addLayer({ id: "routes-base", type: "line", source: "routes", layout: { "line-cap": "round" }, paint: { "line-color": "#0b7d73", "line-width": 1.4, "line-opacity": 0.35 } });
          map.addLayer({ id: "routes-glow", type: "line", source: "routes", filter: ["==", ["get", "key"], activeRef.current], layout: { "line-cap": "round" }, paint: { "line-color": "#e8b86d", "line-width": 8, "line-opacity": 0.35 } });
          map.addLayer({ id: "routes-active", type: "line", source: "routes", filter: ["==", ["get", "key"], activeRef.current], layout: { "line-cap": "round" }, paint: { "line-color": "#0b7d73", "line-width": 2.6 } });

          const hub = document.createElement("div");
          hub.setAttribute("aria-label", MAP_HUB.name);
          hub.style.cssText = "width:12px;height:12px;border-radius:99px;background:#0a2a26;border:2px solid #fff";
          new Marker({ element: hub, anchor: "center" }).setLngLat([MAP_HUB.longitude, MAP_HUB.latitude]).addTo(map);

          for (const pin of MAP_DESTINATIONS) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = pin.name;
            button.setAttribute("aria-label", pin.name);
            button.dataset.key = pin.key;
            button.style.cssText = "border:0;border-radius:999px;background:#fff;color:#0a2a26;font:700 12px sans-serif;padding:3px 8px;box-shadow:0 2px 8px rgba(6,42,42,.25);cursor:pointer";
            button.addEventListener("click", (event) => {
              event.stopPropagation();
              onSelectRef.current(pin.key);
            });
            pins.push(button);
            new Marker({ element: button, anchor: "bottom" }).setLngLat([pin.longitude, pin.latitude]).addTo(map);
          }
          focusRef.current(activeRef.current);
        });
      })
      .catch(() => onUnavailable?.());

    focusRef.current = (key: string) => {
      if (!map?.getLayer("routes-active")) return;
      map.setFilter("routes-active", ["==", ["get", "key"], key]);
      map.setFilter("routes-glow", ["==", ["get", "key"], key]);
      for (const button of pins) {
        const on = button.dataset.key === key;
        button.style.background = on ? "#0b7d73" : "#ffffff";
        button.style.color = on ? "#ffffff" : "#0a2a26";
      }
      const bounds = focusBounds(key);
      if (!bounds) return;
      map.fitBounds(
        [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        { padding: { top: 96, bottom: 430, left: 36, right: 36 }, maxZoom: 4.2, duration: 800 },
      );
    };

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      map?.remove();
      map = null;
    };
    // The map is created once. Selection updates go through activeRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    focusRef.current(active);
  }, [active]);

  return <View nativeID="elite-map-host" style={{ flex: 1 }} />;
}
