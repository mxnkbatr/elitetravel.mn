import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AccessibilityInfo, useColorScheme } from "react-native";

export const fonts = {
  display: "CormorantGaramond_600SemiBold",
  displayItalic: "CormorantGaramond_600SemiBold_Italic",
  sans: "Manrope_400Regular",
  sansMedium: "Manrope_500Medium",
  sansSemi: "Manrope_600SemiBold",
  sansBold: "Manrope_700Bold",
} as const;

export type Palette = {
  dark: boolean;
  bg: string;
  bgSoft: string;
  text: string;
  muted: string;
  accent: string;
  gold: string;
  card: string;
  line: string;
  danger: string;
  onAccent: string;
  glass: string;
  glassBorder: string;
  chip: string;
};

const light: Palette = {
  dark: false,
  bg: "#e7f2ee",
  bgSoft: "#f7fbf9",
  text: "#0a2a26",
  muted: "#527169",
  accent: "#0b7d73",
  gold: "#e8b86d",
  card: "#ffffff",
  line: "rgba(10,42,38,0.1)",
  danger: "#9c3b3b",
  onAccent: "#ffffff",
  glass: "rgba(247,251,249,0.72)",
  glassBorder: "rgba(255,255,255,0.72)",
  chip: "#ffffff",
};

const dark: Palette = {
  dark: true,
  bg: "#061917",
  bgSoft: "#0b2522",
  text: "#e4f2ee",
  muted: "#8eaea6",
  accent: "#14a396",
  gold: "#e8b86d",
  card: "#0f2c29",
  line: "rgba(228,242,238,0.12)",
  danger: "#f0a0a0",
  onAccent: "#041614",
  glass: "rgba(8,28,26,0.72)",
  glassBorder: "rgba(255,255,255,0.16)",
  chip: "#143632",
};

const FontsReady = createContext(false);

export function FontsProvider({ ready, children }: { ready: boolean; children: ReactNode }) {
  return <FontsReady.Provider value={ready}>{children}</FontsReady.Provider>;
}

function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduce(value);
    }).catch(() => {});
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    return () => {
      active = false;
      sub.remove();
    };
  }, []);
  return reduce;
}

export function useTheme() {
  const scheme = useColorScheme();
  const reduceMotion = useReduceMotion();
  const fontsReady = useContext(FontsReady);
  return useMemo(() => ({ colors: scheme === "dark" ? dark : light, reduceMotion, fontsReady }), [scheme, reduceMotion, fontsReady]);
}
