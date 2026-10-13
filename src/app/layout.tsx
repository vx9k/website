import type { Metadata, Viewport } from "next";
import { Host_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import { site } from "./content";

// Host Grotesk sets everything; Martian Mono sets the small labels. Both
// are variable, self-hosted by next/font, and subset to latin.
const sans = Host_Grotesk({
  variable: "--font-face-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Martian_Mono({
  variable: "--font-face-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.github }],
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  formatDetection: { telephone: false, email: false, address: false },
};

// One dark theme; the browser chrome matches it.
export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

// The CSP requires Trusted Types for scripts (public/_headers), and Next.js
// loads lazy chunks by setting script.src to a plain string, which that
// blocks. This default policy runs first in <head> and lets through script
// URLs under this site's /_next/static/ and nothing else; it defines no
// HTML or script conversions, so innerHTML and the like stay blocked. It
// returns the URL exactly as given: Turbopack recognises a loaded chunk by
// the script's src attribute, so rewriting it would leave the load waiting.
const trustedTypesPolicy = `(function () {
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US" dir="ltr" className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: trustedTypesPolicy }} />
      </head>
      <body className="min-h-dvh antialiased">
        {/* Out of the layout until it has focus. */}
        <a
          href="#main"
          className="fixed top-3 left-3 z-10 bg-foreground px-4 py-2 text-background not-focus:sr-only"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
