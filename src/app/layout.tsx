import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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

// Runs before paint so the page never flashes the wrong theme/contrast/motion
// on load. Kept tiny and dependency-free since this is a static export.
const bootScript = `
(function () {
  try {
    var s = JSON.parse(localStorage.getItem("vx-settings") || "{}");
    var root = document.documentElement;
    if (s.theme === "dark") root.setAttribute("data-theme", "dark");
    if (s.contrast === "high") root.setAttribute("data-contrast", "high");
    if (s.motion === "reduced") root.setAttribute("data-motion", "reduced");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-ink transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
