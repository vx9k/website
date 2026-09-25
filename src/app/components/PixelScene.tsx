import { fill, Pixels, random, ridge } from "../pixel";
import SceneControls, { type SceneText } from "./SceneControls";

// A pixel-art mountain range, generated at build time from a seed and
// shipped as a handful of SVG paths. Each grid cell is one pixel in the
// viewBox; crispEdges keeps them square at any size. Night shows a moon,
// stars and a lit cabin; day shows the sun. Colours come from the
// Dustbyte tokens in globals.css.
//
// With `text`, the sun/moon and the cabin become buttons (SceneControls):
// tap the sky's disc to switch day and night, tap the cabin for its light.

const W = 200;
const H = 72;

const PINE = ["..#..", "..#..", ".###.", ".###.", "#####", "#####", "..#.."];
const PINE_SMALL = ["..#..", ".###.", ".###.", "#####", "..#.."];
const CABIN = [".....#.", "...#.#.", "..####.", ".#####.", ".##.##.", ".#####."];
const CABIN_WINDOW = [3, 4];
const CABIN_CHIMNEY = 5;
const BIRD_UP = ["#.#", ".#."];
const BIRD_DOWN = [".#.", "#.#"];

export default function PixelScene({
  seed = 7,
  className = "",
  text,
}: {
  seed?: number;
  className?: string;
  text?: SceneText;
}) {
  const rand = random(seed);

  const far = ridge(rand, W, { base: 50, height: 30, peaks: 5 });
  const mid = ridge(rand, W, { base: 60, height: 20, peaks: 7 });
  // The near range is the page's own colour, so it must always sit below
  // the middle one or its outline would vanish into the sky.
  const near = ridge(rand, W, { base: 69, height: 7, peaks: 9 }).map((y, x) =>
    Math.max(y, mid[x] + 4),
  );

  // Snow on the highest summits, with a ragged lower edge.
  const summit = Math.min(...far);
  const snowline = summit + 7;
  const snow = new Pixels();
  far.forEach((y, x) => {
    if (y >= snowline) return;
    const depth = Math.min(snowline - y, 2 + Math.floor(rand() * 3));
    for (let r = y; r < y + depth; r++) snow.set(x, r);
  });

  // The sun (or moon) sits in the lowest saddle of the far ridge, right of
  // centre, so it can sink behind the ridge when day and night swap.
  let cx = Math.round(W * 0.6);
  for (let x = cx; x < W * 0.82; x++) if (far[x] > far[cx]) cx = x;
  const cy = far[cx] - 5;
  const R = 8;
  const sun = new Pixels();
  const sunGlow = new Pixels();
  const moon = new Pixels();
  const moonGlow = new Pixels();
  for (let y = cy - R - 5; y <= cy + R; y++) {
    for (let x = cx - R - 5; x <= cx + R + 5; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= R) sun.set(x, y);
      // Dithered glow: a checkerboard that thins out with distance.
      else if (d <= R + 2.5 && (x + y) % 2 === 0) sunGlow.set(x, y);
      else if (d <= R + 5 && x % 2 === 0 && y % 2 === 0) sunGlow.set(x, y);
      if (d <= R - 2) moon.set(x, y);
      else if (d <= R + 1 && x % 2 === 0 && y % 2 === 0) moonGlow.set(x, y);
    }
  }
  const craters = new Pixels();
  craters.sprite(cx - 3, cy - 3, ["##.....", "#......", ".....#.", "..#....", "....##.", "....##."]);

  // Stars in the open sky, clear of the disc and its glow.
  const stars = new Pixels();
  const twinkles: [number, number][] = [];
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(rand() * W);
    const y = Math.floor(rand() * (H - 10));
    if (y > far[x] - 4 || Math.hypot(x - cx, y - cy) < R + 8) continue;
    if (i % 9 === 0) twinkles.push([x, y]);
    else stars.set(x, y);
  }

  // Pines and one cabin along the near ridge, placed where they stay
  // below the middle range and so read as silhouettes against it.
  const fits = (x: number, w: number, h: number) =>
    x + w <= W &&
    near.slice(x, x + w).every((y) => y === near[x]) &&
    mid.slice(x, x + w).every((m) => m < near[x] - h - 1);
  const front = fill(near, H);
  let cabin: [number, number] | null = null;
  for (let x = Math.round(W * 0.22); x < W * 0.5 && !cabin; x++) {
    if (fits(x, CABIN[0].length, CABIN.length + 3)) {
      cabin = [x, near[x] - CABIN.length];
      front.sprite(x, near[x] - CABIN.length, CABIN);
    }
  }
  for (let x = 2; x < W - 5; x++) {
    if (cabin && x > cabin[0] - 6 && x < cabin[0] + 9) continue;
    const tree = rand() < 0.5 ? PINE : PINE_SMALL;
    if (rand() < 0.3 && fits(x, 5, tree.length)) {
      front.sprite(x, near[x] - tree.length, tree);
      x += 4 + Math.floor(rand() * 5);
    }
  }

  const flock = new Pixels();
  const flockAlt = new Pixels();
  const birds = [
    [0, 0],
    [6, 3],
    [11, 1],
  ];
  for (const [bx, by] of birds) {
    flock.sprite(bx, by, BIRD_UP);
    flockAlt.sprite(bx, by, BIRD_DOWN);
  }

  return (
    <div className={`scene relative w-full ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        shapeRendering="crispEdges"
        aria-hidden
        focusable="false"
        className="pixel-scene pointer-events-none absolute inset-0 size-full"
      >
        <g className="px-night">
          <path className="px-star" d={stars.path()} />
          {twinkles.map(([x, y], i) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              className="px-star px-twinkle"
              style={{ ["--n" as string]: i }}
            />
          ))}
          <g transform={`translate(${Math.round(W * 0.3)} 6)`}>
            <path className="px-meteor" d="M0 0h1v1h-1zM-1 -1h1v1h-1zM-2 -2h1v1h-1z" />
          </g>
        </g>
        <g className="px-disc">
          <g className="px-day">
            <path className="px-sun-glow" d={sunGlow.path()} />
            <path className="px-sun" d={sun.path()} />
          </g>
          <g className="px-night">
            <path className="px-moon-glow" d={moonGlow.path()} />
            <path className="px-moon" d={moon.path()} />
            <path className="px-crater" d={craters.path()} />
          </g>
        </g>
        <path className="px-far" d={fill(far, H).path()} />
        <path className="px-snow" d={snow.path()} />
        <g transform={`translate(${Math.round(W * 0.12)} ${Math.max(6, summit - 6)})`}>
          <g className="px-flock">
            <path className="px-bird" d={flock.path()} />
            <path className="px-bird px-bird-alt" d={flockAlt.path()} />
          </g>
        </g>
        <path className="px-mid" d={fill(mid, H).path()} />
        {cabin && (
          <g className="px-smoke">
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x={cabin[0] + CABIN_CHIMNEY}
                y={cabin[1] - 1}
                width={1}
                height={1}
              />
            ))}
          </g>
        )}
        <path className="px-near" d={front.path()} />
        {cabin && (
          <rect
            x={cabin[0] + CABIN_WINDOW[0]}
            y={cabin[1] + CABIN_WINDOW[1]}
            width={1}
            height={1}
            className="px-window"
          />
        )}
      </svg>
      {text && (
        <SceneControls
          text={text}
          disc={{ x: cx + 0.5, y: cy + 0.5, w: 2 * R + 2, h: 2 * R + 2 }}
          cabin={
            cabin && {
              x: cabin[0] + CABIN[0].length / 2,
              y: cabin[1] + CABIN.length / 2,
              w: CABIN[0].length + 4,
              h: CABIN.length + 4,
            }
          }
        />
      )}
    </div>
  );
}
