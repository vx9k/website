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
          background: "#0e0e0f",
          color: "#ececea",
        }}
      >
        <div style={{ fontSize: 32, color: "#9e9e99" }}>kthread.dev</div>
        <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: "-0.04em", maxWidth: 960 }}>{intro.line}</div>
      </div>
    ),
    size,
  );
}
