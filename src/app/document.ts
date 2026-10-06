import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { worlds } from "./content";

// Shared by the root layout and the global 404, which renders its own
// <html> and so can't inherit anything from the layout.

// Both are variable, so every weight comes from the same files, and the
// latin subset already has every accent Spanish and Portuguese use.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const fontVariables = `${geist.variable} ${geistMono.variable}`;

// The browser chrome matches the page, which is always carbon: the
// background token, oklch(0.155 0 0).
export const viewport: Viewport = {
  themeColor: "#0c0c0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// The CSP requires Trusted Types for scripts (public/_headers), and Next.js
// loads lazy chunks by setting script.src to a plain string, which that
// blocks. This default policy runs first in <head> and lets through script
// URLs under this site's /_next/static/ and nothing else; it defines no
// HTML or script conversions, so innerHTML and the like stay blocked. It
// returns the URL exactly as given: Turbopack recognises a loaded chunk by
// the script's src attribute, so rewriting it would leave the load waiting.
export const trustedTypesPolicy = `(function () {
  var tt = window.trustedTypes;
  if (!tt || !tt.createPolicy) return;
  var allowed = location.origin + "/_next/static/";
  tt.createPolicy("default", {
    createScriptURL: function (url) {
      if (new URL(url, location.href).href.indexOf(allowed) === 0) return url;
      throw new TypeError("Script URL outside /_next/static/: " + url);
    }
  });
})();`;

// Time travel (src/quantum/time.ts) shows the page in the year of the
// current branch. On a full page load that would paint today's design
// first and then switch, so this runs in <head>, before the body: it
// finds the year (from the history entry's branch, or else the era the
// tab was last in), sets <html data-era> and adds the world's stylesheet,
// render-blocking where browsers support it. Unless time travel is off.
const past = worlds.filter((w) => w.id !== "now").map((w) => [w.from, w.id]);
const today = worlds.find((w) => w.id === "now")!.from;

export const eraScript = `(function () {
  try {
    if (/[?&]quantum=off(&|$)/.test(location.search)) return;
    if (JSON.parse(localStorage.getItem("vx-quantum") || "{}").time === false) return;
    var worlds = ${JSON.stringify(past)};
    var tree = JSON.parse(sessionStorage.getItem("vx-branches") || "null");
    var id = history.state && history.state.vxBranch;
    var node = null;
    if (tree && id) for (var i = 0; i < tree.nodes.length; i++) if (tree.nodes[i].id === id) node = tree.nodes[i];
    var year = node ? node.year : JSON.parse(sessionStorage.getItem("vx-era") || "null");
    if (typeof year !== "number" || year >= ${today}) return;
    var world = null;
    for (var j = 0; j < worlds.length; j++) if (worlds[j][0] <= year) world = worlds[j][1];
    if (!world) return;
    var root = document.documentElement;
    root.setAttribute("data-era", world);
    root.setAttribute("data-year", String(year));
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/eras/" + world + ".css";
    link.setAttribute("data-world", world);
    link.setAttribute("blocking", "render");
    document.head.appendChild(link);
  } catch (e) {}
})();`;
