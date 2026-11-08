import { AppleMaps, GoogleMaps } from "expo-maps";
import { Platform } from "react-native";
import type { MapPin } from "../lib/map-pins";

const camera = { coordinates: { latitude: 28, longitude: 98 }, zoom: 2 };

/** Apple Maps on iOS, Google Maps on Android. Web uses NativeMap.web.tsx. No user location. */
export function NativeMap({ pins, onSelect }: { pins: MapPin[]; onSelect: (key: string) => void }) {
  const markers = pins.map((pin) => ({
    id: pin.key,
    coordinates: { latitude: pin.latitude, longitude: pin.longitude },
    title: pin.name,
    tintColor: "#0b7d73",
  }));
  if (Platform.OS === "ios") {
    return (
      <AppleMaps.View
        style={{ flex: 1 }}
        cameraPosition={camera}
        markers={markers}
        uiSettings={{ myLocationButtonEnabled: false, compassEnabled: false }}
        onMarkerClick={(event) => {
          if (event.id) onSelect(event.id);
        }}
      />
    );
  }
  return (
    <GoogleMaps.View
      style={{ flex: 1 }}
      cameraPosition={camera}
      markers={markers}
      uiSettings={{ myLocationButtonEnabled: false, compassEnabled: false }}
      onMarkerClick={(event) => {
        if (event.id) onSelect(event.id);
      }}
    />
  );
}
