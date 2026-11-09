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

/** Deep emerald, sand gold, warm ivory. One source for the screens that share the brand. */
export const brand = {
  emerald: "#10241f",
  emeraldMid: "#0d6a5e",
  gold: "#e4bc74",
  ivory: "#f4efe6",
  ivoryCard: "#fffdf8",
  mist: "#b7efe6",
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  pill: 999,
  dock: 34,
} as const;

export const typeScale = {
  hero: 50,
  display: 34,
  title: 40,
  section: 28,
  card: 24,
  body: 15,
  label: 13,
  caption: 12,
  micro: 11,
} as const;

export const shadows = {
  card: {
    shadowColor: "#10241f",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  soft: {
    shadowColor: "#10241f",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  dock: {
    shadowColor: "#06221e",
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;

export const wash = {
  emerald: "rgba(13,106,94,0.12)",
  gold: "rgba(228,188,116,0.24)",
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
  /** Search and field hints. Darker than muted so placeholders stay readable. */
  placeholder: string;
};

const light: Palette = {
  dark: false,
  bg: brand.ivory,
  bgSoft: "#faf6ef",
  text: brand.emerald,
  muted: "#5c6f68",
  accent: brand.emeraldMid,
  gold: brand.gold,
  card: brand.ivoryCard,
  line: "rgba(16,36,31,0.1)",
  danger: "#9c3b3b",
  onAccent: "#ffffff",
  glass: "rgba(255,252,247,0.9)",
  glassBorder: "rgba(255,255,255,0.8)",
  chip: brand.ivoryCard,
  placeholder: "#3c524c",
};

const dark: Palette = {
  dark: true,
  bg: "#071614",
  bgSoft: "#0c221e",
  text: "#f4efe6",
  muted: "#a3b8b1",
  accent: "#1aa894",
  gold: brand.gold,
  card: "#122824",
  line: "rgba(244,239,230,0.12)",
  danger: "#f0a0a0",
  onAccent: "#041614",
  glass: "rgba(8,28,26,0.78)",
  glassBorder: "rgba(255,255,255,0.16)",
  chip: "#17332e",
  placeholder: "#c5d5cf",
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
  return useMemo(
    () => ({ colors: scheme === "dark" ? dark : light, reduceMotion, fontsReady }),
    [scheme, reduceMotion, fontsReady],
  );
}
