import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { previewMode } from "../lib/config";
import { apiRequest, ApiError } from "../lib/api";
import type { Cookie } from "../lib/cookies";
import type { AccountBooking, AccountProfile, AccountState } from "../lib/types";
import { deleteBiometricSecret, readBiometricSecret, readJson, removeJson, writeBiometricSecret, writeJson } from "../storage";

const COOKIES = "elite.cookies";
const FACE_ID = "elite.face.id";
const FACE_SECRET = "elite.face.secret";
const SAVED = "elite.saved";

type SessionContext = {
  status: "loading" | "guest" | "user";
  profile: AccountProfile | null;
  bookings: AccountBooking[];
  saved: string[];
  biometry: string | null;
  faceIdOn: boolean;
  error: string | null;
  refresh: () => void;
  requestCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string, name?: string) => Promise<void>;
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

function isAccount(value: unknown): value is AccountState {
  return !!value && typeof value === "object" && "user" in value && "bookings" in value;
}

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

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionContext["status"]>("loading");
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [bookings, setBookings] = useState<AccountBooking[]>([]);
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [biometry, setBiometry] = useState<string | null>(null);
  const [faceIdOn, setFaceIdOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const apply = useCallback((state: AccountState, nextCookies?: Cookie[]) => {
    if (nextCookies) setCookies(nextCookies);
    if (!state.user) {
      setProfile(null);
      setBookings([]);
      setStatus("guest");
      return;
    }
    setProfile(state.user);
    setBookings(state.bookings);
    setSaved(state.user.saved ?? []);
    setStatus("user");
    void AsyncStorage.setItem(SAVED, JSON.stringify(state.user.saved ?? []));
  }, []);

  useEffect(() => {
    let cancel = false;
    async function boot() {
      const [storedCookies, face, savedRaw, name] = await Promise.all([readJson<Cookie[]>(COOKIES), readJson<string>(FACE_ID), AsyncStorage.getItem(SAVED), biometryName()]);
      if (cancel) return;
      setBiometry(name);
      setFaceIdOn(!!face);
      if (savedRaw) {
        try {
          const list = JSON.parse(savedRaw) as unknown;
          if (Array.isArray(list)) setSaved(list.filter((item) => typeof item === "string"));
        } catch {
          /* ignore */
        }
      }
      if (previewMode || !storedCookies?.length) {
        setStatus("guest");
        return;
      }
      setCookies(storedCookies);
      try {
        const res = await apiRequest({ path: "/api/account", cookies: storedCookies });
        if (cancel) return;
        await writeJson(COOKIES, res.cookies);
        if (!isAccount(res.body)) throw new Error("Бүртгэл уншигдсангүй.");
        apply(res.body, res.cookies);
      } catch (e) {
        if (cancel) return;
        if (e instanceof ApiError && e.status === 401) {
          await removeJson(COOKIES);
          setCookies([]);
          setStatus("guest");
          return;
        }
        setStatus("guest");
        setError("Сүлжээгүй тул бүртгэл шинэчлэгдсэнгүй.");
      }
    }
    void boot();
    return () => {
      cancel = true;
    };
  }, [apply, tick]);

  const persistCookies = useCallback(async (next: Cookie[]) => {
    setCookies(next);
    await writeJson(COOKIES, next);
  }, []);

  const requestCode = useCallback(async (email: string) => {
    if (previewMode) throw new Error("Урьдчилсан харагдац тул имэйл илгээгдэхгүй.");
    await apiRequest({ path: "/api/account/code", json: { email } });
  }, []);

  const verifyCode = useCallback(
    async (email: string, code: string, name?: string) => {
      if (previewMode) throw new Error("Урьдчилсан харагдац тул нэвтрэхгүй.");
      const savedNow = JSON.parse((await AsyncStorage.getItem(SAVED)) ?? "[]") as unknown;
      const savedList = Array.isArray(savedNow) ? savedNow.filter((item) => typeof item === "string") : [];
      const res = await apiRequest({ path: "/api/account/verify", json: { email, code, name }, cookies });
      if (!isAccount(res.body) || !res.body.user) throw new Error("Нэвтэрч чадсангүй.");
      await persistCookies(res.cookies);
      apply(res.body, res.cookies);
      try {
        const patched = await apiRequest({ path: "/api/account", method: "PATCH", json: { saved: savedList }, cookies: res.cookies });
        await persistCookies(patched.cookies);
        if (isAccount(patched.body)) apply(patched.body, patched.cookies);
      } catch {
        /* session stands; saved tours sync again from the profile screen */
      }
    },
    [apply, cookies, persistCookies],
  );

  const logout = useCallback(async () => {
    try {
      if (!previewMode) await apiRequest({ path: "/api/account/logout", method: "POST", cookies });
    } catch {
      /* local session still ends */
    }
    await removeJson(COOKIES);
    setCookies([]);
    setProfile(null);
    setBookings([]);
    setStatus("guest");
  }, [cookies]);

  const updateProfile = useCallback(
    async (patch: { name?: string; phone?: string }) => {
      const res = await apiRequest({ path: "/api/account", method: "PATCH", json: patch, cookies });
      await persistCookies(res.cookies);
      if (!isAccount(res.body)) throw new Error("Профайл шинэчлэгдсэнгүй.");
      apply(res.body, res.cookies);
    },
    [apply, cookies, persistCookies],
  );

  const deleteAccount = useCallback(async () => {
    await apiRequest({ path: "/api/account", method: "DELETE", cookies });
    await removeJson(COOKIES);
    setCookies([]);
    setProfile(null);
    setBookings([]);
    setStatus("guest");
  }, [cookies]);

  const toggleSaved = useCallback(
    async (tourId: string) => {
      const next = saved.includes(tourId) ? saved.filter((id) => id !== tourId) : [...saved, tourId];
      setSaved(next);
      await AsyncStorage.setItem(SAVED, JSON.stringify(next));
      if (status !== "user") return;
      try {
        const res = await apiRequest({ path: "/api/account", method: "PATCH", json: { saved: next }, cookies });
        await persistCookies(res.cookies);
        if (isAccount(res.body)) apply(res.body, res.cookies);
      } catch {
        /* local save remains; sync retries on the next successful sign-in */
      }
    },
    [apply, cookies, persistCookies, saved, status],
  );

  const enableFaceId = useCallback(async () => {
    if (previewMode) throw new Error("Урьдчилсан харагдац тул Face ID асахгүй.");
    if (status !== "user") throw new Error("Эхлээд нэвтэрнэ үү.");
    const auth = await LocalAuthentication.authenticateAsync({ promptMessage: "Face ID-аар нэвтрэхийг идэвхжүүлэх", cancelLabel: "Болих" });
    if (!auth.success) throw new Error("Face ID баталгаажсангүй.");
    const res = await apiRequest({ path: "/api/account/device", json: { purpose: "traveller", label: "Утас" }, cookies });
    await persistCookies(res.cookies);
    const body = res.body as { id?: unknown; secret?: unknown };
    if (typeof body.id !== "string" || typeof body.secret !== "string") throw new Error("Face ID-г идэвхжүүлж чадсангүй.");
    await writeBiometricSecret(FACE_SECRET, body.secret, "Elite Travel");
    await writeJson(FACE_ID, body.id);
    setFaceIdOn(true);
  }, [cookies, persistCookies, status]);

  const disableFaceId = useCallback(async () => {
    const id = await readJson<string>(FACE_ID);
    await deleteBiometricSecret(FACE_SECRET);
    await removeJson(FACE_ID);
    setFaceIdOn(false);
    if (id && !previewMode) {
      await apiRequest({ path: "/api/account/device", method: "DELETE", json: { id, purpose: "traveller" }, cookies }).catch(() => {});
    }
  }, [cookies]);

  const faceIdSignIn = useCallback(async () => {
    if (previewMode) throw new Error("Урьдчилсан харагдац тул Face ID-аар нэвтрэхгүй.");
    const id = await readJson<string>(FACE_ID);
    if (!id) throw new Error("Face ID асаагаагүй байна.");
    const secret = await readBiometricSecret(FACE_SECRET, "Elite Travel-д нэвтрэх");
    if (!secret) throw new Error("Face ID түлхүүр олдсонгүй.");
    try {
      const res = await apiRequest({ path: "/api/account/device/login", json: { id, secret, purpose: "traveller" }, cookies });
      const body = res.body as { secret?: unknown; user?: AccountProfile; bookings?: AccountBooking[] };
      if (typeof body.secret === "string") await writeBiometricSecret(FACE_SECRET, body.secret, "Elite Travel");
      await persistCookies(res.cookies);
      if (!body.user) throw new Error("Нэвтэрч чадсангүй.");
      apply({ user: body.user, bookings: body.bookings ?? [] }, res.cookies);
    } catch (e) {
      if (e instanceof ApiError && /хугацаа дууссан|эрх олгогдоогүй/.test(e.message)) {
        await deleteBiometricSecret(FACE_SECRET);
        await removeJson(FACE_ID);
        setFaceIdOn(false);
      }
      throw e;
    }
  }, [apply, cookies, persistCookies]);

  const claimTokens = useCallback(
    async (tokens: string[]) => {
      if (status !== "user" || !tokens.length || previewMode) return;
      const res = await apiRequest({ path: "/api/account", method: "PATCH", json: { tripTokens: tokens, saved }, cookies });
      await persistCookies(res.cookies);
      if (isAccount(res.body)) apply(res.body, res.cookies);
    },
    [apply, cookies, persistCookies, saved, status],
  );

  const value = useMemo<SessionContext>(
    () => ({
      status,
      profile,
      bookings,
      saved,
      biometry,
      faceIdOn,
      error,
      refresh: () => setTick((n) => n + 1),
      requestCode,
      verifyCode,
      logout,
      updateProfile,
      deleteAccount,
      toggleSaved,
      enableFaceId,
      disableFaceId,
      faceIdSignIn,
      claimTokens,
    }),
    [status, profile, bookings, saved, biometry, faceIdOn, error, requestCode, verifyCode, logout, updateProfile, deleteAccount, toggleSaved, enableFaceId, disableFaceId, faceIdSignIn, claimTokens],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useSession");
  return value;
}
