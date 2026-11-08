import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("../components/ui", () => ({
  Field: ({ label, value }: { label: string; value: string }) => createElement("input", { "aria-label": label, defaultValue: value }),
  Press: ({ children, label }: { children: ReactNode; label: string }) => createElement("button", { "aria-label": label }, children),
  Txt: ({ children }: { children: ReactNode }) => createElement("p", null, children),
}));

vi.mock("expo-router", () => ({ useRouter: () => ({ back: () => undefined, push: () => undefined }) }));
vi.mock("react-native-safe-area-context", () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));
vi.mock("../theme", () => ({
  useTheme: () => ({
    colors: { bg: "#fff", text: "#111", muted: "#666", accent: "#0b7d73", onAccent: "#fff", danger: "#900", card: "#fff" },
    fontsReady: false,
  }),
  fonts: {},
}));

const requestCode = vi.fn(async () => {
  throw new Error("should not be asserted");
});

vi.mock("../state/session", () => ({
  useSession: () => ({
    faceIdOn: true,
    biometry: "Face ID",
    requestCode,
    verifyCode: vi.fn(),
    faceIdSignIn: vi.fn(),
  }),
}));

describe("AuthScreen render", () => {
  it("shows login and registration as the same code step, without calling the network", async () => {
    const { AuthScreen } = await import("./AuthScreen");
    const html = renderToStaticMarkup(<AuthScreen />);
    expect(html).toContain("Тавтай морил");
    expect(html).toContain("Нэвтрэх");
    expect(html).toContain("Бүртгүүлэх");
    expect(html).toContain("Face ID-аар нэвтрэх");
    expect(html).toContain("Бүртгэлтэй хаяг мөн энэ кодоор орно.");
    expect(requestCode).not.toHaveBeenCalled();
  });
});
