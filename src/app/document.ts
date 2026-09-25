import type { Viewport } from "next";
import { Pixelify_Sans, Silkscreen } from "next/font/google";

// Shared by the root layout and the global 404, which renders its own
// <html> and so can't inherit anything from the layout.

// Pixelify Sans is variable, so one file covers every weight, with the
// accents Spanish and Portuguese need. Silkscreen is the small label face.
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

// The case colour, for the browser chrome by day and by night.
const caseColor = { day: "#5ab9a8", night: "#1e606e" };

export const viewport: Viewport = {
  themeColor: caseColor.day,
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint and sets data-theme on <html>, which is the only
// thing the CSS looks at. A saved choice wins; without one the page follows
// the system. window.vxTheme is what the sun and the B button call.
export const bootScript = `(function () {
  var d = document.documentElement;
  var dark = window.matchMedia("(prefers-color-scheme: dark)");
  function saved() { try { return localStorage.getItem("vx-theme"); } catch (e) { return null; } }
  function set(theme) {
    d.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "night" ? "${caseColor.night}" : "${caseColor.day}");
  }
  function system() { return dark.matches ? "night" : "day"; }
  var s = saved();
  set(s === "day" || s === "night" ? s : system());
  dark.addEventListener("change", function () { if (!saved()) set(system()); });
  window.vxTheme = function () {
    var next = d.getAttribute("data-theme") === "night" ? "day" : "night";
    set(next);
    try { localStorage.setItem("vx-theme", next); } catch (e) {}
  };
})();`;
