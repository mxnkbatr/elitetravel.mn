import { describe, expect, it } from "vitest";
import { choiceFromStorage, permissionFromAuthorization, pushRegistrationBody, shouldAskPermission, shouldRegisterAfterLogin, shouldRegisterDevice, tripIdFromPushUrl, uniqueTripTokens } from "./push";

const FCM = `fcm${"A".repeat(20)}:APA91b`;
const TRIP = "t".repeat(24);

describe("push registration body", () => {
  it("matches the Capacitor payload sent to POST /api/push", () => {
    expect(pushRegistrationBody({ token: FCM, platform: "ios", tripTokens: [TRIP, TRIP, "nope", null] })).toEqual({
      token: FCM,
      platform: "ios",
      tripTokens: [TRIP],
      staff: false,
    });
  });

  it("drops tokens the server would reject and keeps at most 50", () => {
    const tokens = Array.from({ length: 60 }, (_, index) => `${"a".repeat(20)}${index}`);
    expect(uniqueTripTokens(["short", "has.dot", ...tokens, tokens[0]])).toEqual(tokens.slice(0, 50));
    expect(pushRegistrationBody({ token: "short", platform: "ios", tripTokens: [TRIP] })).toBeNull();
    expect(pushRegistrationBody({ token: FCM, platform: "web", tripTokens: [TRIP] })).toBeNull();
  });
});

describe("when push may ask or register", () => {
  it("never asks at launch or login", () => {
    expect(shouldAskPermission("launch", "prompt")).toBe(false);
    expect(shouldAskPermission("login", "prompt")).toBe(false);
    expect(shouldAskPermission("tokens", "prompt")).toBe(false);
    expect(shouldAskPermission("booking", "granted")).toBe(false);
    expect(shouldAskPermission("profile", "denied")).toBe(false);
  });

  it("asks after a booking and from the profile toggle", () => {
    expect(shouldAskPermission("booking", "prompt")).toBe(true);
    expect(shouldAskPermission("profile", "prompt")).toBe(true);
  });

  it("registers a granted token after login, and keeps an explicit off", () => {
    expect(shouldRegisterDevice({ moment: "login", permission: "granted", optedIn: true })).toBe(true);
    expect(shouldRegisterDevice({ moment: "login", permission: "granted", optedIn: false })).toBe(false);
    expect(shouldRegisterDevice({ moment: "login", permission: "prompt", optedIn: true })).toBe(false);
    expect(shouldRegisterDevice({ moment: "launch", permission: "granted", optedIn: false })).toBe(false);
    expect(shouldRegisterDevice({ moment: "launch", permission: "granted", optedIn: true })).toBe(true);
    expect(shouldRegisterDevice({ moment: "booking", permission: "granted", optedIn: true })).toBe(true);
    expect(shouldRegisterAfterLogin({ choice: "unset", permission: "granted" })).toBe(true);
    expect(shouldRegisterAfterLogin({ choice: "on", permission: "granted" })).toBe(true);
    expect(shouldRegisterAfterLogin({ choice: "off", permission: "granted" })).toBe(false);
    expect(shouldRegisterAfterLogin({ choice: "unset", permission: "prompt" })).toBe(false);
    expect(choiceFromStorage(null)).toBe("unset");
    expect(choiceFromStorage("1")).toBe("on");
    expect(choiceFromStorage("0")).toBe("off");
  });
});

describe("notification paths", () => {
  it("opens a booking path and ignores admin and absolute links", () => {
    expect(tripIdFromPushUrl("/bookings/ET-1")).toBe("ET-1");
    expect(tripIdFromPushUrl("/admin?q=ET-1")).toBeNull();
    expect(tripIdFromPushUrl("https://elitetravel.mn/bookings/ET-1")).toBeNull();
    expect(tripIdFromPushUrl("/bookings/ET-1/pay")).toBeNull();
    expect(permissionFromAuthorization(1)).toBe("granted");
    expect(permissionFromAuthorization(2)).toBe("granted");
    expect(permissionFromAuthorization(0)).toBe("denied");
    expect(permissionFromAuthorization(-1)).toBe("prompt");
  });
});
