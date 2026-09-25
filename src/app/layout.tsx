import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import CanopyField from "./components/CanopyField";
import OfflineBanner from "./components/OfflineBanner";

// Instrument Sans is variable (weight and width), so one file covers
// every weight the page uses. Plex Mono is static; only 400 and 500 load.
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

const description =
  "vx is a systems engineer writing POSIX-compliant software and minimal, portable boot tooling in C.";

export const metadata: Metadata = {
  title: {
    default: "vx — systems engineer",
    template: "%s · vx",
  },
  description,
  authors: [{ name: "vx", url: "https://github.com/vx9k" }],
  openGraph: {
    title: "vx — systems engineer",
    description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "vx — systems engineer",
    description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

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
const bootScript = `(function () {
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${instrument.variable} ${plexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip text-ink antialiased">
        <a
          href="#main"
          className="glass eyebrow fixed top-3 left-3 z-[60] -translate-y-24 px-5 py-3.5 text-ink! focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <CanopyField />
        {children}
        <OfflineBanner />
      </body>
    </html>
  );
}
