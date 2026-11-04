// Draws the pixel art for the site: the sun going down behind Cerro Pan de
// Azúcar, in Maldonado, seen from the east across the plains, with the
// 35-metre cross on its summit; and the site's mark, the cross against the
// sun, used as the favicon. Every pixel is placed here, in one palette,
// and written as indexed PNGs (and an SVG for the favicon) at their real
// size; the page scales them by whole numbers only, so every pixel stays
// square and the same size.
//
// The scene is 480 by 300 pixels, in layers the page moves in CSS
// (.scene in globals.css):
//
//   sky.png          the sky, opaque, static
//   sun.png          the sun and its halo; sets behind the hill on load
//   clouds-far.png   high clouds lit pink; drift slowly, and wrap
//   clouds-near.png  low clouds, dark with gold rims; drift faster
//   land.png         the Cerro and the cross, the plains, their tree lines
//                    and the fence
//   grass.png        four frames of the tall grass in front, stacked; the
//                    page steps through them so it sways
//   birds.png        two frames of a tero's wingbeat
//
// It also writes src/components/site/scene.json (the layers' positions,
// for Horizon.tsx), src/components/site/mark.json (the mark's pixels, for
// Mark.tsx), src/app/icon.svg and src/app/apple-icon.png (the mark), and
// src/assets/scene-og.png (a crop of the still scene at three times its
// size, for the share image). Run it after changing anything:
//
//   node scripts/sunset.mjs   (--preview=<file.png> also writes a still frame)

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const W = 480;
const H = 300;
const HORIZON = 210; // first row of the plains
const SUN = { x: 394, y: 178, r: 12 }; // half behind the Cerro's north slope

// The Cerro: a broad granite dome rising alone from the plains, its south
// flank (left, looking west) a little gentler than its north. It's about
// 400 m high and the cross 35 m, so the cross is drawn at about a tenth
// of the hill's height, a pixel or so taller so it reads.
const CERRO = { x: 345, h: 46, left: 118, right: 100 };
const CROSS = { h: 6, arm: 2, armAt: 2 }; // arms two pixels each side, two rows down

// ------------------------------------------------------------- palette
// Index 0 is transparent, for the layers. The page's background comes
// next, so the scene's top and bottom meet the page with no edge.
const palette = {
  clear: "#000000",
  page: "#0e0f16",
  sky1: "#151724",
  sky2: "#1d2033",
  sky3: "#2b2b45",
  sky4: "#463855",
  sky5: "#70455b",
  sky6: "#a15459",
  sky7: "#cd6d4b",
  sky8: "#ea9450",
  sky9: "#f5bd69",
  sky10: "#fadc9c",
  sun: "#fff2cf",
  halo: "#fcdc98",
  cloudDark: "#2c2236",
  cloudWarm: "#6e3f4e",
  cloudShade: "#5d3b52",
  cloudPink: "#9d5360",
  cloudSalmon: "#c96b5a",
  cloudRim: "#ea9450",
  cloudHot: "#f8cf88",
  haze: "#7a4a58",
  hill: "#22192a",
  hillDark: "#1a1421",
  hillRock: "#2e2236",
  rim: "#5e3646",
  rimHot: "#b45d4e",
  field0: "#6a3f49",
  field1: "#4b3141",
  field2: "#352737",
  field3: "#271f2e",
  field4: "#1b1722",
  hedge: "#2a1c2a",
  hedgeLit: "#3b2735",
  wire: "#5a4049",
  wireLit: "#a8614f",
  post: "#130f18",
  blade: "#100d15",
  tip: "#6c3c45",
  tipLit: "#c9734c",
  // The mark's own colours, which have to read at 16 pixels.
  markSky: "#1d2033",
  markDusk: "#70455b",
  markEmber: "#cd6d4b",
  markGold: "#f5bd69",
};
const names = Object.keys(palette);
const ix = Object.fromEntries(names.map((n, i) => [n, i]));

/** A layer: a grid of palette indices, transparent until drawn on. */
function layer(w, h) {
  const px = new Uint8Array(w * h);
  return {
    w,
    h,
    px,
    set(x, y, name) {
      if (x >= 0 && x < w && y >= 0 && y < h) px[y * w + x] = ix[name];
    },
    get(x, y) {
      return names[px[y * w + x]];
    },
  };
}

// 4x4 ordered dither: thresholds 1/32 to 31/32.
const bayer = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
const threshold = (x, y) => (bayer[y & 3][x & 3] + 0.5) / 16;

// Bands are solid with a narrow dithered seam between neighbours, the way
// a pixel artist would hand-dither a sky, instead of dithering everything.
function band(list, level, x, y, seam = 0.34) {
  const i = Math.max(0, Math.min(list.length - 1, Math.floor(level)));
  if (i >= list.length - 1) return list[list.length - 1];
  const f = level - i;
  const t = Math.min(1, Math.max(0, (f - 0.5) / seam + 0.5));
  return t > threshold(x, y) ? list[i + 1] : list[i];
}

// A small seeded generator, so every run draws the same picture.
function random(seed) {
  let s = seed;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

// ------------------------------------------------------------------ sky
// Night at the top, then the warm bands packed into the rows above the
// horizon, arcing over the sun, where the sky is lighter.
const sky = layer(W, HORIZON);
const skyBands = ["page", "sky1", "sky2", "sky3", "sky4", "sky5", "sky6", "sky7", "sky8", "sky9", "sky10"];
for (let y = 0; y < HORIZON; y++) {
  for (let x = 0; x < W; x++) {
    const t = y / (HORIZON - 1);
    const dx = (x - SUN.x) / 120;
    const glow = 0.13 * Math.exp(-dx * dx) * t ** 4;
    const level = Math.min(1, t + glow) ** 3 * (skyBands.length - 1);
    // The first band dithers across its whole height, so the sky comes out
    // of the page gradually instead of starting on a line.
    sky.set(x, y, band(skyBands, level, x, y, level < 1 ? 1 : 0.34));
  }
}

// The evening's first stars, in the dark sky only. The page draws them,
// dim, so they can twinkle.
const rs = random(0x57a2);
const stars = [];
while (stars.length < 16) {
  const x = 8 + Math.floor(rs() * (W - 16));
  const y = 30 + Math.floor(rs() * 70);
  if (stars.some((s) => Math.abs(s.x - x) < 22 && Math.abs(s.y - y) < 12)) continue;
  stars.push({ x, y, bright: stars.length < 3 });
}

// ------------------------------------------------------------------ sun
// The whole disc and a dithered halo two pixels wide, on their own layer
// so it can set; the hill in front hides what's behind it, and the page
// cuts the disc off at the horizon (scene.json's sun.clip).
const SUN_BOX = { x: SUN.x - SUN.r - 3, y: SUN.y - SUN.r - 3, w: SUN.r * 2 + 7, h: SUN.r * 2 + 7 };
const sun = layer(SUN_BOX.w, SUN_BOX.h);
for (let y = 0; y < sun.h; y++) {
  for (let x = 0; x < sun.w; x++) {
    const gx = SUN_BOX.x + x;
    const gy = SUN_BOX.y + y;
    const d = Math.hypot(gx - SUN.x, gy - SUN.y);
    if (d <= SUN.r + 0.5) sun.set(x, y, "sun");
    else if (d <= SUN.r + 2.2 && threshold(gx, gy) < 0.75) sun.set(x, y, "halo");
  }
}

// --------------------------------------------------------------- clouds
// Long, thin stratus. Each cloud is a stack of rows, top to bottom, each a
// list of [from, to] spans; spans wrap around the layer's edges, so a
// layer can be tiled and drifted forever. The lowest pixel of each column
// takes the light.
function clouds(top, height, list, paint) {
  const out = layer(W, height);
  for (const c of list) {
    const cover = new Map();
    c.rows.forEach((spans, r) => {
      for (const [a, b] of spans) {
        for (let x = a; x <= b; x++) {
          const wx = ((x % W) + W) % W;
          if (!cover.has(wx)) cover.set(wx, []);
          cover.get(wx).push(r);
        }
      }
    });
    for (const [x, rows] of cover) {
      const bottom = Math.max(...rows);
      const first = Math.min(...rows);
      for (const r of rows) out.set(x, c.y - top + r, paint(r, first, bottom));
    }
  }
  return out;
}

// High clouds, still in the sun: pink, shaded on top, gold beneath.
const FAR = { y: 116, h: 22 };
const far = clouds(
  FAR.y,
  FAR.h,
  [
    { y: 118, rows: [[[94, 103], [133, 138]], [[84, 112], [125, 146]], [[66, 158]], [[52, 172], [179, 186]], [[44, 98], [105, 195]], [[62, 85], [120, 168]]] },
    { y: 121, rows: [[[341, 356]], [[326, 368], [377, 386]], [[312, 398], [403, 409]], [[301, 424], [431, 442]], [[325, 352], [362, 411]]] },
    { y: 129, rows: [[[462, 471]], [[446, 497], [504, 509]], [[438, 512]], [[452, 470], [480, 505]]] },
    { y: 130, rows: [[[222, 237]], [[211, 256]], [[204, 241], [248, 269]]] },
  ],
  (r, first, bottom) =>
    r === bottom ? "cloudRim" : r === first && bottom - first > 2 ? "cloudShade" : r === first + 1 ? "cloudPink" : "cloudSalmon",
);

// Low clouds, against the light: dark bodies with lit undersides. They
// pass behind the Cerro.
const NEAR = { y: 160, h: 20 };
const near = clouds(
  NEAR.y,
  NEAR.h,
  [
    { y: 166, rows: [[[407, 415]], [[401, 421], [439, 445]], [[386, 428], [435, 450]], [[374, 457]], [[363, 411], [416, 470]], [[379, 401], [424, 454]]] },
    { y: 172, rows: [[[150, 157]], [[139, 163], [170, 174]], [[128, 180]], [[119, 150], [157, 184]]] },
    { y: 162, rows: [[[24, 31]], [[14, 39], [48, 52]], [[4, 56]], [[-4, 27], [34, 60]]] },
  ],
  (r, first, bottom) => (r === bottom ? "cloudHot" : r === bottom - 1 ? "cloudRim" : r === bottom - 2 ? "cloudWarm" : "cloudDark"),
);

// ----------------------------------------------------------------- land
// Everything from the Cerro's summit down: the hill, low hills far off on
// the horizon, the plains, their tree lines and the fence. Opaque below
// the horizon, transparent above it around the hill.
const LAND = { y: HORIZON - CERRO.h - CROSS.h - 1 };
LAND.h = H - LAND.y;
const land = layer(W, LAND.h);
const put = (x, y, name) => land.set(x, y - LAND.y, name);
const at = (x, y) => land.get(x, y - LAND.y);
const rl = random(0x1a4d);

// Low hills far off, hazy, barely above the horizon: the plains are
// mostly flat.
for (let x = 0; x < W; x++) {
  const h = Math.max(0, Math.round(1.6 + 1.4 * Math.sin(x / 23) + 1.1 * Math.sin(x / 9.5 + 1)));
  for (let y = HORIZON - h; y < HORIZON; y++) put(x, y, "haze");
}

// The hill, with its outline nudged a pixel here and there for the rock,
// darker clumps of trees and a few lighter boulders on its flanks, and a
// rim of light along its north side, against the sun.
let wobble = 0;
const top = new Map();
for (let x = CERRO.x - CERRO.left; x <= CERRO.x + CERRO.right; x++) {
  const u = (x - CERRO.x) / (x < CERRO.x ? CERRO.left : CERRO.right);
  const dome = Math.cos((Math.abs(u) * Math.PI) / 2) ** (x < CERRO.x ? 1.25 : 1.05);
  if (rl() < 0.3) wobble = Math.max(-1, Math.min(1, wobble + (rl() < 0.5 ? -1 : 1)));
  const h = Math.max(0, Math.round(CERRO.h * dome + (Math.abs(u) > 0.08 && Math.abs(u) < 0.9 ? wobble : 0)));
  top.set(x, HORIZON - h);
  for (let y = HORIZON - h; y < HORIZON; y++) put(x, y, "hill");
}
for (let i = 0; i < 260; i++) {
  const x = CERRO.x - CERRO.left + Math.floor(rl() * (CERRO.left + CERRO.right));
  const t = top.get(x);
  if (t === undefined || t >= HORIZON - 2) continue;
  const y = t + 1 + Math.floor(rl() * (HORIZON - t - 1));
  const w = 1 + Math.floor(rl() * 3);
  const tone = rl() < 0.8 ? "hillDark" : "hillRock";
  for (let k = 0; k < w; k++) if (at(x + k, y) === "hill") put(x + k, y, tone);
}
for (const [x, t] of top) {
  if (t >= HORIZON) continue;
  if (x > CERRO.x + 2) put(x, t, Math.abs(x - SUN.x) < SUN.r + 10 ? "rimHot" : "rim");
}
// The cross on the summit: concrete, in silhouette, lit on its sun side.
const summit = top.get(CERRO.x);
for (let k = 1; k <= CROSS.h; k++) put(CERRO.x, summit - k, "hill");
for (let k = -CROSS.arm; k <= CROSS.arm; k++) put(CERRO.x + k, summit - CROSS.h + CROSS.armAt, "hill");
put(CERRO.x + CROSS.arm, summit - CROSS.h + CROSS.armAt, "rim");
put(CERRO.x, summit - CROSS.h, "rim");

// The plains, lit warm at the horizon and darker towards the viewer.
// The grass in front covers their last rows and meets the page.
const fields = ["field0", "field1", "field2", "field3"];
for (let y = HORIZON; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const level = Math.min(1, (y - HORIZON) / 70) ** 0.8 * (fields.length - 1);
    put(x, y, band(fields, level, x, y, 0.3));
  }
}
// Windbreaks between the fields, the tree lines of the campo: rows of
// trees with bumpy tops near the horizon, taller the nearer they are,
// with a lit edge where they face the sun.
for (const row of [213, 217, 223, 231]) {
  const r = (row - HORIZON) / 21; // 0 at the horizon, 1 nearest
  for (let x = 0; x < W; ) {
    const len = 10 + Math.floor(rl() * (20 + r * 40));
    if (rl() < 0.6) {
      let h = 1;
      for (let k = 0; k < len && x + k < W; k++) {
        if (rl() < 0.45) h = Math.max(1, Math.min(2 + Math.round(r * 3), h + (rl() < 0.5 ? -1 : 1)));
        for (let j = 0; j < h; j++) put(x + k, row - j, "hedge");
        if (Math.abs(x + k - SUN.x) < 90 && rl() < 0.5) put(x + k, row - h, "hedgeLit");
      }
    }
    x += len + 6 + Math.floor(rl() * (20 + r * 30));
  }
}
// Lit streaks where a field's edge catches the sun.
for (let i = 0; i < 36; i++) {
  const y = 226 + Math.floor(rl() * 22);
  const x = Math.floor(rl() * W);
  const len = 4 + Math.floor(rl() * 20);
  for (let k = 0; k < len; k++) if (x + k < W && at(x + k, y)?.startsWith("field")) put(x + k, y, y < 236 ? "field0" : "field1");
}

// A wire fence across the foreground, its posts closer together and
// smaller as it runs off to the right, two wires catching the light.
const FENCE = { y0: 266, y1: 249 };
const fenceY = (x) => Math.round(FENCE.y0 + ((FENCE.y1 - FENCE.y0) * x) / W);
for (let x = 0; x < W; x++) {
  const y = fenceY(x);
  const lit = Math.abs(x - SUN.x) < 70 ? "wireLit" : "wire";
  put(x, y - 3, lit);
  put(x, y - 6, rl() < 0.85 ? lit : "wire");
}
for (let x = 6; x < W; ) {
  const y = fenceY(x);
  const h = Math.round(9 - (x / W) * 4);
  for (let k = 0; k < h; k++) put(x, y - k, "post");
  if (x < W * 0.4) for (let k = 1; k < h; k++) put(x + 1, y - k, "post");
  x += Math.round(22 - (x / W) * 10);
}

// ---------------------------------------------------------------- grass
// Tall grass in front, in four frames: each blade leans with its own
// phase, so stepping through the frames makes the grass sway. Dark
// blades with their tips lit by the low sun.
const GRASS = { y: 262, h: H - 262, frames: 4 };
const grass = layer(W, GRASS.h * GRASS.frames);
const rg = random(0x9a55);
const blades = [];
for (let x = 0; x < W; x += 1 + Math.floor(rg() * 2)) {
  const near = 1 - x / W; // taller on the left, nearer the viewer
  const clump = Math.sin(x / 7) + Math.sin(x / 2.3 + 1) * 0.5; // grass grows in clumps
  blades.push({ x, h: Math.max(3, Math.round(8 + near * 12 + clump * 4 + rg() * 5)), phase: x / 19 + rg() * 0.8, lit: rg() < 0.35 });
}
for (let f = 0; f < GRASS.frames; f++) {
  const base = f * GRASS.h;
  for (const b of blades) {
    // A gust moves along the grass: the phase follows x, so the frames
    // read as a wave passing through it.
    const lean = Math.round(Math.sin(b.phase + (f * Math.PI) / 2) * 1.3);
    for (let k = 0; k < b.h; k++) {
      const y = GRASS.h - 1 - k;
      const x = b.x + (k > b.h * 0.6 ? lean : k > b.h * 0.3 ? Math.round(lean / 2) : 0);
      const tip = k === b.h - 1 && b.lit;
      grass.set(x, base + y, tip ? (Math.abs(x - SUN.x) < 110 ? "tipLit" : "tip") : "blade");
    }
  }
  // The ground under the grass is solid, and its last rows are the page.
  for (let y = GRASS.h - 6; y < GRASS.h; y++) for (let x = 0; x < W; x++) grass.set(x, base + y, y >= GRASS.h - 3 ? "page" : "blade");
}

// Fireflies over the grass: the page draws and blinks them.
const rf = random(0xf1ef);
const fireflies = [];
while (fireflies.length < 14) {
  const x = 150 + Math.floor(rf() * (W - 160));
  const y = 238 + Math.floor(rf() * 50);
  if (fireflies.some((p) => Math.abs(p.x - x) < 16 && Math.abs(p.y - y) < 8)) continue;
  fireflies.push({ x, y });
}

// --------------------------------------------------------------- sprites
// A tero, the plains' lapwing, in two frames side by side: wings up,
// then down.
const tero = ["X.......X..........", ".XX...XX...........", "...XXX.....XXXXXXX.", "....X.....X..X..X..", "...............X..."];
const birds = layer(19, 5);
tero.forEach((row, y) => [...row].forEach((c, x) => c === "X" && birds.set(x, y, "post")));

// ------------------------------------------------------------------ mark
// The site's mark, on an 18 by 18 grid: the cross on its hill against the
// setting sun, in four bands of dusk. It's the favicon, the Apple icon
// (at 10x) and the mark in the page's header.
const M = 18;
const mark = layer(M, M);
const markBands = ["markSky", "markSky", "markDusk", "markEmber", "markGold"];
for (let y = 0; y < M; y++) {
  for (let x = 0; x < M; x++) {
    mark.set(x, y, markBands[Math.min(markBands.length - 1, Math.floor((y / M) * 1.35 * markBands.length))]);
    if (Math.hypot(x + 0.5 - 9, y + 0.5 - 11) <= 5.2) mark.set(x, y, y >= 11 ? "halo" : "sun");
  }
}
for (let x = 0; x < M; x++) {
  const u = (x + 0.5 - 9) / 9;
  const t = Math.round(12 + 6 * u * u);
  for (let y = t; y < M; y++) mark.set(x, y, "hill");
}
for (let y = 5; y < 12; y++) mark.set(9, y, "hill");
for (let x = 7; x <= 11; x++) mark.set(x, 7, "hill");

// ------------------------------------------------------------------ png
function crc32(buf) {
  let c = ~0;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

// An indexed PNG: one palette entry per colour, one byte per pixel, and
// index 0 transparent.
function png(width, height, pixel) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 3; // indexed colour
  const plte = Buffer.from(names.flatMap((n) => [1, 3, 5].map((i) => parseInt(palette[n].slice(i, i + 2), 16))));
  const raw = Buffer.alloc((width + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width + 1)] = 0;
    for (let x = 0; x < width; x++) raw[y * (width + 1) + 1 + x] = pixel(x, y);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("PLTE", plte),
    chunk("tRNS", Buffer.from([0])),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function write(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
  console.log(`${path.slice(root.length + 1)}: ${data.length} bytes`);
}

const out = (name, l) => write(join(root, "public/scene", name), png(l.w, l.h, (x, y) => l.px[y * l.w + x]));
out("sky.png", sky);
out("sun.png", sun);
out("clouds-far.png", far);
out("clouds-near.png", near);
out("land.png", land);
out("grass.png", grass);
out("birds.png", birds);

// The positions Horizon.tsx needs, in scene pixels.
const scene = {
  width: W,
  height: H,
  horizon: HORIZON,
  focus: CERRO.x,
  sun: { ...SUN_BOX, clip: HORIZON - SUN_BOX.y },
  far: FAR,
  near: NEAR,
  land: { y: LAND.y, h: LAND.h },
  grass: GRASS,
  stars,
  fireflies,
  birds: { y: 144, w: 9, h: 5 },
};
write(join(root, "src/components/site/scene.json"), Buffer.from(JSON.stringify(scene) + "\n"));

// The mark: as runs of one colour per row, for an SVG of a few dozen
// rects (Mark.tsx and the favicon), and at 10x for the Apple icon.
const runs = [];
for (let y = 0; y < M; y++) {
  for (let x = 0; x < M; ) {
    const c = mark.px[y * M + x];
    let n = 1;
    while (x + n < M && mark.px[y * M + x + n] === c) n++;
    runs.push([x, y, n, palette[names[c]]]);
    x += n;
  }
}
write(join(root, "src/components/site/mark.json"), Buffer.from(JSON.stringify({ size: M, runs }) + "\n"));
const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${M} ${M}" shape-rendering="crispEdges">`,
  "<!-- The site's mark: the cross on Cerro Pan de Azúcar against the setting sun. Drawn by scripts/sunset.mjs. -->",
  ...runs.map(([x, y, n, c]) => `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${c}"/>`),
  "</svg>",
].join("\n");
write(join(root, "src/app/icon.svg"), Buffer.from(svg + "\n"));
write(join(root, "src/app/apple-icon.png"), png(M * 10, M * 10, (x, y) => mark.px[Math.floor(y / 10) * M + Math.floor(x / 10)]));

// The still scene, every layer at rest.
const still = layer(W, H);
const paste = (l, ox, oy, rows = l.h) => {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < l.w; x++) {
      const v = l.px[y * l.w + x];
      if (v) still.px[(oy + y) * W + ((ox + x) % W)] = v;
    }
  }
};
paste(sky, 0, 0);
paste(far, 0, FAR.y);
paste(sun, SUN_BOX.x, SUN_BOX.y, HORIZON - SUN_BOX.y);
paste(near, 0, NEAR.y);
paste(land, 0, LAND.y);
paste(grass, 0, GRASS.y, GRASS.h);

// For the share image: 200 by 210 pixels around the Cerro, at three
// times, to fill the right half of 1200 by 630.
const OG = { scale: 3, x: 262, y: 90, w: 200, h: 210 };
write(
  join(root, "src/assets/scene-og.png"),
  png(OG.w * OG.scale, OG.h * OG.scale, (x, y) => still.px[(OG.y + Math.floor(y / OG.scale)) * W + OG.x + Math.floor(x / OG.scale)]),
);
// A full still frame, for checking the drawing by eye; not shipped.
const preview = process.argv.find((a) => a.startsWith("--preview="))?.slice(10);
if (preview) writeFileSync(preview, png(W, H, (x, y) => still.px[y * W + x]));
