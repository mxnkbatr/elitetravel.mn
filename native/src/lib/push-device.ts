import { PermissionsAndroid, Platform } from "react-native";
import { permissionFromAuthorization, type PushPermission } from "./push";

export type PushEvents = {
  onToken: () => void;
  onOpen: (url: string | null) => void;
};

export type PushClient = {
  permission(): Promise<PushPermission>;
  requestPermission(): Promise<PushPermission>;
  getToken(): Promise<string>;
  deleteToken(): Promise<void>;
  listen(events: PushEvents): () => void;
};

function urlOf(data: { [key: string]: string | object } | undefined) {
  const url = data?.url;
  return typeof url === "string" ? url : null;
}

async function androidPermission(request: boolean): Promise<PushPermission> {
  if (Number(Platform.Version) < 33) return "granted";
  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
  if (!request) return (await PermissionsAndroid.check(permission)) ? "granted" : "prompt";
  const result = await PermissionsAndroid.request(permission);
  return result === PermissionsAndroid.RESULTS.GRANTED ? "granted" : "denied";
}

/**
 * FCM registration token from the same Firebase project as the Capacitor app.
 * Installation-ID mode stays off: the existing server stores FCM tokens, not FIDs.
 * The native module is absent on web, so this returns null instead of throwing.
 */
export async function loadPushClient(): Promise<PushClient | null> {
  if (Platform.OS !== "ios" && Platform.OS !== "android") return null;
  try {
    const messaging = await import("@react-native-firebase/messaging");
    const instance = messaging.getMessaging();
    return {
      async permission() {
        if (Platform.OS === "android") return androidPermission(false);
        return permissionFromAuthorization(await messaging.hasPermission(instance));
      },
      async requestPermission() {
        if (Platform.OS === "android") return androidPermission(true);
        return permissionFromAuthorization(await messaging.requestPermission(instance));
      },
      getToken() {
        return messaging.getToken(instance);
      },
      deleteToken() {
        return messaging.deleteToken(instance);
      },
      listen(events) {
        const stopRefresh = messaging.onTokenRefresh(instance, () => events.onToken());
        const stopOpen = messaging.onNotificationOpenedApp(instance, (message) => events.onOpen(urlOf(message.data)));
        void messaging.getInitialNotification(instance).then((message) => {
          if (message) events.onOpen(urlOf(message.data));
        });
        return () => {
          stopRefresh();
          stopOpen();
        };
      },
    };
  } catch {
    return null;
  }
}
