import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { intro, site } from "./content";

// The preview shown when the site is shared, drawn once at build time: the
// name and the headline over the page's horizon. The horizon is a crop of
// the same pixel art at exactly three times its size (scripts/sunset.mjs),
// so it's placed at its own size and never resampled.
export const dynamic = "force-static";
export const alt = `${site.name}: ${intro.line}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const horizon = `data:image/png;base64,${await readFile(join(process.cwd(), "src/assets/sunset-og.png"), "base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#14110f",
          color: "#f0e8db",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 40, padding: "64px 80px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 30, color: "#ab9f8e" }}>
            <svg viewBox="0 0 32 32" width={52} height={52}>
              <rect x="2.5" y="2.5" width="27" height="27" fill="#14110f" stroke="#f0e8db" strokeWidth="2.5" />
              <path d="M4 28 C17 28 27.5 22 28 4 V28 Z" fill="#f0e8db" />
            </svg>
            kthread.dev
          </div>
          <div style={{ fontSize: 64, lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: 980 }}>{intro.line}</div>
        </div>
        <img src={horizon} width={1200} height={270} alt="" style={{ marginTop: "auto" }} />
      </div>
    ),
    size,
  );
}
