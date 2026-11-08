import { Camera, GeoJSONSource, Layer, Map, Marker, type CameraRef } from "@maplibre/maplibre-react-native";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { MAP_DESTINATIONS, MAP_HUB, MAP_STYLE_URL, OPENING_BOUNDS, ROUTE_COLLECTION, focusBounds } from "../lib/map-pins";

const padding = { top: 96, right: 36, bottom: 430, left: 36 };

/**
 * Device map: MapLibre Native with the website's keyless OpenFreeMap style.
 * expo-maps is not used — it requires iOS 18 and a Google key, and it cannot draw these flight arcs.
 * This module is not exercised by the web preview (see NativeMap.web.tsx).
 */
export function NativeMap({ active, onSelect, onUnavailable }: { active: string; onSelect: (key: string) => void; onUnavailable?: () => void }) {
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
        <Layer id="routes-base" type="line" layout={{ "line-cap": "round" }} paint={{ "line-color": "#0b7d73", "line-width": 1.4, "line-opacity": 0.35 }} />
        <Layer id="routes-glow" type="line" filter={["==", ["get", "key"], active]} layout={{ "line-cap": "round" }} paint={{ "line-color": "#e8b86d", "line-width": 8, "line-opacity": 0.35 }} />
        <Layer id="routes-active" type="line" filter={["==", ["get", "key"], active]} layout={{ "line-cap": "round" }} paint={{ "line-color": "#0b7d73", "line-width": 2.6 }} />
      </GeoJSONSource>
      <Marker id={MAP_HUB.key} lngLat={[MAP_HUB.longitude, MAP_HUB.latitude]} anchor="center">
        <View accessibilityLabel={MAP_HUB.name} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#0a2a26", borderWidth: 2, borderColor: "#ffffff" }} />
      </Marker>
      {MAP_DESTINATIONS.map((pin) => {
        const selected = pin.key === active;
        return (
          <Marker key={pin.key} id={pin.key} lngLat={[pin.longitude, pin.latitude]} anchor="bottom" onPress={() => onSelect(pin.key)}>
            <View accessibilityLabel={pin.name} style={{ backgroundColor: selected ? "#0b7d73" : "#ffffff", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 2, borderColor: selected ? "#e8b86d" : "#0b7d73" }}>
              <Text style={{ color: selected ? "#ffffff" : "#0a2a26", fontSize: 12, fontWeight: "700" }}>{pin.name}</Text>
            </View>
          </Marker>
        );
      })}
    </Map>
  );
}
