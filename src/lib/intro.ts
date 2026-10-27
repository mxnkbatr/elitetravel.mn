/** Shared by the root layout (server) and IntroCurtain (client) — keep this module plain. */
export const INTRO_KEY = "elite-intro-seen";

/**
 * Runs before paint (inlined in <head>): flags a first visit this session so the
 * curtain is already covering the page on the very first frame — no content flash.
 */
export const introBootScript = `try{if(!sessionStorage.getItem("${INTRO_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="1"}}catch(e){}`;
