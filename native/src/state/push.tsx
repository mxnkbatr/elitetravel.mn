import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AppState, Linking, Platform } from "react-native";
import { apiRequest } from "../lib/api";
import { previewMode } from "../lib/config";
import { PUSH_PATH, choiceFromStorage, pushRegistrationBody, shouldAskPermission, shouldRegisterAfterLogin, tripIdFromPushUrl, type PushChoice, type PushPermission } from "../lib/push";
import { loadPushClient, type PushClient } from "../lib/push-device";
import { useDeviceBookings } from "./device-bookings";
import { useSession } from "./session";

const OPT_IN = "elite.push.optin";

type PushContextValue = {
  permission: PushPermission;
  enabled: boolean;
  busy: boolean;
  error: string | null;
  enable: () => Promise<void>;
  disable: () => Promise<void>;
  offerAfterBooking: (tokens: string[]) => Promise<void>;
};

const Ctx = createContext<PushContextValue | null>(null);

function message(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function PushProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const device = useDeviceBookings();
  const [permission, setPermission] = useState<PushPermission>("unavailable");
  const [optedIn, setOptedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const permissionRef = useRef(permission);
  const choiceRef = useRef<PushChoice>("unset");
  const clientRef = useRef<PushClient | null>(null);
  const sessionRef = useRef(session);
  const deviceRef = useRef(device);
  const lastBody = useRef("");
  const lastToken = useRef<string | null>(null);
  const chain = useRef(Promise.resolve());
  sessionRef.current = session;
  deviceRef.current = device;
  permissionRef.current = permission;

  const tripKey = useMemo(
    () => [...device.bookings.map((item) => item.token ?? ""), ...session.bookings.map((item) => item.token ?? "")].join("\n"),
    [device.bookings, session.bookings],
  );

  const sendRegistration = useCallback((extra: string[], interactive: boolean) => {
    const run = async () => {
      const client = clientRef.current;
      if (!client) return;
      if (previewMode) {
        if (interactive) setError("Урьдчилсан харагдац тул мэдэгдэл бүртгэгдэхгүй.");
        return;
      }
      if (choiceRef.current !== "on" || permissionRef.current !== "granted") return;
      const token = await client.getToken();
      const body = pushRegistrationBody({
        token,
        platform: Platform.OS,
        tripTokens: [...deviceRef.current.bookings.map((item) => item.token), ...sessionRef.current.bookings.map((item) => item.token), ...extra],
      });
      if (!body) {
        if (interactive) setError("Firebase токен ирсэнгүй.");
        return;
      }
      const key = JSON.stringify(body);
      if (key === lastBody.current) return;
      await apiRequest({ path: PUSH_PATH, method: "POST", json: body, cookies: sessionRef.current.cookies });
      lastBody.current = key;
      lastToken.current = token;
      if (interactive) setError(null);
    };
    const next = chain.current.then(run, run);
    chain.current = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }, []);

  useEffect(() => {
    let unlisten = () => {};
    let alive = true;
    void (async () => {
      const stored = await AsyncStorage.getItem(OPT_IN);
      if (!alive) return;
      choiceRef.current = choiceFromStorage(stored);
      setOptedIn(choiceRef.current === "on");
      const client = await loadPushClient();
      if (!alive) return;
      clientRef.current = client;
      if (!client) {
        setPermission("unavailable");
        setReady(true);
        return;
      }
      const next = await client.permission();
      if (!alive) return;
      permissionRef.current = next;
      setPermission(next);
      unlisten = client.listen({
        onToken: () => {
          void sendRegistration([], false).catch(() => {});
        },
        onOpen: (url) => {
          const id = tripIdFromPushUrl(url);
          if (id) router.push({ pathname: "/trip/[id]", params: { id } });
        },
      });
      setReady(true);
    })().catch(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
      unlisten();
    };
  }, [sendRegistration]);

  useEffect(() => {
    if (!ready || session.status === "loading") return;
    const adopt = session.status === "user" && shouldRegisterAfterLogin({ choice: choiceRef.current, permission: permissionRef.current });
    const firstAdopt = adopt && choiceRef.current !== "on";
    if (firstAdopt) {
      choiceRef.current = "on";
      void AsyncStorage.setItem(OPT_IN, "1");
      setOptedIn(true);
    }
    if (choiceRef.current !== "on" || permissionRef.current !== "granted") return;
    void sendRegistration([], firstAdopt).catch(() => {});
  }, [ready, session.status, tripKey, permission, optedIn, sendRegistration]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active" || !clientRef.current) return;
      void clientRef.current.permission().then((next) => {
        permissionRef.current = next;
        setPermission(next);
      });
    });
    return () => sub.remove();
  }, []);

  const enable = useCallback(
    async (moment: "profile" | "booking", extra: string[]) => {
      const client = clientRef.current ?? (await loadPushClient());
      clientRef.current = client;
      if (!client) {
        setPermission("unavailable");
        setError("Энэ төхөөрөмж дээр Firebase мэдэгдэл алга.");
        return;
      }
      setBusy(true);
      setError(null);
      try {
        let next = await client.permission();
        if (shouldAskPermission(moment, next)) next = await client.requestPermission();
        permissionRef.current = next;
        setPermission(next);
        if (next !== "granted") {
          if (next === "denied") setError("Мэдэгдэл зөвшөөрөөгүй байна.");
          return;
        }
        await AsyncStorage.setItem(OPT_IN, "1");
        choiceRef.current = "on";
        setOptedIn(true);
        await sendRegistration(extra, true);
      } catch (caught) {
        setError(message(caught, "Мэдэгдэл бүртгэгдсэнгүй."));
      } finally {
        setBusy(false);
      }
    },
    [sendRegistration],
  );

  const value = useMemo<PushContextValue>(
    () => ({
      permission,
      enabled: optedIn && permission === "granted",
      busy,
      error,
      enable: async () => {
        if (permissionRef.current === "denied") {
          await Linking.openSettings();
          return;
        }
        await enable("profile", []);
      },
      disable: async () => {
        setBusy(true);
        setError(null);
        try {
          await AsyncStorage.setItem(OPT_IN, "0");
          choiceRef.current = "off";
          setOptedIn(false);
          lastBody.current = "";
          const client = clientRef.current;
          let token = lastToken.current;
          if (!token && client) token = await client.getToken().catch(() => "");
          await client?.deleteToken().catch(() => {});
          lastToken.current = null;
          if (token && !previewMode) await apiRequest({ path: PUSH_PATH, method: "DELETE", json: { token }, cookies: sessionRef.current.cookies });
        } catch (caught) {
          setError(message(caught, "Мэдэгдлийг унтрааж чадсангүй."));
        } finally {
          setBusy(false);
        }
      },
      offerAfterBooking: async (tokens) => {
        if (previewMode || (Platform.OS !== "ios" && Platform.OS !== "android")) return;
        if (permissionRef.current === "denied" || choiceRef.current === "off") return;
        if (permissionRef.current === "granted" && choiceRef.current === "on") {
          await sendRegistration(tokens, false).catch(() => {});
          return;
        }
        await enable("booking", tokens);
      },
    }),
    [permission, optedIn, busy, error, enable, sendRegistration],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePush() {
  const value = useContext(Ctx);
  if (!value) throw new Error("usePush");
  return value;
}
