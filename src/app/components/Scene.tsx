import type { CSSProperties, ReactNode } from "react";
import { blob, outline, path, random, skyline, sprite, type Cell } from "../pixels";
import PixelButton from "./PixelButton";

// The landscape at the top of the screen, drawn at build time. The wind is
// CSS (see "The wind" in globals.css): everything that sways carries its x
// as --x, and one clock delays each thing by its x, so every gust crosses
// the scene from left to right. The buttons over the sprites only flip
// attributes on <html>.

const W = 160;
const H = 56;
const GROUND = 49;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const PINES = {
  s: ["..#..", ".###.", ".###.", "#####", "#####", "..#.."],
  m: [
    "...#...",
    "..###..",
    "..###..",
    ".#####.",
    "..###..",
    ".#####.",
    "#######",
    ".#####.",
    "#######",
    "...#...",
  ],
  l: [
    "....#....",
    "...###...",
    "...###...",
    "..#####..",
    "...###...",
    "..#####..",
    ".#######.",
    "..#####..",
    ".#######.",
    "#########",
    ".#######.",
    "#########",
    "....#....",
  ],
};

const TUFTS = [
  ["#.#", ".#."],
  ["#..", ".#."],
  ["..#", ".#."],
];

// Stripes in the foreground and sky colours, so the sock reads against
// every layer behind it. Hanging limp, and filled by a gust from the left.
const SOCK_LIMP = ["ff", "ss", "ff", "ss", ".f", ".f"];
const SOCK_FULL = ["ffssff..", "ffssffss", "ffssff.."];

function hills(seed: number, base: number, amp: number) {
  const r = random(seed);
  const [p1, p2, p3] = [r(), r(), r()].map((p) => p * Math.PI * 2);
  return Array.from({ length: W }, (_, x) =>
    Math.round(
      base +
        amp * Math.sin(x * 0.045 + p1) +
        amp * 0.5 * Math.sin(x * 0.11 + p2) +
        amp * 0.2 * Math.sin(x * 0.29 + p3),
    ),
  );
}

/** One swaying thing: `gust` answers the manual gust, `sway` the ambient
 *  wind. `peak` sways only at the height of a gust, for lower branches. */
function Sway({
  x,
  peak,
  children,
}: {
  x: number;
  peak?: boolean;
  children: ReactNode;
}) {
  return (
    <g className="gust" style={{ "--x": x } as Vars}>
      <g className={peak ? "sway-peak" : "sway"}>{children}</g>
    </g>
  );
}

/** A pine standing on a ridge. The top of the crown sways; the rest holds. */
function Pine({
  rows,
  x,
  tops,
  fill,
}: {
  rows: string[];
  x: number;
  tops: number[];
  fill: string;
}) {
  const w = rows[0].length;
  const y = tops[x + (w >> 1)] + 1 - rows.length;
  const split = Math.ceil(rows.length * 0.4);
  const top = sprite(rows.slice(0, split), x, y)["#"];
  const rest = sprite(rows.slice(split), x, y + split)["#"];
  return (
    <g className={fill}>
      <path d={path(rest)} />
      <Sway x={x}>
        <path d={path(top)} />
      </Sway>
    </g>
  );
}

// The big tree: a round canopy with a dithered highlight on its upper left.
const TREE_X = 28;
const canopy = blob([
  [28, 31, 8],
  [21, 34, 5.5],
  [35, 34, 5.5],
  [28, 26, 6],
  [23.5, 38, 3.5],
  [32.5, 38, 3.5],
]);
const inCanopy = new Set(canopy.map(([x, y]) => `${x},${y}`));
const lit = ([x, y]: Cell) => !inCanopy.has(`${x - 1},${y - 2}`) && (x + y) % 2 === 0;
const crownTop = 27;
const trunk: Cell[] = [
  ...Array.from({ length: 9 }, (_, i): Cell[] => [
    [27, 40 + i],
    [28, 40 + i],
  ]).flat(),
  [26, 48],
  [29, 48],
  [25, 40],
  [30, 39],
];

// Leaves the tree drops when shaken: where they start, where they land
// (on the ground, relative), and how long they wait to let go.
const LEAVES = [
  [21, 33, -4, 51 - 33, 0],
  [25, 39, 2, 50 - 39, 160],
  [31, 36, 6, 52 - 36, 60],
  [35, 31, 9, 50 - 31, 240],
  [28, 40, -1, 51 - 40, 320],
] as const;

export default function Scene({
  seed = 7,
  labels,
  className = "",
}: {
  seed?: number;
  labels?: { sky: string; tree: string; windsock: string };
  className?: string;
}) {
  const far = hills(seed, 30, 4);
  const near = hills(seed + 1, 40, 3);
  const r = random(seed + 2);

  const farPines = [45, 53, 80, 89, 98, 121, 131].map((x) => x + Math.floor(r() * 3));
  const nearPines: [keyof typeof PINES, number][] = [
    ["m", 56],
    ["l", 63],
    ["m", 72],
    ["s", 98],
    ["m", 104],
    ["l", 113],
    ["s", 136],
  ];
  const tufts = [6, 13, 45, 52, 61, 77, 88, 96, 109, 121, 133, 142, 156].map(
    (x, i) => [x, TUFTS[i % TUFTS.length]] as const,
  );
  const stars: Cell[] = [
    [14, 6], [38, 4], [61, 11], [84, 5], [103, 14], [117, 3], [151, 8], [72, 20],
  ];
  const sock = (rows: string[]) => sprite(rows, 151, 35);
  const limp = sock(SOCK_LIMP);
  const full = sock(SOCK_FULL);

  // Clouds are drawn where they rest (which is where they stay with motion
  // reduced) and drift from off the left edge to off the right, passing
  // that spot at load. `pace` is seconds per art pixel.
  const cloud = (circles: [number, number, number][], pace: number) => {
    const body = blob(circles);
    const edge = outline(body);
    const xs = edge.map(([x]) => x);
    const from = -(Math.max(...xs) + 1);
    const to = W - Math.min(...xs);
    const t = (to - from) * pace;
    return {
      body: path(body),
      edge: path(edge),
      style: {
        "--from": `${from}px`,
        "--to": `${to}px`,
        "--n": to - from,
        "--t": `${t}s`,
        "--d": `${(t * from) / (to - from)}s`,
      } as Vars,
    };
  };
  const clouds = [
    cloud([[46, 9, 3], [50, 7.5, 4], [54, 9, 3]], 1),
    cloud([[118, 18, 2.5], [121, 17, 3], [124, 18, 2.5]], 1.4),
  ];

  return (
    <div className={`scene art relative aspect-[160/56] overflow-hidden bg-sky ${className}`}>
      <svg
        aria-hidden
        viewBox={`0 0 ${W} ${H}`}
        shapeRendering="crispEdges"
        className="absolute inset-0 size-full"
      >
        {/* The sky: sun by day; moon and a few stars by night. */}
        <g className="day-only fill-sun">
          <path d={path(blob([[132, 12, 5.5]]))} />
        </g>
        <g className="night-only fill-sun">
          <path
            d={path(
              blob([[132, 12, 5.5]]).filter(
                ([x, y]) => (x + 0.5 - 135) ** 2 + (y + 0.5 - 10) ** 2 > 22,
              ),
            )}
          />
          {stars.map(([x, y], i) => (
            <path key={i} d={path([[x, y]])} className={`fill-line ${i % 3 === 0 ? "twinkle" : ""}`} style={{ "--d": `${-i * 1.3}s` } as Vars} />
          ))}
        </g>
        {clouds.map(({ body, edge, style }, i) => (
          <g key={i} className="drift" style={style}>
            <path d={body} className="fill-sky" />
            <path d={edge} className="fill-line" />
          </g>
        ))}

        {/* Two ranges of hills with pines on them. */}
        <path d={skyline(far, H)} className="fill-far" />
        {farPines.map((x) => (
          <Pine key={x} rows={PINES.s} x={x} tops={far} fill="fill-near" />
        ))}
        <path d={skyline(near, H)} className="fill-near" />
        {nearPines.map(([size, x]) => (
          <Pine key={x} rows={PINES[size]} x={x} tops={near} fill="fill-fore" />
        ))}

        {/* The wind you can see: streaks on the ambient clock, and faster
            ones that only show during a gust someone sent. */}
        <g className="fill-line">
          {[
            [8, 7, 0],
            [22, 10, -30],
            [31, 5, 25],
          ].map(([y, len, x]) => (
            <g key={y} className="streak" style={{ "--x": x } as Vars}>
              <path d={`M-20 ${y}h${len}v1h${-len}z`} />
            </g>
          ))}
          {[
            [6, 9, 0],
            [15, 6, 300],
            [24, 11, 120],
            [34, 7, 450],
            [42, 5, 220],
          ].map(([y, len, d]) => (
            <g key={y} className="gust-streak" style={{ "--d": `${d}ms` } as Vars}>
              <path d={`M-20 ${y}h${len}v1h${-len}z`} />
            </g>
          ))}
        </g>

        {/* The ground, its grass, the windsock and the big tree. */}
        <g className="fill-fore">
          <path d={`M0 ${GROUND}H${W}V${H}H0z`} />
          {tufts.map(([x, rows]) => (
            <Sway key={x} x={x}>
              <path d={path(sprite(rows, x, GROUND - 2)["#"])} />
            </Sway>
          ))}
          <path d={path(Array.from({ length: 15 }, (_, i): Cell => [150, 34 + i]))} />
          <path d={path(trunk)} />
        </g>
        <g className="sock-limp" style={{ "--x": 150 } as Vars}>
          <path d={path(limp.s)} className="fill-sky" />
          <path d={path(limp.f)} className="fill-fore" />
        </g>
        <g className="sock-full" style={{ "--x": 150 } as Vars}>
          <path d={path(full.s)} className="fill-sky" />
          <path d={path(full.f)} className="fill-fore" />
        </g>

        <g className="shake">
          <Sway x={TREE_X} peak>
            <path d={path(canopy.filter((c) => c[1] >= crownTop))} className="fill-fore" />
            <path d={path(canopy.filter((c) => c[1] >= crownTop && lit(c)))} className="fill-accent" />
            <Sway x={TREE_X}>
              <path d={path(canopy.filter((c) => c[1] < crownTop))} className="fill-fore" />
              <path d={path(canopy.filter((c) => c[1] < crownTop && lit(c)))} className="fill-accent" />
            </Sway>
          </Sway>
        </g>
        <g className="fill-accent">
          {LEAVES.map(([x, y, dx, dy, d]) => (
            <path
              key={x}
              d={path([[x, y]])}
              className="leaf"
              style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, "--d": `${d}ms` } as Vars}
            />
          ))}
          {[
            [24, 29],
            [33, 33],
          ].map(([x, y]) => (
            <path key={x} d={path([[x, y]])} className="blown" style={{ "--x": x } as Vars} />
          ))}
        </g>
      </svg>

      {labels && (
        <>
          <PixelButton action="theme" label={labels.sky} className="scene-button" style={{ "--cx": 132, "--cy": 12, "--w": 16, "--h": 16 } as Vars} />
          <PixelButton action="shake" label={labels.tree} className="scene-button" style={{ "--cx": 28, "--cy": 35, "--w": 22, "--h": 26 } as Vars} />
          <PixelButton action="gust" label={labels.windsock} className="scene-button" style={{ "--cx": 152, "--cy": 41, "--w": 12, "--h": 16 } as Vars} />
        </>
      )}
    </div>
  );
}
