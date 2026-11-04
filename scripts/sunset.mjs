// Draws the pixel-art scene behind the page: the sun going down over the
// Río de la Plata, seen from Montevideo's rambla, with the Cerro and its
// lighthouse on the horizon. Every pixel is placed here, in one palette, and
// written as indexed PNGs at their real size; the page scales them by whole
// numbers only, so every pixel stays square and the same size.
//
// The scene is 480 by 300 pixels, in layers so the page can move them in
// CSS (.scene in globals.css):
//
//   sky.png          the sky, opaque, static
//   sun.png          the sun and its halo; settles onto the horizon on load
//   clouds-far.png   high clouds lit pink; drift slowly, and wrap
//   clouds-near.png  low clouds, dark with gold rims; drift faster
//   land.png         the Cerro, the fortress and the lighthouse
//   water.png        four frames of the river, stacked; the page steps
//                    through them so the light glints
//   birds.png        two frames of a gull's wingbeat
//   boat.png         a sailboat far out
//
// It also writes src/components/site/scene.json, the layers' positions for
// Horizon.tsx, and src/assets/sunset-og.png, a crop of the still scene at
// three times its size for the share image. Run it after changing anything:
//
//   node scripts/sunset.mjs   (--preview=<file.png> also writes a still frame)

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const W = 480;
const H = 300;
const HORIZON = 200; // first row of water
const SUN = { x: 262, y: HORIZON + 3, r: 13 };
const CERRO = { x: 192, half: 30, h: 7 };

// ------------------------------------------------------------- palette
// Index 0 is transparent, for the layers. The page's background comes
// next, so the scene's top and bottom dither into the page with no edge.
const palette = {
  clear: "#000000",
  page: "#14110f",
  sky1: "#1a1923",
  sky2: "#232536",
  sky3: "#352f45",
  sky4: "#563b4f",
  sky5: "#874955",
  sky6: "#b65c4f",
  sky7: "#db7a48",
  sky8: "#ee9e52",
  sky9: "#f6c46d",
  sun: "#fff1cc",
  halo: "#fbdc96",
  cloudDark: "#3a2534",
  cloudWarm: "#7c4048",
  cloudShade: "#6a3d52",
  cloudPink: "#a5555b",
  cloudSalmon: "#cf6c58",
  cloudRim: "#ee9e52",
  cloudHot: "#f9d18a",
  land: "#2b1d26",
  water0: "#6e4446",
  water1: "#53363b",
  water2: "#3d2a30",
  water3: "#2b1f24",
  water4: "#1d1719",
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
// Night at the top, then the warm bands packed into the last rows above
// the horizon, below the page's text. The bands arc over the sun, where
// the sky is lighter.
const sky = layer(W, HORIZON);
const skyBands = ["page", "sky1", "sky2", "sky3", "sky4", "sky5", "sky6", "sky7", "sky8", "sky9"];
for (let y = 0; y < HORIZON; y++) {
  for (let x = 0; x < W; x++) {
    const t = y / (HORIZON - 1);
    const dx = (x - SUN.x) / 130;
    const glow = 0.12 * Math.exp(-dx * dx) * t ** 4;
    const level = Math.min(1, t + glow) ** 3 * (skyBands.length - 1);
    // The first band dithers across its whole height, so the sky comes out
    // of the page gradually instead of starting on a line.
    sky.set(x, y, band(skyBands, level, x, y, level < 1 ? 1 : 0.34));
  }
}

// The evening's first stars, in the dark sky only, below the band the
// header can cover. The page draws them, dim enough that text over one
// keeps its contrast (.star in globals.css), so they can twinkle.
const rs = random(0x57a2);
const stars = [];
while (stars.length < 14) {
  const x = 8 + Math.floor(rs() * (W - 16));
  const y = 38 + Math.floor(rs() * 70);
  if (stars.some((s) => Math.abs(s.x - x) < 24 && Math.abs(s.y - y) < 12)) continue;
  stars.push({ x, y, bright: stars.length < 3 });
}

// ------------------------------------------------------------------ sun
// The whole disc and a dithered halo two pixels wide, on their own layer
// so the sun can set onto the horizon; the page cuts it off at the
// horizon (scene.json's sun.clip, in rows from its top).
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
const FAR = { y: 136, h: 22 };
const far = clouds(
  FAR.y,
  FAR.h,
  [
    {
      y: 138,
      rows: [
        [[94, 103], [133, 138]],
        [[84, 112], [125, 146]],
        [[66, 158]],
        [[52, 172], [179, 186]],
        [[44, 98], [105, 195]],
        [[62, 85], [120, 168]],
      ],
    },
    {
      y: 141,
      rows: [
        [[341, 356]],
        [[326, 368], [377, 386]],
        [[312, 398], [403, 409]],
        [[301, 424], [431, 442]],
        [[325, 352], [362, 411]],
      ],
    },
    {
      y: 149,
      rows: [
        [[462, 471]],
        [[446, 497], [504, 509]],
        [[438, 512]],
        [[452, 470], [480, 505]],
      ],
    },
    {
      y: 150,
      rows: [
        [[232, 247]],
        [[221, 266]],
        [[214, 251], [258, 279]],
      ],
    },
  ],
  (r, first, bottom) =>
    r === bottom ? "cloudRim" : r === first && bottom - first > 2 ? "cloudShade" : r === first + 1 ? "cloudPink" : "cloudSalmon",
);

// Low clouds, against the light: dark bodies with lit undersides.
const NEAR = { y: 172, h: 22 };
const near = clouds(
  NEAR.y,
  NEAR.h,
  [
    {
      y: 179,
      rows: [
        [[247, 255]],
        [[241, 261], [279, 285]],
        [[226, 268], [275, 290]],
        [[214, 297]],
        [[203, 251], [256, 310]],
        [[219, 241], [264, 294]],
      ],
    },
    {
      y: 186,
      rows: [
        [[390, 397]],
        [[379, 403], [410, 414]],
        [[368, 420]],
        [[359, 396], [403, 427]],
      ],
    },
    {
      y: 176,
      rows: [
        [[94, 101]],
        [[84, 109], [118, 122]],
        [[74, 126]],
        [[66, 97], [104, 130]],
      ],
    },
  ],
  (r, first, bottom) => (r === bottom ? "cloudHot" : r === bottom - 1 ? "cloudRim" : r === bottom - 2 ? "cloudWarm" : "cloudDark"),
);

// ----------------------------------------------------------------- land
// The Cerro across the bay: a low hill with the fortress and its
// lighthouse on top, and the coast running off to the left.
const LAND = { x: 120, y: HORIZON - CERRO.h - 6, w: 110 };
LAND.h = HORIZON - LAND.y;
const land = layer(LAND.w, LAND.h);
const put = (x, y, name) => land.set(x - LAND.x, y - LAND.y, name);
for (let x = CERRO.x - CERRO.half; x <= CERRO.x + CERRO.half; x++) {
  const u = (x - CERRO.x) / CERRO.half;
  // A little steeper on the bay side.
  const k = u < 0 ? 1 - u * u : 1 - Math.abs(u) ** 1.6;
  const h = Math.round(CERRO.h * Math.max(0, k));
  for (let y = HORIZON - h; y < HORIZON; y++) put(x, y, "land");
}
for (let x = LAND.x; x < CERRO.x - CERRO.half + 4; x++) put(x, HORIZON - 1, "land");
for (let x = LAND.x + 22; x < CERRO.x - CERRO.half + 2; x++) put(x, HORIZON - 2, "land");
// The fortress and the lighthouse; the page flashes its light.
for (let x = CERRO.x - 3; x <= CERRO.x + 3; x++) put(x, HORIZON - CERRO.h - 1, "land");
for (let x = CERRO.x - 2; x <= CERRO.x + 2; x++) put(x, HORIZON - CERRO.h - 2, "land");
put(CERRO.x, HORIZON - CERRO.h - 3, "land");
put(CERRO.x, HORIZON - CERRO.h - 4, "land");
const LIGHT = { x: CERRO.x, y: HORIZON - CERRO.h - 5 };
put(LIGHT.x, LIGHT.y, "cloudHot");

// ---------------------------------------------------------------- water
// The river is silty and brown, so it's warm and dark, lighter at the
// horizon and darker towards the shore, where it meets the page. The
// glints are dashes that each have a phase; in each of the four frames a
// dash is longer, shorter or gone, so stepping through the frames makes
// the light play on the water.
const WATER = { y: HORIZON, h: H - HORIZON, frames: 4 };
const waterBands = ["water0", "water1", "water2", "water3", "water4", "page"];
const base = layer(W, WATER.h);
for (let y = 0; y < WATER.h; y++) {
  for (let x = 0; x < W; x++) {
    const level = (y / (WATER.h - 1)) ** 0.7 * (waterBands.length - 1);
    base.set(x, y, band(waterBands, level, x, y, 0.3));
  }
}

// A ripple is the sky's light caught on the back of a wave: one or two
// steps lighter than the water it's on.
const lift = { water0: "sky6", water1: "cloudWarm", water2: "water0", water3: "water1", water4: "water2", page: "water3" };
const rw = random(0x5eed);
const glints = [];
const rowStep = (y) => (y < 30 ? 2 : 3); // rows sit further apart nearer the shore

// The sun's path: a column of broken dashes, white-gold near the horizon
// and in the middle, orange at its edges, opening towards the shore.
for (let y = 2; y < WATER.h - 4; y += rowStep(y)) {
  const r = y / WATER.h;
  const half = Math.round(SUN.r * 0.8 + r * 26);
  let x = SUN.x - half + Math.floor(rw() * 3);
  while (x < SUN.x + half) {
    const len = 2 + Math.floor(rw() * (3 + r * 8));
    const gap = 1 + Math.floor(rw() * (2 + r * 6));
    const d = Math.abs(x + len / 2 - SUN.x) / half;
    const name = d < 0.3 && r < 0.3 ? "sun" : d < 0.55 && r < 0.55 ? "sky9" : d < 0.8 ? "sky8" : "sky7";
    glints.push({ x, y, len: Math.min(len, SUN.x + half - x), name, phase: rw() * Math.PI * 2 });
    x += len + gap;
  }
}
// Ripples across the rest of the river, sparser away from the sun.
for (let y = 1; y < WATER.h - 3; y += rowStep(y)) {
  const r = y / WATER.h;
  for (let x = 0; x < W; ) {
    const dist = Math.abs(x - SUN.x) / W;
    const len = 2 + Math.floor(rw() * (2 + r * 10));
    if (rw() < 0.17 - dist * 0.12 && Math.abs(x - SUN.x) > 16 + r * 26) {
      glints.push({ x, y, len, name: null, phase: rw() * Math.PI * 2 });
    }
    x += len + 2 + Math.floor(rw() * 12);
  }
}

const water = layer(W, WATER.h * WATER.frames);
for (let f = 0; f < WATER.frames; f++) {
  const top = f * WATER.h;
  for (let y = 0; y < WATER.h; y++) for (let x = 0; x < W; x++) water.set(x, top + y, base.get(x, y));
  // Where the sun meets the water: a bright line under the disc.
  for (let x = SUN.x - SUN.r - 4; x <= SUN.x + SUN.r + 4; x++) {
    water.set(x, top, Math.abs(x - SUN.x) <= SUN.r - 1 ? "sun" : "halo");
  }
  for (const g of glints) {
    const c = Math.cos(g.phase + (f * Math.PI) / 2);
    if (c < -0.45) continue; // this dash is between waves in this frame
    const len = Math.max(1, Math.round(g.len * (0.55 + 0.45 * c)));
    const shift = Math.round((g.len - len) / 2);
    for (let i = 0; i < len; i++) {
      const x = g.x + shift + i;
      if (x < 0 || x >= W) continue;
      const name = g.name ?? lift[base.get(x, g.y)];
      if (name) water.set(x, top + g.y, name);
    }
  }
}

// --------------------------------------------------------------- sprites
// A gull, two frames side by side: wings up, then level.
const gull = ["X.....X..........", ".XX.XX....XXX.XXX", "...X..........X.."];
const birds = layer(17, 3);
gull.forEach((row, y) => [...row].forEach((c, x) => c === "X" && birds.set(x, y, "land")));

// A sailboat far out, its sail lit on the sun's side.
const sail = ["...l...", "...Xl..", "...XXl.", "...XXXl", "...X...", "XXXXXXX", ".XXXXX."];
const boat = layer(7, 7);
sail.forEach((row, y) => [...row].forEach((c, x) => c !== "." && boat.set(x, y, c === "l" ? "sky7" : "land")));
const BOAT = { y: HORIZON - 2, w: 7, h: 7 };

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

const out = (name, l) => write(join(root, "public/sunset", name), png(l.w, l.h, (x, y) => l.px[y * l.w + x]));
out("sky.png", sky);
out("sun.png", sun);
out("clouds-far.png", far);
out("clouds-near.png", near);
out("land.png", land);
out("water.png", water);
out("birds.png", birds);
out("boat.png", boat);

// The positions Horizon.tsx needs, in scene pixels.
const scene = {
  width: W,
  height: H,
  horizon: HORIZON,
  sun: { ...SUN_BOX, clip: HORIZON - SUN_BOX.y },
  far: FAR,
  near: NEAR,
  land: LAND,
  light: LIGHT,
  water: WATER,
  stars,
  birds: { y: 160, w: 8, h: 3 },
  boat: BOAT,
};
write(join(root, "src/components/site/scene.json"), Buffer.from(JSON.stringify(scene) + "\n"));

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
paste(sun, SUN_BOX.x, SUN_BOX.y, HORIZON - SUN_BOX.y);
paste(far, 0, FAR.y);
paste(near, 0, NEAR.y);
paste(land, LAND.x, LAND.y);
paste(water, 0, HORIZON, WATER.h);
paste(boat, 330, BOAT.y);

// For the share image: 400 by 90 pixels around the sun, at three times.
const OG = { scale: 3, x: SUN.x - 230, y: HORIZON - 54, w: 400, h: 90 };
write(
  join(root, "src/assets/sunset-og.png"),
  png(OG.w * OG.scale, OG.h * OG.scale, (x, y) => still.px[(OG.y + Math.floor(y / OG.scale)) * W + OG.x + Math.floor(x / OG.scale)]),
);
// A full still frame, for checking the drawing by eye; not shipped.
const preview = process.argv.find((a) => a.startsWith("--preview="))?.slice(10);
if (preview) writeFileSync(preview, png(W, H, (x, y) => still.px[y * W + x]));
