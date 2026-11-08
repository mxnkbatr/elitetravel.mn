import { describe, expect, it } from "vitest";
import { ApiError, apiRequest } from "./api";

describe("apiRequest", () => {
  it("keeps set-cookie and returns a 201 body", async () => {
    const fetchImpl = async () => new Response(JSON.stringify({ id: "ET-1", total: 10 }), { status: 201, headers: { "set-cookie": "sb-auth=abc; Max-Age=60" } });
    const res = await apiRequest({ path: "/api/bookings", json: {}, fetchImpl, origin: "https://example.test" });
    expect(res.status).toBe(201);
    expect(res.cookies[0]?.name).toBe("sb-auth");
  });

  it("surfaces the server error and does not treat it as success", async () => {
    const fetchImpl = async () => new Response(JSON.stringify({ error: "Нэрээ оруулна уу." }), { status: 400 });
    await expect(apiRequest({ path: "/api/bookings", json: {}, fetchImpl, origin: "https://example.test" })).rejects.toMatchObject({ status: 400, message: "Нэрээ оруулна уу." });
    await expect(apiRequest({ path: "/api/bookings", json: {}, fetchImpl, origin: "https://example.test" })).rejects.toBeInstanceOf(ApiError);
  });
});
