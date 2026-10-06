import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
