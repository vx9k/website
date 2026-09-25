import type { Viewport } from "next";
import { Pixelify_Sans, Silkscreen } from "next/font/google";

// Shared by the root layout and the global 404, which renders its own
// <html> and so can't inherit anything from the layout.

// Pixelify Sans is variable, so one file covers every weight; it carries
// all the accents Spanish and Portuguese need. Silkscreen is the tiny
// label face, drawn on an 8px grid, and only loads its regular weight.
const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

export const fontVariables = `${pixelify.variable} ${silkscreen.variable}`;

// The console's case colour, for the browser chrome by day and at night.
export const themeColors = { day: "#5ab9a8", night: "#1e606e" };

export const viewport: Viewport = {
  themeColor: themeColors.day,
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before first paint. Combines the visitor's saved flags with their
// system preferences and writes the result onto <html> as data attributes,
// which is all the CSS looks at. Exposed as window.__vxFlags so the Display
// menu, the sun in the hero and the game reuse exactly this logic.
//
//   day     saved true/false wins; unset is day unless the system asks for dark
//   motion  saved true, or prefers-reduced-motion
//   large   saved true
export const bootScript = `(function () {
  var d = document.documentElement;
  d.classList.add("js");
  function mq(q) { try { return window.matchMedia(q).matches; } catch (e) { return false; } }
  function read() {
    try { return JSON.parse(localStorage.getItem("vx-flags") || "{}") || {}; } catch (e) { return {}; }
  }
  function save(s) {
    try { localStorage.setItem("vx-flags", JSON.stringify(s)); } catch (e) {}
  }
  function set(name, on, value) { on ? d.setAttribute(name, value) : d.removeAttribute(name); }
  function apply() {
    var s = read();
    var day = typeof s.day === "boolean" ? s.day : !mq("(prefers-color-scheme: dark)");
    set("data-theme", !day, "night");
    set("data-motion", !!s.motion || mq("(prefers-reduced-motion: reduce)"), "reduced");
    set("data-text", !!s.large, "large");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", day ? "${themeColors.day}" : "${themeColors.night}");
  }
  window.__vxFlags = { read: read, save: save, apply: apply };
  apply();
  ["(prefers-color-scheme: dark)", "(prefers-reduced-motion: reduce)"].forEach(function (q) {
    try { window.matchMedia(q).addEventListener("change", apply); } catch (e) {}
  });
})();`;
