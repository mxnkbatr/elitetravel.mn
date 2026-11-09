/**
 * Same contract as the Capacitor app's POST /api/push.
 * The server stores the FCM token and the bookings this device can open.
 * `staff` stays false: admin alerts are still opted in from the website shell.
 */

export const PUSH_PATH = "/api/push";

const FCM_TOKEN = /^[A-Za-z0-9_:-]{20,4096}$/;
const TRIP_TOKEN = /^[A-Za-z0-9_-]{20,64}$/;

export type PushPlatform = "ios" | "android";
export type PushPermission = "unavailable" | "prompt" | "granted" | "denied";
export type PushMoment = "launch" | "login" | "booking" | "profile" | "tokens";
export type PushChoice = "on" | "off" | "unset";

export type PushRegistration = {
  token: string;
  platform: PushPlatform;
  tripTokens: string[];
  staff: false;
};

/** Firebase authorization integers: denied 0, authorized 1, provisional 2, ephemeral 3. */
export function permissionFromAuthorization(status: number): PushPermission {
  if (status === 1 || status === 2 || status === 3) return "granted";
  if (status === 0) return "denied";
  return "prompt";
}

export function uniqueTripTokens(tokens: Array<string | null | undefined>) {
  const out: string[] = [];
  for (const token of tokens) {
    if (!token || !TRIP_TOKEN.test(token) || out.includes(token)) continue;
    out.push(token);
    if (out.length === 50) break;
  }
  return out;
}

export function pushRegistrationBody(input: { token: string; platform: string; tripTokens: Array<string | null | undefined> }): PushRegistration | null {
  if (input.platform !== "ios" && input.platform !== "android") return null;
  if (!FCM_TOKEN.test(input.token)) return null;
  return { token: input.token, platform: input.platform, tripTokens: uniqueTripTokens(input.tripTokens), staff: false };
}

export function choiceFromStorage(value: string | null): PushChoice {
  if (value === "1") return "on";
  if (value === "0") return "off";
  return "unset";
}

/** Permission dialogs only after a booking or from the profile toggle. Launch and login never ask. */
export function shouldAskPermission(moment: PushMoment, permission: PushPermission) {
  if (permission !== "prompt") return false;
  return moment === "booking" || moment === "profile";
}

/** A granted token is sent only after this device has opted in. Launch never opts in by itself. */
export function shouldRegisterDevice(input: { moment: PushMoment; permission: PushPermission; optedIn: boolean }) {
  if (input.permission !== "granted" || !input.optedIn) return false;
  return input.moment === "launch" || input.moment === "login" || input.moment === "booking" || input.moment === "profile" || input.moment === "tokens";
}

/**
 * After sign-in, a device iOS already allows is registered without a new dialog.
 * An explicit profile "off" stays off until the traveller turns it on again.
 */
export function shouldRegisterAfterLogin(input: { choice: PushChoice; permission: PushPermission }) {
  if (input.choice === "off") return false;
  return input.permission === "granted";
}

/** Booking pushes carry a site path. Only the booking page maps onto a native trip. */
export function tripIdFromPushUrl(url: unknown) {
  if (typeof url !== "string") return null;
  const match = /^\/bookings\/([A-Za-z0-9_-]{1,80})$/.exec(url);
  return match?.[1] ?? null;
}
