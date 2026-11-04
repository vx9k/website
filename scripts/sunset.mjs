// Draws the pixel-art horizon under the intro: the sun going down over the
// Río de la Plata, seen from Montevideo's rambla, with the Cerro on the
// horizon to the left. Every pixel is placed here, in one 25-colour
// palette, and written as an indexed PNG at its real size (480 by 90); the
// page scales it by whole numbers only, so every pixel stays square and the
// same size. Run it after changing anything below:
//
//   node scripts/sunset.mjs
//
// It writes public/sunset/horizon.png (the page) and src/assets/sunset-og.png
// (a 400 by 90 crop at three times the size, for the share image).

import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const W = 480;
const H = 90;
const HORIZON = 60; // first row of water
const SUN = { x: 262, y: HORIZON + 3, r: 13 };

// ------------------------------------------------------------- palette
// The page's background is the first colour, so the scene's top and bottom
// dither into the page with no edge. Then the sky from dusk blue down to
// the gold at the horizon, the sun, the clouds, the land and the water.
const palette = {
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
  cloudShade: "#61394f",
  cloudPink: "#98505a",
  cloudLit: "#d46c4e",
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

const px = new Uint8Array(W * H);
const set = (x, y, name) => {
  if (x >= 0 && x < W && y >= 0 && y < H) px[y * W + x] = ix[name];
};
const get = (x, y) => names[px[y * W + x]];

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

// ------------------------------------------------------------------ sky
const sky = ["page", "sky1", "sky2", "sky3", "sky4", "sky5", "sky6", "sky7", "sky8", "sky9"];
for (let y = 0; y < HORIZON; y++) {
  for (let x = 0; x < W; x++) {
    const t = y / (HORIZON - 1);
    // The sky is lighter around the sun, more so near the horizon, so the
    // bands arc over it.
    const dx = (x - SUN.x) / 120;
    const glow = 0.3 * Math.exp(-dx * dx) * t * t;
    const level = Math.pow(Math.min(1, t + glow), 1.55) * (sky.length - 1);
    // The first band dithers across its whole height, so the sky comes out
    // of the page gradually instead of starting on a line.
    set(x, y, band(sky, level, x, y, level < 1 ? 1 : 0.34));
  }
}

// A halo two pixels wide around the sun's disc, where the sky is brightest.
for (let y = SUN.y - SUN.r - 3; y < HORIZON; y++) {
  for (let x = SUN.x - SUN.r - 3; x <= SUN.x + SUN.r + 3; x++) {
    const d = Math.hypot(x - SUN.x, y - SUN.y);
    if (d <= SUN.r + 0.5) set(x, y, "sun");
    else if (d <= SUN.r + 2.2 && threshold(x, y) < 0.75) set(x, y, "halo");
  }
}

// --------------------------------------------------------------- clouds
// Long, thin stratus, lit from below by a sun that's already low. Each
// cloud is a stack of rows, top to bottom, each a list of [from, to]
// spans. The lowest pixel of each column takes the light; higher ones the
// body colour, warmer the closer the cloud is to the sun.
const clouds = [
  // Low, across the top of the sun: dark against the glow, gold beneath.
  {
    y: 39,
    rows: [
      [[247, 255]],
      [[241, 261], [279, 285]],
      [[226, 268], [275, 290]],
      [[214, 297]],
      [[203, 251], [256, 310]],
      [[219, 241], [264, 294]],
    ],
  },
  // Low and small, far right.
  {
    y: 46,
    rows: [
      [[390, 397]],
      [[379, 403], [410, 414]],
      [[368, 420]],
      [[359, 396], [403, 427]],
    ],
  },
  // Low and small, over the Cerro.
  {
    y: 37,
    rows: [
      [[134, 141]],
      [[124, 149], [158, 162]],
      [[114, 166]],
      [[106, 137], [144, 170]],
    ],
  },
  // High on the left: a long streak, catching pink light.
  {
    y: 20,
    rows: [
      [[94, 103], [133, 138]],
      [[84, 112], [125, 146]],
      [[66, 158]],
      [[52, 172], [179, 186]],
      [[44, 98], [105, 195]],
      [[62, 85], [120, 168]],
    ],
  },
  // High on the right, thinner.
  {
    y: 13,
    rows: [
      [[341, 356]],
      [[326, 368], [377, 386]],
      [[312, 398], [403, 409]],
      [[301, 424], [431, 442]],
      [[325, 352], [362, 411]],
    ],
  },
];

for (const c of clouds) {
  const near = (x) => Math.exp(-(((x - SUN.x) / 100) ** 2));
  const low = c.y > 32; // low clouds sit in the warm sky
  const cover = new Map(); // x -> the rows covered in that column
  c.rows.forEach((spans, r) => {
    for (const [a, b] of spans) {
      for (let x = a; x <= b; x++) {
        if (!cover.has(x)) cover.set(x, []);
        cover.get(x).push(r);
      }
    }
  });
  for (const [x, rows] of cover) {
    const n = near(x);
    const bottom = Math.max(...rows);
    const top = Math.min(...rows);
    for (const r of rows) {
      let name;
      if (low) {
        // Seen against the light: a dark body with a lit underside.
        if (r === bottom) name = n > 0.6 ? "cloudHot" : "cloudRim";
        else if (r === bottom - 1) name = n > 0.6 ? "cloudRim" : "cloudWarm";
        else if (r === bottom - 2) name = "cloudWarm";
        else name = "cloudDark";
      } else {
        // High enough to still catch the sun: pink, shaded on top.
        if (r === bottom) name = n > 0.5 ? "cloudRim" : "cloudLit";
        else if (r === top && bottom - top > 2) name = "cloudShade";
        else name = "cloudPink";
      }
      set(x, c.y + r, name);
    }
  }
}

// ----------------------------------------------------------------- land
// The Cerro across the bay: a low hill with the fortress and its
// lighthouse on top, and the coast running off to the left.
const cerro = { x: 176, half: 34, h: 7 };
for (let x = cerro.x - cerro.half; x <= cerro.x + cerro.half; x++) {
  const u = (x - cerro.x) / cerro.half;
  // A little steeper on the bay side.
  const k = u < 0 ? 1 - u * u : 1 - Math.pow(Math.abs(u), 1.6);
  const h = Math.round(cerro.h * Math.max(0, k));
  for (let y = HORIZON - h; y < HORIZON; y++) set(x, y, "land");
}
for (let x = 104; x < cerro.x - cerro.half + 4; x++) set(x, HORIZON - 1, "land");
for (let x = 126; x < cerro.x - cerro.half + 2; x++) set(x, HORIZON - 2, "land");
// The fortress and the lighthouse.
for (let x = cerro.x - 3; x <= cerro.x + 3; x++) set(x, HORIZON - cerro.h - 1, "land");
for (let x = cerro.x - 2; x <= cerro.x + 2; x++) set(x, HORIZON - cerro.h - 2, "land");
set(cerro.x, HORIZON - cerro.h - 3, "land");
set(cerro.x, HORIZON - cerro.h - 4, "land");
set(cerro.x, HORIZON - cerro.h - 5, "cloudHot"); // the light

// ---------------------------------------------------------------- water
// The river is silty and brown, so it's warm and dark, lighter at the
// horizon and darker towards the shore, where it meets the page.
const water = ["water0", "water1", "water2", "water3", "water4", "page"];
for (let y = HORIZON; y < H; y++) {
  const r = y - HORIZON;
  for (let x = 0; x < W; x++) {
    const level = Math.pow(r / (H - HORIZON - 1), 0.8) * (water.length - 1);
    set(x, y, band(water, level, x, y, 0.3));
  }
}

// A small seeded generator, so the ripples are the same on every run.
let seed = 0x5eed;
const rand = () => {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) % 10000) / 10000;
};

// A light step for a ripple on each water colour: a ripple is the sky's
// light caught on the back of a wave, one or two steps lighter.
const lift = {
  water0: "sky6",
  water1: "cloudWarm",
  water2: "water0",
  water3: "water1",
  water4: "water2",
  page: "water3",
};

// Where the sun meets the water: a bright line under the disc.
for (let x = SUN.x - SUN.r + 1; x <= SUN.x + SUN.r - 1; x++) set(x, HORIZON, "sun");
for (let x = SUN.x - SUN.r - 4; x <= SUN.x + SUN.r + 4; x++) {
  if (Math.abs(x - SUN.x) > SUN.r - 1) set(x, HORIZON, "halo");
}

// The sun's path: a narrow column of broken dashes on every other row,
// white-gold near the horizon and in the middle, orange at its edges,
// opening up a little towards the shore.
for (let y = HORIZON + 2; y < H - 2; y += 2) {
  const r = (y - HORIZON) / (H - HORIZON);
  const half = Math.round(SUN.r * 0.8 + r * 12);
  let x = SUN.x - half + Math.floor(rand() * 3);
  while (x < SUN.x + half) {
    const len = 2 + Math.floor(rand() * (4 + r * 5));
    const gap = 1 + Math.floor(rand() * (2 + r * 4));
    for (let i = 0; i < len && x + i <= SUN.x + half; i++) {
      const d = Math.abs(x + i - SUN.x) / half;
      const name = d < 0.3 && r < 0.4 ? "sun" : d < 0.55 && r < 0.7 ? "sky9" : d < 0.8 ? "sky8" : "sky7";
      set(x + i, y, name);
    }
    x += len + gap;
  }
}

// Ripples across the rest of the water, sparser away from the sun.
for (let y = HORIZON + 1; y < H - 2; y += 2) {
  const r = (y - HORIZON) / (H - HORIZON);
  for (let x = 0; x < W; ) {
    const dist = Math.abs(x - SUN.x) / W;
    const len = 2 + Math.floor(rand() * (2 + r * 8));
    if (rand() < 0.16 - dist * 0.12 && Math.abs(x - SUN.x) > 12) {
      for (let i = 0; i < len; i++) {
        const here = get(Math.min(W - 1, x + i), y);
        if (lift[here]) set(x + i, y, lift[here]);
      }
    }
    x += len + 2 + Math.floor(rand() * 10);
  }
}

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

// An indexed PNG: one palette entry per colour, one byte per pixel.
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
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function write(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
  console.log(`${path.slice(root.length + 1)}: ${data.length} bytes`);
}

write(join(root, "public/sunset/horizon.png"), png(W, H, (x, y) => px[y * W + x]));

// The share image is 1200 wide: the middle 400 pixels at three times.
const OG = { scale: 3, from: SUN.x - 230, width: 400 };
write(
  join(root, "src/assets/sunset-og.png"),
  png(OG.width * OG.scale, H * OG.scale, (x, y) => px[Math.floor(y / OG.scale) * W + OG.from + Math.floor(x / OG.scale)]),
);
