/** Public Next.js deployment that actually serves tours, account and booking APIs.
 * elitetravel.mn currently serves a different site and is not this API origin. */
export const API_ORIGIN = (process.env.EXPO_PUBLIC_API_ORIGIN ?? "https://elitetravel-mn-wg6y.vercel.app").replace(/\/+$/, "");

/** Design fixture mode. Never the default. Blocks booking, payment and sign-in calls. */
export const previewMode = process.env.EXPO_PUBLIC_PREVIEW === "1";

export const PHONE_DISPLAY = "+976 9003 1771";
export const PHONE_ALT = "+976 9003 2772";
export const PHONE_TEL = "tel:+97690031771";
export const INSTAGRAM = "https://ig.me/m/elitetravelmn";

/** Brand still published with the website (src/lib/cloudinary.ts seascape poster). */
export const HERO_STILL =
  "https://res.cloudinary.com/ev6fygsf/image/upload/f_auto,q_auto,c_fill,g_auto,w_1400,h_1800/elitetravel/media/web-hero-seascape-frame";
