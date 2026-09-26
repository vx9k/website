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

// The browser chrome matches the page: paper by day, carbon by night.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f2ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0b" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  // Edge to edge, so the fixed glow reaches behind the status bar and the
  // toolbar in Safari. The CSS keeps content inside the safe area.
  viewportFit: "cover",
};
