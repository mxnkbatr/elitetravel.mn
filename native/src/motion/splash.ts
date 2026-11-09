/**
 * Must match the iOS splash storyboard exactly:
 * app.json splash.backgroundColor, plugin imageWidth 180, resizeMode contain.
 * The storyboard pins the logo in a square imageWidth box, centered, scaleAspectFit.
 * assets/splash-logo.png is 307×400. Do not change these numbers without a native rebuild.
 */
export const SPLASH_BG = "#0b241d";
export const SPLASH_LOGO_WIDTH = 180;
