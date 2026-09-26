import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Shared by the root layout and the global 404, which renders its own
// <html> and so can't inherit anything from the layout.

// Both are variable, so one file each covers every weight, with the
// accents Spanish and Portuguese need.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
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
};
