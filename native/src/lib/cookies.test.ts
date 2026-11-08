import { describe, expect, it } from "vitest";
import { applySetCookies, cookieHeader, parseSetCookie, readSetCookieHeaders } from "./cookies";

describe("cookies", () => {
  it("parses max-age and skips the bot cookie", () => {
    const now = 1_000_000;
    expect(parseSetCookie("__cf_bm=abc; Path=/", now)).toBeNull();
    expect(parseSetCookie("sb-auth=token; Max-Age=10", now)?.expiresAt).toBe(now + 10_000);
  });

  it("replaces and drops expired cookies", () => {
    const now = 5_000;
    const jar = applySetCookies([{ name: "sb-auth", value: "old" }], ["sb-auth=new; Max-Age=5", "gone=; Max-Age=0"], now);
    expect(cookieHeader(jar, now)).toBe("sb-auth=new");
  });

  it("splits combined set-cookie headers without breaking expires commas", () => {
    const headers = { get: () => "a=1; Expires=Sun, 08 Nov 2026 07:00:00 GMT, b=2" };
    expect(readSetCookieHeaders(headers)).toEqual(["a=1; Expires=Sun, 08 Nov 2026 07:00:00 GMT", "b=2"]);
  });
});
