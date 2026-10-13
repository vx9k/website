import { ImageResponse } from "next/og";
import { intro, site } from "./content";

// The preview shown when the site is shared, drawn once at build time.
export const dynamic = "force-static";
export const alt = `${site.name}: ${intro.line}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#000",
          color: "#f2f2f2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 32, color: "#a3a3a3" }}>
          <svg viewBox="0 0 32 32" width={56} height={56}>
            <rect x="2.5" y="2.5" width="27" height="27" fill="#000" stroke="#fff" strokeWidth="2.5" />
            <path d="M4 28 C17 28 27.5 22 28 4 V28 Z" fill="#fff" />
          </svg>
          kthread.dev
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: "-0.04em", maxWidth: 960 }}>{intro.line}</div>
      </div>
    ),
    size,
  );
}
