import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { apiRequest } from "../lib/api";
import { createAuthSession, type AuthMode, type SessionSnapshot } from "../lib/auth";
import { previewMode } from "../lib/config";
import type { Cookie } from "../lib/cookies";
import type { AccountState } from "../lib/types";
import { deleteBiometricSecret, readBiometricSecret, readJson, writeBiometricSecret, writeJson } from "../storage";

const COOKIES = "elite.cookies";
const FACE_ID = "elite.face.id";
const FACE_SECRET = "elite.face.secret";
const SAVED = "elite.saved";
const CACHE = "elite.account-cache";

type SessionContext = Omit<SessionSnapshot, "status" | "notice"> & {
  status: SessionSnapshot["status"] | "loading";
  biometry: string | null;
  faceIdOn: boolean;
  error: string | null;
  refresh: () => void;
  requestCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string, mode: AuthMode, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: { name?: string; phone?: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
  toggleSaved: (tourId: string) => Promise<void>;
  enableFaceId: () => Promise<void>;
  disableFaceId: () => Promise<void>;
  faceIdSignIn: () => Promise<void>;
  claimTokens: (tokens: string[]) => Promise<void>;
};

const Ctx = createContext<SessionContext | null>(null);

async function biometryName() {
  try {
    const hardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hardware || !enrolled) return null;
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return "Face ID";
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return "Touch ID";
    return "Биометр";
  } catch {
    return null;
  }
}

const INITIAL: SessionSnapshot = { status: "guest", profile: null, bookings: [], cookies: [], saved: [], faceId: null, notice: null };

export function SessionProvider({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<SessionSnapshot>(INITIAL);
  const [booting, setBooting] = useState(true);
  const [biometry, setBiometry] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const auth = useRef<ReturnType<typeof createAuthSession> | null>(null);

  if (!auth.current) {
    auth.current = createAuthSession({
      preview: previewMode,
      request: (options) => apiRequest(options),
      load: async () => {
        const [cookies, savedRaw, faceId, cache] = await Promise.all([readJson<Cookie[]>(COOKIES), AsyncStorage.getItem(SAVED), readJson<string>(FACE_ID), readJson<AccountState>(CACHE)]);
        let saved: string[] = [];
        if (savedRaw) {
          try {
            const parsed = JSON.parse(savedRaw) as unknown;
            if (Array.isArray(parsed)) saved = parsed.filter((item) => typeof item === "string");
          } catch {
            saved = [];
          }
        }
        return { cookies: cookies ?? [], saved, faceId, cache };
      },
      save: async (data) => {
        await writeJson(COOKIES, data.cookies);
        await writeJson(FACE_ID, data.faceId);
        await writeJson(CACHE, data.cache);
        await AsyncStorage.setItem(SAVED, JSON.stringify(data.saved));
      },
      biometric: {
        confirm: async (prompt) => {
          const result = await LocalAuthentication.authenticateAsync({ promptMessage: prompt, cancelLabel: "Болих" });
          if (!result.success) throw new Error("Face ID баталгаажсангүй.");
        },
        read: (prompt) => readBiometricSecret(FACE_SECRET, prompt),
        write: (secret, prompt) => writeBiometricSecret(FACE_SECRET, secret, prompt),
        clear: () => deleteBiometricSecret(FACE_SECRET),
      },
    });
  }

  useEffect(() => {
    let cancel = false;
    void Promise.all([auth.current!.restore(), biometryName()]).then(([next, name]) => {
      if (cancel) return;
      setSnap(next);
      setBiometry(name);
      setBooting(false);
    });
    return () => {
      cancel = true;
    };
  }, [tick]);

  const run = useCallback(async (action: () => Promise<SessionSnapshot>) => {
    try {
      const next = await action();
      setSnap(next);
      return next;
    } catch (error) {
      setSnap(auth.current?.current() ?? INITIAL);
      throw error;
    }
  }, []);

  const value = useMemo<SessionContext>(() => {
    const session = auth.current!;
    return {
      ...snap,
      status: booting ? "loading" : snap.status,
      biometry,
      faceIdOn: !!snap.faceId,
      error: snap.notice,
      refresh: () => setTick((n) => n + 1),
      requestCode: async (email) => {
        await session.requestCode(email);
      },
      verifyCode: async (email, code, mode, name) => {
        await run(() => session.verifyCode({ email, code, mode, name }));
      },
      logout: async () => {
        await run(() => session.logout());
      },
      updateProfile: async (patch) => {
        await run(() => session.updateProfile(patch));
      },
      deleteAccount: async () => {
        await run(() => session.deleteAccount());
      },
      toggleSaved: async (tourId) => {
        await run(() => session.toggleSaved(tourId));
      },
      enableFaceId: async () => {
        await run(() => session.enableFaceId());
      },
      disableFaceId: async () => {
        await run(() => session.disableFaceId());
      },
      faceIdSignIn: async () => {
        await run(() => session.faceIdSignIn());
      },
      claimTokens: async (tokens) => {
        await run(() => session.claimTokens(tokens));
      },
    };
  }, [snap, booting, biometry, run]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useSession");
  return value;
}
