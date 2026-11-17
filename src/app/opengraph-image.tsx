import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { intro, site } from "./content";
import { year } from "./github";

// The preview shown when the site is shared, drawn once at build time as
// the page is: the night field with the slogan and the needle, and the
// paper strip with the wordmark and the year in red. next/og can't take
// next/font's files, so Antonio's 700 comes from src/assets/fonts/ (SIL
// Open Font License, OFL.txt there); it sets every word.
export const dynamic = "force-static";
export const alt = `${site.name}: ${intro.line}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const antonio = await readFile(join(process.cwd(), "src/assets/fonts/antonio-700.ttf"));

// The page's palette (globals.css), as hex for the renderer.
const night = "#0b1030";
const paper = "#ece3cf";
const ink = "#141a3a";
const red = "#d3261a";
const white = "#eef1f6";
const cobalt = "#4c6cd0";

export default function Image() {
  const L = 420;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "Antonio", background: night }}>
        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "flex-end", padding: "0 64px 40px" }}>
          <svg width="560" height="330" viewBox="-260 -270 700 400" style={{ position: "absolute", right: 40, top: 30 }}>
            <g transform="rotate(-30)">
              <line x1="-200" y1="16" x2="250" y2="16" stroke="#7f9be0" strokeWidth="5" opacity="0.5" />
              <line x1="-180" y1="-30" x2="250" y2="-30" stroke={white} strokeWidth="6" opacity="0.4" />
              <line x1="-230" y1="44" x2="250" y2="44" stroke="#7f9be0" strokeWidth="8" opacity="0.25" />
              <path d={`M0 -20L${L} -3L${L + 60} 0L${L} 3L0 22Z`} fill={white} />
              <path d={`M0 -3L${L + 40} -0.8L${L + 40} 0.8L0 3Z`} fill={red} />
              <path d={`M${L * 0.5} 6L${L * 0.1} 140L${-L * 0.03} 140L${L * 0.02} 12Z`} fill={white} />
              <path d={`M${L * 0.5} 6L${L * 0.1} 140L${L * 0.07} 140L${L * 0.46} 6Z`} fill={cobalt} />
              <path d={`M${L * 0.05} -18L${-L * 0.01} -140L${L * 0.07} -140L${L * 0.2} -14Z`} fill={white} />
              <rect x={L * 0.035} y="-104" width="30" height="18" fill={red} />
            </g>
          </svg>
          <div style={{ display: "flex", width: 680, fontSize: 104, lineHeight: 1, color: white, textTransform: "uppercase" }}>{intro.line}</div>
        </div>
        <div style={{ height: 130, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px", background: paper, color: ink }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 56, lineHeight: 1, letterSpacing: "0.08em", color: "#7d8ca3" }}>VX</div>
            <div style={{ fontSize: 22, color: "#4d5e78" }}>kthread.dev</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 58, lineHeight: 0.86, color: red, alignItems: "flex-end" }}>
            <span>{year.slice(0, 2)}</span>
            <span>{year.slice(2)}</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Antonio", data: antonio, weight: 700, style: "normal" }] },
  );
}
