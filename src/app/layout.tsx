import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import "./globals.css";
import { site } from "./content";

// Atkinson Hyperlegible Next sets everything, labels included: one
// variable font, self-hosted by next/font, subset to latin and preloaded.
// next/font has no metrics for it to size a fallback by, so it doesn't
// try (adjustFontFallback); the system's sans stands in until it loads.
const sans = Atkinson_Hyperlegible_Next({
  variable: "--font-face-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
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

// Two themes, following the system; the browser chrome matches each.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf3f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f16" },
  ],
  colorScheme: "light dark",
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

// Cloudflare Web Analytics: page views and Core Web Vitals, with no cookies
// and nothing stored on the visitor's device. The site's token is public
// (it ends up in the page) but lives in the dashboard, so the build reads
// it from the CF_WEB_ANALYTICS_TOKEN build variable; without it, the page
// carries no beacon. public/_headers allows the beacon's script and the
// address it reports to; it sends CORP headers, so cross-origin isolation
// lets it load.
const analyticsToken = process.env.CF_WEB_ANALYTICS_TOKEN;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US" dir="ltr" className={sans.variable}>
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
        {analyticsToken && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: analyticsToken })}
          />
        )}
      </body>
    </html>
  );
}
