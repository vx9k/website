import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import CanopyField from "./components/CanopyField";
import OfflineBanner from "./components/OfflineBanner";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "vx — systems engineer",
  description:
    "Portfolio of a systems engineer working across POSIX-compliant software and minimal, portable systems tooling.",
};

export const viewport: Viewport = {
  themeColor: "#0a0f0b",
  colorScheme: "dark",
};

// Runs before paint so the contrast/motion settings never flash on load.
// Also marks the page as JS-capable so scroll reveals only hide content
// when there is a script around to show it again.
const bootScript = `
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  try {
    var s = JSON.parse(localStorage.getItem("vx-settings") || "{}");
    if (s.contrast === "high") root.setAttribute("data-contrast", "high");
    if (s.motion === "reduced") root.setAttribute("data-motion", "reduced");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-ink">
        <CanopyField />
        {children}
        <OfflineBanner />
      </body>
    </html>
  );
}
