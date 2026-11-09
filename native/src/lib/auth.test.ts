import { describe, expect, it } from "vitest";
import { ApiError } from "./api";
import { applySetCookies } from "./cookies";
import { AuthFlowError, createAuthSession, prepareCode, prepareEmail, type PersistedAuth } from "./auth";

const SESSION = "sb-test-auth-token=session; Max-Age=3600";

function memory() {
  let data: PersistedAuth = { cookies: [], saved: ["bali"], faceId: null, cache: null };
  return {
    load: async () => structuredClone(data),
    save: async (next: PersistedAuth) => {
      data = structuredClone(next);
    },
    dump: () => data,
  };
}

function user(name: string, bookings: { id: string }[] = []) {
  return {
    user: { email: "traveller@example.com", name, phone: "", saved: ["bali"] },
    bookings: bookings.map((booking) => ({
      id: booking.id,
      tourId: "bali",
      createdAt: "2026-11-01T00:00:00.000Z",
      name: "Болд",
      phone: "99001122",
      adults: 1,
      kidsOwnBed: 0,
      kidsSharedBed: 0,
      singleRooms: 0,
      total: 1000,
      deposit: 0,
      token: "t".repeat(24),
    })),
  };
}

function server(routes: Record<string, (json: unknown) => { status: number; body: unknown; cookies?: string[] } | Promise<{ status: number; body: unknown; cookies?: string[] }>>) {
  const calls: { path: string; method: string; json: unknown }[] = [];
  const request = async (options: { path: string; method?: string; json?: unknown; cookies?: import("./cookies").Cookie[] }) => {
    const method = options.method ?? "GET";
    calls.push({ path: options.path, method, json: options.json });
    const route = routes[`${method} ${options.path}`];
    if (!route) throw new Error(`unhandled ${method} ${options.path}`);
    const result = await route(options.json);
    if (result.status === 0) throw new ApiError(0, "Интернэт холболтоо шалгана уу.");
    if (result.status >= 400) throw new ApiError(result.status, typeof (result.body as { error?: string }).error === "string" ? (result.body as { error: string }).error : "Алдаа");
    return { status: result.status, body: result.body, cookies: applySetCookies(options.cookies ?? [], result.cookies ?? []) };
  };
  return { request, calls };
}

describe("auth input", () => {
  it("normalises email and code the way the server does", () => {
    expect(prepareEmail("  A@B.co ")).toBe("a@b.co");
    expect(prepareCode("12 34-56")).toBe("123456");
    expect(() => prepareEmail("not-an-email")).toThrow(AuthFlowError);
    expect(() => prepareCode("12345")).toThrow(/Кодоо шалгана уу/);
  });
});

describe("mocked account session", () => {
  it("signs up a new traveller and an existing one through the same code route", async () => {
    const store = memory();
    const api = server({
      "POST /api/account/code": () => ({ status: 200, body: { ok: true } }),
      "POST /api/account/verify": (json) => ({ status: 200, body: user(typeof (json as { name?: string }).name === "string" ? (json as { name: string }).name : "Болд", (json as { name?: string }).name ? [] : [{ id: "ET-1" }]), cookies: [SESSION] }),
      "PATCH /api/account": () => ({ status: 200, body: user("Сараа", []), cookies: [SESSION] }),
    });
    const auth = createAuthSession({ request: api.request, load: store.load, save: store.save });
    await auth.requestCode("saraa@example.com");
    await expect(auth.verifyCode({ email: "saraa@example.com", code: "123456", mode: "signup", name: "С" })).rejects.toThrow(/Нэрээ оруулна уу/);
    const created = await auth.verifyCode({ email: "saraa@example.com", code: "123456", mode: "signup", name: "Сараа" });
    expect(created.status).toBe("user");
    expect(created.profile?.name).toBe("Сараа");
    expect(created.bookings).toEqual([]);
    expect(store.dump().cookies.some((cookie) => cookie.name.startsWith("sb-"))).toBe(true);
    expect(api.calls.find((call) => call.path === "/api/account/verify")?.json).toMatchObject({ email: "saraa@example.com", code: "123456", name: "Сараа" });

    const returning = server({
      "POST /api/account/verify": (json) => {
        expect(json).not.toHaveProperty("name");
        return { status: 200, body: user("Болд", [{ id: "ET-9" }]), cookies: [SESSION] };
      },
      "PATCH /api/account": () => ({ status: 200, body: user("Болд", [{ id: "ET-9" }]), cookies: [SESSION] }),
    });
    const again = createAuthSession({ request: returning.request, load: store.load, save: store.save });
    const signed = await again.verifyCode({ email: "traveller@example.com", code: "654321", mode: "login" });
    expect(signed.bookings.map((booking) => booking.id)).toEqual(["ET-9"]);
  });

  it("keeps the traveller signed out on an expired code, a network failure, and a missing session cookie", async () => {
    const store = memory();
    const expired = server({ "POST /api/account/verify": () => ({ status: 400, body: { error: "Код буруу эсвэл хугацаа нь дууссан байна." } }) });
    const auth = createAuthSession({ request: expired.request, load: store.load, save: store.save });
    await expect(auth.verifyCode({ email: "a@b.co", code: "000000", mode: "login" })).rejects.toThrow("Код буруу эсвэл хугацаа нь дууссан байна.");
    expect(auth.current().status).toBe("guest");
    expect(store.dump().cookies).toEqual([]);

    const offline = server({ "POST /api/account/verify": () => ({ status: 0, body: {} }) });
    const second = createAuthSession({ request: offline.request, load: store.load, save: store.save });
    await expect(second.verifyCode({ email: "a@b.co", code: "000000", mode: "login" })).rejects.toMatchObject({ status: 0 });
    expect(second.current().profile).toBeNull();

    const naked = server({
      "POST /api/account/verify": () => ({ status: 200, body: user("Болд") }),
      "PATCH /api/account": () => ({ status: 200, body: user("Болд") }),
    });
    const third = createAuthSession({ request: naked.request, load: store.load, save: store.save });
    await expect(third.verifyCode({ email: "a@b.co", code: "000000", mode: "login" })).rejects.toBeInstanceOf(AuthFlowError);
    expect(third.current().status).toBe("guest");
  });

  it("drops an expired server session, keeps a cached profile while offline, and still logs out locally if the server is unreachable", async () => {
    const store = memory();
    await store.save({ cookies: [{ name: "sb-test-auth-token", value: "old" }], saved: [], faceId: "device-1", cache: user("Болд") });
    const gone = server({ "GET /api/account": () => ({ status: 200, body: { user: null, bookings: [] }, cookies: ["sb-test-auth-token=; Max-Age=0"] }) });
    const expired = createAuthSession({ request: gone.request, load: store.load, save: store.save });
    const signedOut = await expired.restore();
    expect(signedOut.status).toBe("guest");
    expect(signedOut.notice).toMatch(/Сесс дууссан/);
    expect(store.dump().cookies).toEqual([]);
    expect(store.dump().faceId).toBe("device-1");

    await store.save({ cookies: [{ name: "sb-test-auth-token", value: "old" }], saved: [], faceId: null, cache: user("Болд") });
    const down = server({ "GET /api/account": () => ({ status: 0, body: {} }) });
    const offline = createAuthSession({ request: down.request, load: store.load, save: store.save });
    expect((await offline.restore()).status).toBe("offline");
    expect(offline.current().profile?.name).toBe("Болд");

    const logout = createAuthSession({ request: down.request, load: store.load, save: store.save });
    await logout.restore();
    const after = await logout.logout();
    expect(after.status).toBe("guest");
    expect(after.cookies).toEqual([]);
    expect(after.notice).toMatch(/Сервертэй холбогдож чадсангүй/);
  });

  it("clears the session on 401 and refuses to delete an account while offline", async () => {
    const store = memory();
    await store.save({ cookies: [{ name: "sb-test-auth-token", value: "old" }], saved: [], faceId: null, cache: user("Болд") });
    const denied = server({
      "GET /api/account": () => ({ status: 200, body: user("Болд"), cookies: [SESSION] }),
      "PATCH /api/account": () => ({ status: 401, body: { error: "Нэвтэрнэ үү." } }),
    });
    const auth = createAuthSession({ request: denied.request, load: store.load, save: store.save });
    await auth.restore();
    await expect(auth.updateProfile({ name: "Шинэ" })).rejects.toThrow("Нэвтэрнэ үү.");
    expect(auth.current().status).toBe("guest");

    const cached = createAuthSession({
      request: server({ "GET /api/account": () => ({ status: 0, body: {} }) }).request,
      load: async () => ({ cookies: [{ name: "sb-test-auth-token", value: "old" }], saved: [], faceId: null, cache: user("Болд") }),
      save: store.save,
    });
    await cached.restore();
    await expect(cached.deleteAccount()).rejects.toThrow(/устгахгүй/);
    expect(cached.current().profile?.name).toBe("Болд");
  });

  it("forgets an expired Face ID key and keeps it when the network fails", async () => {
    const store = memory();
    await store.save({ cookies: [], saved: [], faceId: "device-1", cache: null });
    let secret = "secret-1";
    const biometric = {
      confirm: async () => {},
      read: async () => secret,
      write: async (next: string) => {
        secret = next;
      },
      clear: async () => {
        secret = "";
      },
    };
    const expired = createAuthSession({
      request: server({ "POST /api/account/device/login": () => ({ status: 401, body: { error: "Face ID-аар нэвтрэх хугацаа дууссан байна. Имэйлээр нэвтрээд дахин асаана уу." } }) }).request,
      load: store.load,
      save: store.save,
      biometric,
    });
    await expired.restore();
    await expect(expired.faceIdSignIn()).rejects.toThrow(/хугацаа дууссан/);
    expect(expired.current().faceId).toBeNull();
    expect(secret).toBe("");

    secret = "secret-2";
    await store.save({ cookies: [], saved: [], faceId: "device-2", cache: null });
    const down = createAuthSession({
      request: server({ "POST /api/account/device/login": () => ({ status: 0, body: {} }) }).request,
      load: store.load,
      save: store.save,
      biometric,
    });
    await down.restore();
    await expect(down.faceIdSignIn()).rejects.toMatchObject({ status: 0 });
    expect(down.current().faceId).toBe("device-2");
    expect(secret).toBe("secret-2");
  });

  it("does not call the network in preview mode", async () => {
    let called = false;
    const auth = createAuthSession({
      preview: true,
      request: async () => {
        called = true;
        return { status: 200, body: {}, cookies: [] };
      },
      load: async () => ({ cookies: [], saved: [], faceId: null, cache: null }),
      save: async () => {},
    });
    await expect(auth.requestCode("a@b.co")).rejects.toThrow(/илгээгдэхгүй/);
    expect(called).toBe(false);
  });
});
