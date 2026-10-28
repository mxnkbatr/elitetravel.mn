/*
 * Injected by the native shell (iOS + Android) into every page of the live site.
 * Removes the "website on a phone" tells without touching the website's code:
 * no text selection or long-press callouts, no pinch zoom, no rubber-band reload,
 * and an `elite-app` class on <html> the site may opt into later.
 */
(function () {
  if (window.__eliteShell) return;
  window.__eliteShell = true;

  var css = [
    "html{-webkit-text-size-adjust:100%;text-size-adjust:100%}",
    "*{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}",
    "body{-webkit-user-select:none;user-select:none;overscroll-behavior-y:none}",
    "input,textarea,select,[contenteditable]{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}",
    "img,a{-webkit-user-drag:none}",
  ].join("");

  function apply() {
    var root = document.documentElement;
    root.classList.add("elite-app");
    if (!document.getElementById("elite-shell-style")) {
      var style = document.createElement("style");
      style.id = "elite-shell-style";
      style.textContent = css;
      (document.head || root).appendChild(style);
    }
    var vp = document.querySelector('meta[name="viewport"]');
    if (!vp) {
      vp = document.createElement("meta");
      vp.name = "viewport";
      (document.head || root).appendChild(vp);
    }
    vp.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
  }

  apply();
  // Next.js swaps <head> content on client navigation; keep the shell styles in place
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: false });
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); }, { passive: false });
})();
