import { ApiError } from "./api";
import { type Cookie } from "./cookies";
import type { AccountBooking, AccountProfile, AccountState } from "./types";

/** Same address check as POST /api/account/code. */
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type AuthMode = "login" | "signup";

export class AuthFlowError extends Error {
  code: "invalid_email" | "invalid_code" | "invalid_name" | "preview" | "no_session_cookie" | "bad_response" | "offline";
  constructor(code: AuthFlowError["code"], message: string) {
    super(message);
    this.name = "AuthFlowError";
    this.code = code;
  }
}

export function prepareEmail(email: string) {
  const value = email.trim().toLowerCase();
  if (!EMAIL.test(value) || value.length > 254) throw new AuthFlowError("invalid_email", "Имэйл хаягаа шалгана уу.");
  return value;
}

/** The server keeps digits only and accepts 6–10. The email itself contains 6. */
export function prepareCode(code: string) {
  const digits = code.replace(/\D/g, "");
  if (!/^\d{6,10}$/.test(digits)) throw new AuthFlowError("invalid_code", "Кодоо шалгана уу.");
  return digits;
}

export function prepareSignupName(name: string) {
  const value = name.trim();
  if (value.length < 2) throw new AuthFlowError("invalid_name", "Нэрээ оруулна уу.");
  if (value.length > 80) throw new AuthFlowError("invalid_name", "Нэр хэт урт байна.");
  return value;
}

export function hasSessionCookie(cookies: Cookie[]) {
  return cookies.some((cookie) => cookie.name.startsWith("sb-") && cookie.value.length > 0);
}

function isProfile(value: unknown): value is AccountProfile {
  return !!value && typeof value === "object" && typeof (value as AccountProfile).email === "string" && typeof (value as AccountProfile).name === "string" && Array.isArray((value as AccountProfile).saved);
}

export function isAccountState(value: unknown): value is AccountState {
  if (!value || typeof value !== "object" || !("user" in value) || !("bookings" in value)) return false;
  const state = value as AccountState;
  return (state.user === null || isProfile(state.user)) && Array.isArray(state.bookings);
}

export type SessionStatus = "guest" | "user" | "offline";

export type SessionSnapshot = {
  status: SessionStatus;
  profile: AccountProfile | null;
  bookings: AccountBooking[];
  cookies: Cookie[];
  saved: string[];
  faceId: string | null;
  notice: string | null;
};

export type PersistedAuth = {
  cookies: Cookie[];
  saved: string[];
  faceId: string | null;
  cache: AccountState | null;
};

type RequestFn = (options: { path: string; method?: string; json?: unknown; cookies?: Cookie[] }) => Promise<{ status: number; body: unknown; cookies: Cookie[] }>;

type Biometric = {
  confirm(prompt: string): Promise<void>;
  read(prompt: string): Promise<string | null>;
  write(secret: string, prompt: string): Promise<void>;
  clear(): Promise<void>;
};

const EMPTY: SessionSnapshot = { status: "guest", profile: null, bookings: [], cookies: [], saved: [], faceId: null, notice: null };

function signedIn(state: AccountState, cookies: Cookie[], faceId: string | null, notice: string | null): SessionSnapshot {
  return {
    status: "user",
    profile: state.user,
    bookings: state.bookings,
    cookies,
    saved: state.user?.saved ?? [],
    faceId,
    notice,
  };
}

export function createAuthSession(options: { request: RequestFn; load: () => Promise<PersistedAuth>; save: (data: PersistedAuth) => Promise<void>; biometric?: Biometric; preview?: boolean }) {
  let snap: SessionSnapshot = { ...EMPTY };

  async function commit(next: SessionSnapshot) {
    snap = next;
    await options.save({
      cookies: next.cookies,
      saved: next.saved,
      faceId: next.faceId,
      cache: next.profile ? { user: next.profile, bookings: next.bookings } : null,
    });
    return snap;
  }

  function guest(notice: string | null, extra?: Partial<SessionSnapshot>): SessionSnapshot {
    return { ...EMPTY, saved: snap.saved, faceId: snap.faceId, notice, ...extra, status: "guest", profile: null, bookings: [] };
  }

  async function restore() {
    const stored = await options.load();
    snap = { ...EMPTY, cookies: stored.cookies, saved: stored.saved, faceId: stored.faceId, profile: stored.cache?.user ?? null, bookings: stored.cache?.bookings ?? [] };
    if (options.preview || stored.cookies.length === 0 || !hasSessionCookie(stored.cookies)) {
      return commit(guest(null, { cookies: [], profile: null, bookings: [] }));
    }
    try {
      const res = await options.request({ path: "/api/account", method: "GET", cookies: stored.cookies });
      if (!isAccountState(res.body)) throw new AuthFlowError("bad_response", "Бүртгэл уншигдсангүй.");
      if (!res.body.user) return commit(guest("Сесс дууссан байна. Дахин нэвтэрнэ үү.", { cookies: [] }));
      if (!hasSessionCookie(res.cookies)) throw new AuthFlowError("no_session_cookie", "Сессийн cookie ирсэнгүй.");
      return commit(signedIn(res.body, res.cookies, stored.faceId, null));
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        return commit(guest(error.message, { cookies: [] }));
      }
      const notice = error instanceof ApiError && error.status === 0 ? "Сүлжээгүй тул бүртгэл шинэчлэгдсэнгүй." : error instanceof Error ? error.message : "Бүртгэл шинэчлэгдсэнгүй.";
      if (stored.cache?.user) return commit({ ...snap, status: "offline", cookies: stored.cookies, notice });
      return commit({ ...snap, status: "guest", profile: null, bookings: [], cookies: stored.cookies, notice });
    }
  }

  async function requestCode(email: string) {
    if (options.preview) throw new AuthFlowError("preview", "Урьдчилсан харагдац тул имэйл илгээгдэхгүй.");
    const value = prepareEmail(email);
    await options.request({ path: "/api/account/code", method: "POST", json: { email: value }, cookies: [] });
    return value;
  }

  async function verifyCode(input: { email: string; code: string; mode: AuthMode; name?: string }) {
    if (options.preview) throw new AuthFlowError("preview", "Урьдчилсан харагдац тул нэвтрэхгүй.");
    const email = prepareEmail(input.email);
    const code = prepareCode(input.code);
    const name = input.mode === "signup" ? prepareSignupName(input.name ?? "") : undefined;
    const res = await options.request({
      path: "/api/account/verify",
      method: "POST",
      json: name ? { email, code, name } : { email, code },
      cookies: [],
    });
    if (!isAccountState(res.body) || !res.body.user) throw new AuthFlowError("bad_response", "Нэвтэрч чадсангүй.");
    if (!hasSessionCookie(res.cookies)) {
      throw new AuthFlowError("no_session_cookie", "Нэвтрэлт баталгаажсан ч сессийн cookie ирсэнгүй. Апп сесс хадгалж чадахгүй.");
    }
    let state = res.body;
    let cookies = res.cookies;
    try {
      const patched = await options.request({ path: "/api/account", method: "PATCH", json: { saved: snap.saved }, cookies });
      if (isAccountState(patched.body) && patched.body.user && hasSessionCookie(patched.cookies)) {
        state = patched.body;
        cookies = patched.cookies;
      }
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) throw error;
    }
    return commit(signedIn(state, cookies, snap.faceId, null));
  }

  async function logout() {
    let notice: string | null = null;
    if (!options.preview && snap.cookies.length) {
      try {
        await options.request({ path: "/api/account/logout", method: "POST", cookies: snap.cookies });
      } catch {
        notice = "Энэ төхөөрөмж дээрх сессийг устгалаа. Сервертэй холбогдож чадсангүй.";
      }
    }
    return commit(guest(notice, { cookies: [] }));
  }

  async function updateProfile(patch: { name?: string; phone?: string }) {
    if (snap.status === "offline") throw new AuthFlowError("offline", "Сүлжээгүй тул профайл хадгалахгүй.");
    if (snap.status !== "user") throw new AuthFlowError("bad_response", "Нэвтэрнэ үү.");
    try {
      const res = await options.request({ path: "/api/account", method: "PATCH", json: patch, cookies: snap.cookies });
      if (!isAccountState(res.body) || !res.body.user) throw new AuthFlowError("bad_response", "Профайл шинэчлэгдсэнгүй.");
      return commit(signedIn(res.body, hasSessionCookie(res.cookies) ? res.cookies : snap.cookies, snap.faceId, null));
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        await commit(guest(error.message, { cookies: [] }));
      }
      throw error;
    }
  }

  async function deleteAccount() {
    if (snap.status === "offline") throw new AuthFlowError("offline", "Сүлжээгүй тул бүртгэл устгахгүй.");
    if (snap.status !== "user") throw new AuthFlowError("bad_response", "Нэвтэрнэ үү.");
    try {
      await options.request({ path: "/api/account", method: "DELETE", cookies: snap.cookies });
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) await commit(guest(error.message, { cookies: [] }));
      throw error;
    }
    await options.biometric?.clear().catch(() => {});
    return commit({ ...guest(null), saved: [], faceId: null, cookies: [] });
  }

  async function toggleSaved(tourId: string) {
    const saved = snap.saved.includes(tourId) ? snap.saved.filter((id) => id !== tourId) : [...snap.saved, tourId];
    snap = { ...snap, saved };
    if (snap.status !== "user") return commit(snap);
    try {
      const res = await options.request({ path: "/api/account", method: "PATCH", json: { saved }, cookies: snap.cookies });
      if (isAccountState(res.body) && res.body.user) return commit(signedIn(res.body, hasSessionCookie(res.cookies) ? res.cookies : snap.cookies, snap.faceId, null));
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return commit(guest(error.message, { cookies: [], saved }));
    }
    return commit(snap);
  }

  async function claimTokens(tokens: string[]) {
    if (snap.status !== "user" || !tokens.length || options.preview) return snap;
    const res = await options.request({ path: "/api/account", method: "PATCH", json: { tripTokens: tokens, saved: snap.saved }, cookies: snap.cookies });
    if (!isAccountState(res.body) || !res.body.user) return snap;
    return commit(signedIn(res.body, hasSessionCookie(res.cookies) ? res.cookies : snap.cookies, snap.faceId, null));
  }

  async function enableFaceId() {
    if (options.preview) throw new AuthFlowError("preview", "Урьдчилсан харагдац тул Face ID асахгүй.");
    if (snap.status !== "user") throw new AuthFlowError("bad_response", "Эхлээд нэвтэрнэ үү.");
    if (!options.biometric) throw new AuthFlowError("bad_response", "Энэ төхөөрөмж дээр Face ID ашиглах боломжгүй.");
    await options.biometric.confirm("Face ID-аар нэвтрэхийг идэвхжүүлэх");
    const res = await options.request({ path: "/api/account/device", method: "POST", json: { purpose: "traveller", label: "Утас" }, cookies: snap.cookies });
    const body = res.body as { id?: unknown; secret?: unknown };
    if (typeof body.id !== "string" || typeof body.secret !== "string") throw new AuthFlowError("bad_response", "Face ID-г идэвхжүүлж чадсангүй.");
    try {
      await options.biometric.write(body.secret, "Elite Travel");
    } catch (error) {
      await options.request({ path: "/api/account/device", method: "DELETE", json: { id: body.id, purpose: "traveller" }, cookies: res.cookies }).catch(() => {});
      throw error;
    }
    const cookies = hasSessionCookie(res.cookies) ? res.cookies : snap.cookies;
    return commit({ ...snap, cookies, faceId: body.id, notice: null });
  }

  async function disableFaceId() {
    const id = snap.faceId;
    await options.biometric?.clear().catch(() => {});
    if (id && snap.status === "user" && !options.preview) {
      await options.request({ path: "/api/account/device", method: "DELETE", json: { id, purpose: "traveller" }, cookies: snap.cookies }).catch(() => {});
    }
    return commit({ ...snap, faceId: null });
  }

  async function faceIdSignIn() {
    if (options.preview) throw new AuthFlowError("preview", "Урьдчилсан харагдац тул Face ID-аар нэвтрэхгүй.");
    if (!snap.faceId) throw new AuthFlowError("bad_response", "Face ID асаагаагүй байна.");
    if (!options.biometric) throw new AuthFlowError("bad_response", "Энэ төхөөрөмж дээр Face ID ашиглах боломжгүй.");
    const secret = await options.biometric.read("Elite Travel-д нэвтрэх");
    if (!secret) throw new AuthFlowError("bad_response", "Face ID түлхүүр олдсонгүй.");
    try {
      const res = await options.request({ path: "/api/account/device/login", method: "POST", json: { id: snap.faceId, secret, purpose: "traveller" }, cookies: [] });
      const body = res.body as { secret?: unknown; user?: AccountProfile; bookings?: AccountBooking[] };
      if (!body.user || typeof body.user.email !== "string") throw new AuthFlowError("bad_response", "Нэвтэрч чадсангүй.");
      if (!hasSessionCookie(res.cookies)) throw new AuthFlowError("no_session_cookie", "Нэвтрэлт баталгаажсан ч сессийн cookie ирсэнгүй. Апп сесс хадгалж чадахгүй.");
      if (typeof body.secret === "string") await options.biometric.write(body.secret, "Elite Travel");
      const state: AccountState = { user: { ...body.user, saved: body.user.saved ?? snap.saved }, bookings: body.bookings ?? [] };
      return commit(signedIn(state, res.cookies, snap.faceId, null));
    } catch (error) {
      if (error instanceof ApiError && /хугацаа дууссан|эрх олгогдоогүй/.test(error.message)) {
        await options.biometric.clear().catch(() => {});
        await commit({ ...snap, faceId: null, status: "guest", profile: null, bookings: [], cookies: [] });
      }
      throw error;
    }
  }

  return {
    current: () => snap,
    restore,
    requestCode,
    verifyCode,
    logout,
    updateProfile,
    deleteAccount,
    toggleSaved,
    claimTokens,
    enableFaceId,
    disableFaceId,
    faceIdSignIn,
  };
}
