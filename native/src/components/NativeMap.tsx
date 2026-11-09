import { Camera, GeoJSONSource, Layer, Map, Marker, type CameraRef } from "@maplibre/maplibre-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { MAP_DESTINATIONS, MAP_HUB, MAP_STYLE_URL, OPENING_BOUNDS, ROUTE_COLLECTION, flightArc, focusBounds, sliceArc } from "../lib/map-pins";

const padding = { top: 96, right: 36, bottom: 430, left: 36 };

/**
 * Device map: MapLibre Native with the website's keyless OpenFreeMap style.
 * expo-maps is not used — it requires iOS 18 and a Google key, and it cannot draw these flight arcs.
 * This module is not exercised by the web preview (see NativeMap.web.tsx).
 */
export function NativeMap({ active, motion, onSelect, onUnavailable }: { active: string; motion: boolean; onSelect: (key: string) => void; onUnavailable?: () => void }) {
  const camera = useRef<CameraRef>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const bounds = focusBounds(active);
    if (!bounds) return;
    camera.current?.fitBounds(bounds, { padding, duration: 900, easing: "ease" });
  }, [active, ready]);

  return (
    <Map
      style={{ flex: 1 }}
      mapStyle={MAP_STYLE_URL}
      attribution
      attributionPosition={{ top: 62, right: 8 }}
      compass={false}
      onDidFinishLoadingMap={() => setReady(true)}
      onDidFailLoadingMap={() => onUnavailable?.()}
    >
      <Camera ref={camera} initialViewState={{ bounds: OPENING_BOUNDS, padding }} maxZoom={5} />
      <GeoJSONSource id="routes" data={ROUTE_COLLECTION}>
        <Layer id="routes-base" type="line" layout={{ "line-cap": "round" }} paint={{ "line-color": "#0b7d73", "line-width": 1.2, "line-opacity": 0.28 }} />
      </GeoJSONSource>
      <DrawnArc active={active} motion={motion} />
      <Marker id={MAP_HUB.key} lngLat={[MAP_HUB.longitude, MAP_HUB.latitude]} anchor="center">
        <View accessibilityLabel={MAP_HUB.name} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#0a2a26", borderWidth: 2, borderColor: "#ffffff" }} />
      </Marker>
      {MAP_DESTINATIONS.map((pin, index) => {
        const selected = pin.key === active;
        return (
          <Marker key={pin.key} id={pin.key} lngLat={[pin.longitude, pin.latitude]} anchor="bottom" onPress={() => onSelect(pin.key)}>
            <Animated.View entering={motion ? ZoomIn.delay(index * 70).duration(420) : undefined}>
              <View accessibilityLabel={pin.name} style={{ backgroundColor: selected ? "#0b7d73" : "#ffffff", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 2, borderColor: selected ? "#e8b86d" : "#0b7d73" }}>
                <Text style={{ color: selected ? "#ffffff" : "#0a2a26", fontSize: 12, fontWeight: "700" }}>{pin.name}</Text>
              </View>
            </Animated.View>
          </Marker>
        );
      })}
    </Map>
  );
}

function DrawnArc({ active, motion }: { active: string; motion: boolean }) {
  const [coords, setCoords] = useState<[number, number][]>([]);
  useEffect(() => {
    const pin = MAP_DESTINATIONS.find((item) => item.key === active);
    if (!pin) return;
    const points = flightArc(pin, 64);
    const line = (t: number) => sliceArc(points, t).map((point) => [point.longitude, point.latitude] as [number, number]);
    if (!motion) {
      setCoords(line(1));
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      setCoords(line(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    setCoords(line(0));
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, motion]);
  const data = useMemo<GeoJSON.FeatureCollection>(() => {
    const line = coords.length === 1 ? [coords[0], coords[0]] : coords;
    return { type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: line } }] };
  }, [coords]);
  return (
    <GeoJSONSource id="arc-draw" data={data}>
      <Layer id="arc-glow" type="line" layout={{ "line-cap": "round" }} paint={{ "line-color": "#e8b86d", "line-width": 8, "line-opacity": 0.35 }} />
      <Layer id="arc-draw" type="line" layout={{ "line-cap": "round" }} paint={{ "line-color": "#0b7d73", "line-width": 2.6 }} />
    </GeoJSONSource>
  );
}
