import type { Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";

// Shared by the root layout and the global 404, which renders its own
// <html> and so can't inherit anything from the layout.

// Instrument Sans is variable (weight and width), so one file covers
// every weight the page uses. Plex Mono is static; only 400 and 500 load.
// The latin subset covers every accented letter Spanish and Portuguese use.
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const fontVariables = `${instrument.variable} ${plexMono.variable}`;

export const viewport: Viewport = {
  themeColor: "#0c0808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before first paint. Combines the visitor's saved flags with their
// system preferences and writes the result onto <html> as data attributes,
// which is all the CSS looks at. Exposed as window.__vxFlags.apply so the
// settings panel reuses exactly this logic instead of duplicating it.
export const bootScript = `(function () {
  var d = document.documentElement;
  d.classList.add("js");
  function mq(q) { try { return window.matchMedia(q).matches; } catch (e) { return false; } }
  function read() {
    try {
      var s = JSON.parse(localStorage.getItem("vx-flags") || "null");
      if (s) return s;
      var old = JSON.parse(localStorage.getItem("vx-settings") || "{}");
      return { contrast: old.contrast === "high", motion: old.motion === "reduced" };
    } catch (e) { return {}; }
  }
  function set(name, on, value) { on ? d.setAttribute(name, value) : d.removeAttribute(name); }
  function apply() {
    var s = read();
    var eink = !!s.eink || mq("(update: slow)") || mq("(monochrome)");
    set("data-contrast", !!s.contrast || mq("(prefers-contrast: more)"), "high");
    set("data-motion", !!s.motion || mq("(prefers-reduced-motion: reduce)"), "reduced");
    set("data-display", eink, "eink");
    set("data-text", !!s.large, "large");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", eink ? "#ffffff" : d.hasAttribute("data-contrast") ? "#000000" : "#0c0808");
  }
  window.__vxFlags = { read: read, apply: apply };
  apply();
  ["(prefers-contrast: more)", "(prefers-reduced-motion: reduce)", "(update: slow)", "(monochrome)"].forEach(function (q) {
    try { window.matchMedia(q).addEventListener("change", apply); } catch (e) {}
  });
})();`;
