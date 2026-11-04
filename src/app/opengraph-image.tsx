import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import mark from "@/components/site/mark.json";
import { intro, site } from "./content";

// The preview shown when the site is shared, drawn once at build time,
// laid out like the page: the panel on the left, with the mark, the name
// and the headline in the dark theme, and the night scene on the right, a
// crop around the Cerro, the moon and the windmill at
// exactly three times its size (scripts/sunset.mjs), so it's placed at its
// own size and never resampled.
export const dynamic = "force-static";
export const alt = `${site.name}: ${intro.line}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const scene = `data:image/png;base64,${await readFile(join(process.cwd(), "src/assets/scene-og.png"), "base64")}`;
// The site's face, in the two weights the card uses. next/og can't take
// next/font's files, so these are its static instances from Google Fonts
// (SIL Open Font License, src/assets/fonts/OFL.txt).
const face = (weight: 400 | 500) => readFile(join(process.cwd(), `src/assets/fonts/atkinson-hyperlegible-next-${weight}.ttf`));
const fonts = [
  { name: "Atkinson Hyperlegible Next", data: await face(400), weight: 400 as const, style: "normal" as const },
  { name: "Atkinson Hyperlegible Next", data: await face(500), weight: 500 as const, style: "normal" as const },
];

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0e0f16", color: "#f1ece3", fontFamily: "Atkinson Hyperlegible Next" }}>
        <div
          style={{
            width: 600,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 64px 72px",
            background: "#141621",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28, color: "#a6a9b6" }}>
            <svg viewBox={`0 0 ${mark.size} ${mark.size}`} width={51} height={51} shapeRendering="crispEdges">
              {mark.runs.map(([x, y, n, fill]) => (
                <rect key={`${x}-${y}`} x={x} y={y} width={n} height={1} fill={fill as string} />
              ))}
            </svg>
            kthread.dev
          </div>
          <div style={{ fontSize: 60, fontWeight: 500, lineHeight: 1.08, letterSpacing: "-0.025em" }}>{intro.line}</div>
        </div>
        <img src={scene} width={600} height={630} alt="" />
      </div>
    ),
    { ...size, fonts },
  );
}
