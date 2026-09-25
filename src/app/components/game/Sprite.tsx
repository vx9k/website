import { Pixels } from "../../pixel";

// Sprites for the game, drawn as rows: "x" ink, "o" accent, "w" screen
// colour (a highlight), "." empty. Each frame becomes a <g> in one SVG and
// CSS shows the one named by data-frame, so animating is one attribute.

const HEAD = ["..xxxx..", ".xxxxxxx", ".oooooo.", ".oxooxo.", ".oooooo."];
const HEAD_BLINK = ["..xxxx..", ".xxxxxxx", ".oooooo.", ".oooooo.", ".oooooo."];

export const HERO_FRAMES = {
  idle: [...HEAD, "..xxxx..", ".xxxxxx.", "o.xxxx.o", "..x..x..", ".xx..xx."],
  blink: [...HEAD_BLINK, "..xxxx..", ".xxxxxx.", "o.xxxx.o", "..x..x..", ".xx..xx."],
  walk1: [...HEAD, "..xxxx..", ".xxxxxx.", ".oxxxxo.", ".x...x..", "xx...xx."],
  walk2: [...HEAD, "..xxxx..", ".xxxxxx.", ".oxxxxo.", "...xx...", "..xxx..."],
  jump: [...HEAD, "..xxxx..", "oxxxxxxo", "..xxxx..", ".x....x.", "x......x"],
  fall: [...HEAD, "o.xxxx.o", ".xxxxxx.", "..xxxx..", "..x..x..", "..x..x.."],
};

export type Frame = keyof typeof HERO_FRAMES;

export const HERO_W = 8;
export const HERO_H = 10;

export const GEM = ["..x..", ".xox.", "xooox", ".xox.", "..x.."];
export const BALL = ["..xxx..", ".xwoox.", "xwoooox", "xooooox", "xooooox", ".xooox.", "..xxx.."];

function layers(rows: string[]) {
  const out: Record<string, string> = {};
  for (const [ch, cls] of [
    ["x", "c-ink"],
    ["o", "c-acc"],
    ["w", "c-hi"],
  ] as const) {
    const px = new Pixels();
    rows.forEach((r, y) => {
      for (let x = 0; x < r.length; x++) if (r[x] === ch) px.set(x, y);
    });
    const d = px.path();
    if (d) out[cls] = d;
  }
  return out;
}

/** A static sprite: a gem, the ball. `scale` is screen pixels per art pixel. */
export function Still({ rows, scale = 3 }: { rows: string[]; scale?: number }) {
  return (
    <svg
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      width={rows[0].length * scale}
      height={rows.length * scale}
      shapeRendering="crispEdges"
      aria-hidden
      focusable="false"
      className="sprite block"
    >
      {Object.entries(layers(rows)).map(([cls, d]) => (
        <path key={cls} className={cls} d={d} />
      ))}
    </svg>
  );
}

/** The character, with every frame. */
export function Hero({ frame = "idle", scale = 3 }: { frame?: Frame; scale?: number }) {
  return (
    <svg
      viewBox={`0 0 ${HERO_W} ${HERO_H}`}
      width={HERO_W * scale}
      height={HERO_H * scale}
      shapeRendering="crispEdges"
      aria-hidden
      focusable="false"
      className="sprite block"
      data-frame={frame}
    >
      {Object.entries(HERO_FRAMES).map(([name, rows]) => (
        <g key={name} className={`f-${name}`}>
          {Object.entries(layers(rows)).map(([cls, d]) => (
            <path key={cls} className={cls} d={d} />
          ))}
        </g>
      ))}
    </svg>
  );
}
