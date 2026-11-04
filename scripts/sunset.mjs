// Draws the pixel art for the site: Cerro Pan de Azúcar, in Maldonado,
// seen from the east across the plains, with the 35-metre cross on its
// summit, twice: on a sunny day for the light theme and at night for the
// dark one; and the site's mark, the cross close up against the setting
// sun, used as the favicon. Every pixel is placed here and written as
// indexed PNGs (and an SVG for the favicon) at their real size; the page
// scales them by whole numbers only, so every pixel stays square and the
// same size.
//
// Both scenes share one drawing: the hill, the plains and everything on
// them are drawn once, in materials ("hill", "field2", "cross"...), and
// each theme gives the materials its own colours. Only the sky and what's
// in it (the sun, or the moon and the stars) are drawn for each. The
// scene is 480 by 300 pixels, in layers the page moves in CSS (.scene in
// globals.css), written to public/scene/day/ and public/scene/night/:
//
//   sky.png          the sky, opaque, static (at night with the Milky Way
//                    and the faint stars)
//   orb.png          the sun, or the moon, which rises a little on load
//   clouds-far.png   high clouds; drift slowly, and wrap
//   clouds-near.png  low clouds; drift faster
//   land.png         the Cerro and the cross, the sea far off, the plains,
//                    their woods, tree lines, road and windmill, the fence
//   grass.png        four frames of the tall grass in front, stacked; the
//                    page steps through them so it sways
//   wheel.png        four frames of the windmill's wheel turning
//   car.png          a car, facing left and facing right (at night, its
//                    lamps)
//   birds.png        by day, two frames of a tero's wingbeat
//   cows.png         by day, a cow grazing and looking up
//   butterfly.png    by day, a butterfly's wings open and shut
//   bats.png         by night, two frames of a bat's wingbeat
//
// It also writes src/components/site/scene.json (the layers' and sprites'
// positions, for Horizon.tsx), src/components/site/mark.json (the mark's
// pixels, for Mark.tsx), src/app/icon.svg and src/app/apple-icon.png (the
// mark), and src/assets/scene-og.png (a crop of the still night scene at
// three times its size, for the share image). Run it after changing
// anything:
//
//   node scripts/sunset.mjs   (--preview=<prefix> also writes
//                              <prefix>-day.png and <prefix>-night.png,
//                              still frames for checking by eye)

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const W = 480;
const H = 300;
const HORIZON = 210; // first row of the plains
// The sun by day and the moon by night, high in the north-west (low
// enough to show in the phones' window), so the
// light falls on the same side of everything in both.
const ORB = { x: 414, y: 92 };

// The Cerro, seen from the east: a steep granite dome, bare rock at the
// top, with a saddle on its north side (right, looking west) and a lower
// shoulder running on north from it. It's 389 to 423 m high (sources
// differ) and the cross 35 m, so the cross is about a tenth of the hill's
// height, a pixel or so taller so it reads: too small for the ring around
// its crossing, which only the mark shows.
const CERRO = { x: 345, h: 46, left: 82, right: 50 };
// The cross: its arms span about 0.4 of its height, a fifth of the way
// down, and it stands on a stepped base (the photographs).
const CROSS = { h: 6, arm: 1, armAt: 1 };
// A windmill pumping water in the campo, in front of the Cerro's south
// foot, its wheel against the sky.
const MILL = { x: 262, base: 246, top: 208, hub: 202, r: 6 };
const ROAD = 235; // a country road across the plains

// ------------------------------------------------------------- palettes
// Index 0 is transparent, for the layers. "page" is the top of the sky,
// which the page's stage continues above the scene (--stage in
// globals.css); "soil", under the grass, meets the bottom of the screen.
const NIGHT = {
  clear: "#000000",
  page: "#0e0f16",
  sky1: "#11131d",
  sky2: "#141725",
  sky3: "#181c2d",
  sky4: "#1d2236",
  sky5: "#232a41",
  sky6: "#2a324b",
  sky7: "#323b56",
  sky8: "#3b4562",
  starDim: "#4a5170",
  starBright: "#c9cde0",
  orb: "#f2efe2",
  orbShade: "#c9c6b8",
  orbHalo: "#5c6582",
  cloudDark: "#161925",
  cloudWarm: "#1b1f2e",
  cloudShade: "#3b4361",
  cloudPink: "#2c3249",
  cloudSalmon: "#222739",
  cloudRim: "#1a1e2d",
  cloudHot: "#262c42",
  haze: "#191c2b",
  sea: "#1b2339",
  seaLit: "#6c7aa0",
  hill: "#10121c",
  hillDark: "#0c0e16",
  hillRock: "#171a28",
  rim: "#262c45",
  rimHot: "#3d4769",
  cross: "#10121c",
  crossLit: "#3d4769",
  field0: "#1c1f2e",
  field1: "#171a27",
  field2: "#131521",
  field3: "#10121b",
  road: "#1f2232",
  hedge: "#0b0d14",
  hedgeLit: "#1b2033",
  wire: "#262a3a",
  wireLit: "#4b5476",
  post: "#07080c",
  blade: "#090a10",
  tip: "#171b28",
  tipLit: "#2e3550",
  flower: "#2e3550",
  flowerWhite: "#3a4262",
  soil: "#0e0f16",
  mill: "#06070b",
  millLit: "#2a3047",
  tero: "#07080c",
  bat: "#05060a",
  cowBody: "#0b0c12",
  cowFace: "#1a1d29",
  cowDark: "#07080c",
  wing: "#2e3550",
  wingDark: "#1a1e2e",
  carBody: "#0a0b11",
  carGlass: "#0a0b11",
  carWheel: "#050608",
  carLamp: "#fbe7a6",
  carTail: "#d9473a",
  lamp: "#f3c27a",
  // The mark's own colours, the same in both themes: it's the sunset
  // between them, and it has to read at 16 pixels.
  markSky: "#1d2033",
  markDusk: "#70455b",
  markEmber: "#cd6d4b",
  markGold: "#f5bd69",
  markSun: "#fff2cf",
  markHalo: "#fcdc98",
  markHill: "#22192a",
};
const DAY = {
  ...NIGHT,
  page: "#3f7cc2",
  sky1: "#4685c8",
  sky2: "#4f8fce",
  sky3: "#5a9ad4",
  sky4: "#69a6d9",
  sky5: "#7db3de",
  sky6: "#94c1e3",
  sky7: "#aed0e8",
  sky8: "#cae1ed",
  starDim: "#4685c8",
  orb: "#fffbea",
  orbShade: "#fff6d2",
  orbHalo: "#eef1d8",
  cloudDark: "#f7f9fb",
  cloudWarm: "#e6edf3",
  cloudShade: "#ffffff",
  cloudPink: "#f2f6f9",
  cloudSalmon: "#e3eaf1",
  cloudRim: "#cad6e1",
  cloudHot: "#b2c2d2",
  haze: "#9db8c9",
  sea: "#4b84b9",
  seaLit: "#d4e8f4",
  hill: "#5b7646",
  hillDark: "#48613a",
  hillRock: "#a29e93",
  rim: "#7c9758",
  rimHot: "#98b26a",
  cross: "#c9c5bb",
  crossLit: "#f1eee6",
  field0: "#b3c784",
  field1: "#97b864",
  field2: "#79a04a",
  field3: "#5f8838",
  road: "#c4b596",
  hedge: "#3a5a2b",
  hedgeLit: "#5c8a3c",
  wire: "#8c8578",
  wireLit: "#ddd6c6",
  post: "#5c4733",
  blade: "#3d6a2a",
  tip: "#6c9c42",
  tipLit: "#a3c766",
  flower: "#f2d64e",
  flowerWhite: "#f8f6ee",
  soil: "#2e4a22",
  mill: "#6b6862",
  millLit: "#c2bdb2",
  tero: "#3b342e",
  cowBody: "#7a3a22",
  cowFace: "#efe9de",
  cowDark: "#4a2416",
  wing: "#f2c94a",
  wingDark: "#b9802a",
  carBody: "#c84a3a",
  carGlass: "#2b3a4a",
  carWheel: "#1e1e22",
  carLamp: "#c84a3a",
  carTail: "#c84a3a",
};
const names = Object.keys(NIGHT);
const ix = Object.fromEntries(names.map((n, i) => [n, i]));
const THEMES = { day: DAY, night: NIGHT };

/** A layer: a grid of material indices, transparent until drawn on. */
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

/** A sprite from rows of characters, one material per character. */
function sprite(frames, key) {
  const fw = frames[0][0].length;
  const fh = frames[0].length;
  const out = layer(fw * frames.length, fh);
  frames.forEach((rows, f) => rows.forEach((row, y) => [...row].forEach((c, x) => key[c] && out.set(f * fw + x, y, key[c]))));
  return out;
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
// Bands from the top down to the horizon, lighter round the sun or the
// moon. By day the blue pales towards the horizon; by night it stays
// dark, with the Milky Way across it and the faint stars in it.
const skyBands = ["page", "sky1", "sky2", "sky3", "sky4", "sky5", "sky6", "sky7", "sky8"];
function drawSky(theme) {
  const day = theme === "day";
  const sky = layer(W, HORIZON);
  const top = skyBands.length - 1;
  for (let y = 0; y < HORIZON; y++) {
    for (let x = 0; x < W; x++) {
      const t = y / (HORIZON - 1);
      const d = Math.hypot(x - ORB.x, (y - ORB.y) * 1.3);
      const glow = (day ? 1.5 : 1.7) * Math.exp(-((d / (day ? 42 : 34)) ** 2));
      // The Milky Way: a soft band from high on the left down towards the
      // right, a band lighter at its middle.
      const milky = day ? 0 : Math.max(0, 1 - Math.abs(y - (0.33 * x - 6)) / 16) * 1.1;
      const level = (day ? t ** 1.45 : t ** 2.3) * top + glow + milky;
      sky.set(x, y, band(skyBands, level, x, y, level < 1 ? 1 : 0.34));
    }
  }
  if (!day) {
    const rs = random(0x5a17);
    for (let i = 0; i < 170; i++) {
      const inBand = i >= 110;
      const x = Math.floor(rs() * W);
      const y = inBand ? Math.round(0.33 * x - 6 + (rs() - 0.5) * 24) : Math.floor(rs() * 175);
      if (y < 0 || y >= HORIZON - 12 || Math.hypot(x - ORB.x, y - ORB.y) < 16) continue;
      sky.set(x, y, "starDim");
    }
  }
  return sky;
}

// The stars that twinkle, by night: the page draws them.
const rs = random(0x57a2);
const stars = [];
while (stars.length < 36) {
  const x = 6 + Math.floor(rs() * (W - 12));
  const y = 8 + Math.floor(rs() * 150);
  if (Math.hypot(x - ORB.x, y - ORB.y) < 20) continue;
  if (stars.some((s) => Math.abs(s.x - x) < 14 && Math.abs(s.y - y) < 9)) continue;
  stars.push({ x, y, bright: stars.length < 6 });
}

// ------------------------------------------------------------------ orb
// The sun, a white disc in a dithered halo; or the moon, smaller, full,
// with its seas. Both in the same box.
const ORB_BOX = { x: ORB.x - 15, y: ORB.y - 15, w: 31, h: 31 };
const moonSeas = [
  [-2, -2],
  [-1, -2],
  [-3, 0],
  [-2, 1],
  [1, 1],
  [2, 1],
  [2, 2],
  [-1, 3],
  [3, -2],
];
function drawOrb(theme) {
  const day = theme === "day";
  const orb = layer(ORB_BOX.w, ORB_BOX.h);
  for (let y = 0; y < orb.h; y++) {
    for (let x = 0; x < orb.w; x++) {
      const gx = ORB_BOX.x + x;
      const gy = ORB_BOX.y + y;
      const d = Math.hypot(gx - ORB.x, gy - ORB.y);
      const r = day ? 10 : 7;
      if (d <= r + 0.5) orb.set(x, y, "orb");
      else if (d <= r + 2.4 && threshold(gx, gy) < 0.6) orb.set(x, y, "orbHalo");
      else if (d <= r + 4.4 && threshold(gx, gy) < 0.13) orb.set(x, y, "orbHalo");
    }
  }
  if (!day) for (const [dx, dy] of moonSeas) orb.set(15 + dx, 15 + dy, "orbShade");
  return orb;
}

// --------------------------------------------------------------- clouds
// Long, thin stratus. Each cloud is a stack of rows, top to bottom, each a
// list of [from, to] spans; spans wrap around the layer's edges, so a
// layer can be tiled and drifted forever. The colours follow the rows: by
// day white with grey undersides, by night dark with moonlit tops.
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

// High clouds: lit on top, shaded beneath.
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

// Low clouds, nearer: they pass behind the Cerro.
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
// Everything from the Cerro's summit down. Opaque below the horizon,
// transparent above it around the hill, the cross and the windmill.
const LAND = { y: Math.min(HORIZON - CERRO.h - CROSS.h - 2, MILL.hub - MILL.r - 4) };
LAND.h = H - LAND.y;
const land = layer(W, LAND.h);
const put = (x, y, name) => land.set(x, y - LAND.y, name);
const at = (x, y) => land.get(x, y - LAND.y);
const rl = random(0x1a4d);
const lit = (x, reach) => Math.abs(x - ORB.x) < reach;

// Far off on the horizon: on the left, south-west, a line of the sea
// past the coast by Piriápolis, up to the Cerro's south foot (the coast
// is about 6 km south of it); on the right, low hazy hills, the Cuchilla
// Grande's other hills. Between them, the plains are flat.
const SEA = { to: 258 };
for (let x = 0; x < SEA.to; x++) {
  // The far edge of the water holds the most light.
  put(x, HORIZON - 3, threshold(x, HORIZON) < 0.6 ? "seaLit" : "sea");
  put(x, HORIZON - 2, "sea");
  put(x, HORIZON - 1, "sea");
}
for (let x = SEA.to - 14; x < W; x++) {
  const rise = Math.min(1, (x - SEA.to + 14) / 30); // the coast, then the hills
  const h = Math.max(0, Math.round(rise * (1.6 + 1.4 * Math.sin(x / 23) + 1.1 * Math.sin(x / 9.5 + 1))));
  for (let y = HORIZON - h; y < HORIZON; y++) put(x, y, "haze");
}
// Where the light catches the water: the page twinkles these.
const rg0 = random(0x6e1a);
const glints = [];
while (glints.length < 12) {
  const x = 4 + Math.floor(rg0() * (SEA.to - 12));
  const y = HORIZON - 1 - Math.floor(rg0() * 2);
  if (glints.some((g) => Math.abs(g.x - x) < 12)) continue;
  glints.push({ x, y });
}

// The hill's outline, column by column: the dome, steeper on the north,
// then the saddle and the shoulder, which runs off lower and lower.
function cerro(x) {
  const s = x - CERRO.x;
  const u = Math.abs(s) / (s < 0 ? CERRO.left : CERRO.right);
  const dome = u < 1 ? CERRO.h * Math.cos((u * Math.PI) / 2) ** (s < 0 ? 1.3 : 1.1) : 0;
  const shoulder = s > 0 ? 9 * Math.exp(-(((s - 52) / 22) ** 2)) + Math.max(0, 12 * (1 - (s - 30) / 120)) * (s > 30 ? 1 : (s / 30) ** 2) : 0;
  return Math.max(dome, shoulder);
}

// The hill, its outline nudged a pixel here and there, boulders and
// slabs of bare granite on the summit, darker scrub and trees lower down,
// and a rim of light along its north side, towards the sun or the moon.
let wobble = 0;
const top = new Map();
for (let x = CERRO.x - CERRO.left; x < W; x++) {
  const s = x - CERRO.x;
  if (rl() < 0.3) wobble = Math.max(-1, Math.min(1, wobble + (rl() < 0.5 ? -1 : 1)));
  // The granite on top breaks the line: a boulder a pixel proud of it
  // here and there, but not under the cross.
  const boulder = Math.abs(s) > 4 && Math.abs(s) < 26 && rl() < 0.16 ? 1 : 0;
  const base = cerro(x);
  const h = Math.max(0, Math.round(base + (base > 3 && Math.abs(s) > 4 ? wobble : 0)) + boulder);
  if (h === 0) continue;
  top.set(x, HORIZON - h);
  for (let y = HORIZON - h; y < HORIZON; y++) put(x, y, "hill");
}
for (let i = 0; i < 420; i++) {
  const x = CERRO.x - CERRO.left + Math.floor(rl() * (CERRO.left + W - CERRO.x));
  const t = top.get(x);
  if (t === undefined || t >= HORIZON - 2) continue;
  const depth = Math.floor(rl() * (HORIZON - t - 1));
  const y = t + 1 + depth;
  // Near the top, bare rock in long slabs; lower down, scrub.
  const high = depth < 9 && Math.abs(x - CERRO.x) < 40;
  const w = high ? 2 + Math.floor(rl() * 4) : 1 + Math.floor(rl() * 3);
  const tone = high ? (rl() < 0.75 ? "hillRock" : "hillDark") : rl() < 0.97 ? "hillDark" : "hillRock";
  for (let k = 0; k < w; k++) if (at(x + k, y) === "hill") put(x + k, y, tone);
}
for (const [x, t] of top) {
  if (x > CERRO.x + 1) put(x, t, lit(x, 24) ? "rimHot" : "rim");
}
// The cross on the summit: concrete, on its stepped base, lit on the side
// towards the light. By day it's pale against the sky; by night, dark.
const summit = HORIZON - Math.round(cerro(CERRO.x));
for (let k = -1; k <= 1; k++) put(CERRO.x + k, summit - 1, "cross");
for (let k = 1; k <= CROSS.h; k++) put(CERRO.x, summit - k, "cross");
const armY = summit - CROSS.h + CROSS.armAt;
for (let k = -CROSS.arm; k <= CROSS.arm; k++) put(CERRO.x + k, armY, "cross");
put(CERRO.x + CROSS.arm, armY, "crossLit");
put(CERRO.x, summit - CROSS.h, "crossLit");
put(CERRO.x + 1, summit - 1, "crossLit");

// The plains, lighter towards the horizon and darker towards the viewer.
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
// with a lit edge where they face the light.
for (const row of [213, 217, 223, 231]) {
  const r = (row - HORIZON) / 21; // 0 at the horizon, 1 nearest
  for (let x = 0; x < W; ) {
    const len = 10 + Math.floor(rl() * (20 + r * 40));
    if (rl() < 0.6) {
      let h = 1;
      for (let k = 0; k < len && x + k < W; k++) {
        if (rl() < 0.45) h = Math.max(1, Math.min(2 + Math.round(r * 3), h + (rl() < 0.5 ? -1 : 1)));
        for (let j = 0; j < h; j++) put(x + k, row - j, "hedge");
        if (lit(x + k, 90) && rl() < 0.5) put(x + k, row - h, "hedgeLit");
      }
    }
    x += len + 6 + Math.floor(rl() * (20 + r * 30));
  }
}
// Woods of eucalyptus, planted all over these plains: one at the
// Cerro's foot, hiding where it meets the land, one off to the north and
// one nearer, on the left. Ragged tall crowns, lit where they face the
// light.
function wood(from, to, row, tall) {
  let h = 1;
  for (let x = from; x <= to; x++) {
    const edge = Math.min(x - from, to - x) / 6; // lower towards its ends
    const want = Math.round(Math.min(1, edge) * tall * (0.65 + 0.35 * Math.sin(x / 3.1) * Math.sin(x / 7.3 + 2)));
    h = Math.max(1, h + Math.sign(want - h) * (rl() < 0.7 ? 1 : 0) + (rl() < 0.15 ? (rl() < 0.5 ? -1 : 1) : 0));
    for (let j = 0; j < h; j++) put(x, row - j, "hedge");
    if (rl() < 0.45 && lit(x, 150)) put(x, row - h, "hedgeLit");
  }
}
wood(248, 318, 211, 7);
wood(430, 479, 212, 6);
wood(14, 104, 225, 12);

// The lights of the houses scattered around the Cerro's foot, towards
// Piriápolis, and of a farm or two: by night the page draws them, so they
// can come on as it gets dark, and now and then one goes off.
const lights = [
  { x: 176, y: 212 },
  { x: 191, y: 213 },
  { x: 204, y: 211, off: true },
  { x: 213, y: 214 },
  { x: 228, y: 212 },
  { x: 241, y: 213 },
  { x: 236, y: 216 },
  { x: 318, y: 212 },
  { x: 452, y: 214, off: true },
  { x: 121, y: 219 },
  { x: 384, y: 215 },
  { x: 470, y: 219 },
];

// Lit streaks where a field's edge catches the light.
for (let i = 0; i < 36; i++) {
  const y = 226 + Math.floor(rl() * 22);
  const x = Math.floor(rl() * W);
  const len = 4 + Math.floor(rl() * 20);
  for (let k = 0; k < len; k++) if (x + k < W && at(x + k, y)?.startsWith("field")) put(x + k, y, y < 236 ? "field0" : "field1");
}

// A country road across the plains, two pixels wide, where the cars run.
for (let x = 0; x < W; x++) {
  put(x, ROAD, "road");
  put(x, ROAD + 1, x % 7 < 4 ? "road" : "field1");
}

// The windmill: a lattice tower, its legs narrowing to a platform, braced
// every few rows, a mast up to the hub and the tail vane behind it. The
// wheel is a sprite, so it can turn.
for (let y = MILL.top; y <= MILL.base; y++) {
  const f = (MILL.base - y) / (MILL.base - MILL.top);
  const left = Math.round(MILL.x - 4 + 3 * f);
  const right = Math.round(MILL.x + 4 - 3 * f);
  put(left, y, "mill");
  put(right, y, lit(right, 200) ? "millLit" : "mill");
  if ((MILL.base - y) % 9 === 0) for (let x = left; x <= right; x++) put(x, y, "mill");
}
for (let x = MILL.x - 2; x <= MILL.x + 2; x++) put(x, MILL.top, "mill");
for (let y = MILL.hub; y < MILL.top; y++) put(MILL.x, y, "mill");
for (let x = MILL.x - 10; x < MILL.x; x++) put(x, MILL.hub, "mill");
for (let y = MILL.hub - 3; y <= MILL.hub + 2; y++) for (let x = MILL.x - 12; x <= MILL.x - 10; x++) if (Math.abs(y - MILL.hub) <= x - (MILL.x - 13)) put(x, y, "mill");

// A wire fence across the foreground, its posts closer together and
// smaller as it runs off to the right, two wires catching the light.
const FENCE = { y0: 266, y1: 249 };
const fenceY = (x) => Math.round(FENCE.y0 + ((FENCE.y1 - FENCE.y0) * x) / W);
for (let x = 0; x < W; x++) {
  const y = fenceY(x);
  const wire = lit(x, 70) ? "wireLit" : "wire";
  put(x, y - 3, wire);
  put(x, y - 6, rl() < 0.85 ? wire : "wire");
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
// phase, so stepping through the frames makes the grass sway. Wild
// flowers among it, yellow and white by day.
const GRASS = { y: 262, h: H - 262, frames: 4 };
const grass = layer(W, GRASS.h * GRASS.frames);
const rgr = random(0x9a55);
const blades = [];
for (let x = 0; x < W; x += 1 + Math.floor(rgr() * 2)) {
  const nearer = 1 - x / W; // taller on the left, nearer the viewer
  const clump = Math.sin(x / 7) + Math.sin(x / 2.3 + 1) * 0.5; // grass grows in clumps
  const roll = rgr();
  blades.push({
    x,
    h: Math.max(3, Math.round(8 + nearer * 12 + clump * 4 + rgr() * 5)),
    phase: x / 19 + rgr() * 0.8,
    tip: roll < 0.08 ? "flower" : roll < 0.13 ? "flowerWhite" : roll < 0.45 ? "lit" : null,
  });
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
      let m = "blade";
      if (k === b.h - 1 && b.tip) m = b.tip === "lit" ? (lit(x, 110) ? "tipLit" : "tip") : b.tip;
      grass.set(x, base + y, m);
    }
  }
  // The ground under the grass is solid, and its last rows meet the
  // bottom of the screen.
  for (let y = GRASS.h - 6; y < GRASS.h; y++) for (let x = 0; x < W; x++) grass.set(x, base + y, y >= GRASS.h - 3 ? "soil" : "blade");
}

// Fireflies over the grass, by night: the page draws and blinks them.
const rf = random(0xf1ef);
const fireflies = [];
while (fireflies.length < 24) {
  const x = 130 + Math.floor(rf() * (W - 140));
  const y = 214 + Math.floor(rf() * 74);
  if (fireflies.some((p) => Math.abs(p.x - x) < 14 && Math.abs(p.y - y) < 7)) continue;
  fireflies.push({ x, y });
}

// --------------------------------------------------------------- sprites
// The windmill's wheel, seen face on: a rim and six vanes, turned a
// quarter of the way to the next vane in each of four frames, so stepping
// through them turns it.
const WHEEL = 2 * MILL.r + 1;
const wheel = layer(WHEEL * 4, WHEEL);
for (let f = 0; f < 4; f++) {
  const c = MILL.r;
  for (let y = 0; y < WHEEL; y++) {
    for (let x = 0; x < WHEEL; x++) {
      const d = Math.hypot(x - c, y - c);
      if (d > MILL.r - 0.6 && d <= MILL.r + 0.4) wheel.set(f * WHEEL + x, y, x > c && y < c ? "millLit" : "mill");
    }
  }
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3 + (f * Math.PI) / 12;
    for (let r = 1; r <= MILL.r - 0.5; r += 0.5) wheel.set(f * WHEEL + Math.round(c + r * Math.cos(a)), Math.round(c + r * Math.sin(a)), "mill");
  }
  wheel.set(f * WHEEL + c, c, "millLit");
}

// A car, facing left and facing right: by day its red body, by night only
// its headlamps ahead and its tail lamp behind (the body is the dark).
const car = sprite(
  [
    [".gg...", "LBBBBT", ".w..w."],
    ["...gg.", "TBBBBL", ".w..w."],
  ],
  { g: "carGlass", B: "carBody", L: "carLamp", T: "carTail", w: "carWheel" },
);

// A tero, the plains' lapwing, wings up and wings down.
const birds = sprite(
  [
    ["X.......X", ".XX...XX.", "...XXX...", "....X....", "........."],
    [".........", "...XXX...", ".XX.X.XX.", "X.......X", "........."],
  ],
  { X: "tero" },
);

// A Hereford cow, red with a white face, grazing and then looking up.
const cows = sprite(
  [
    ["........", "XXXXXX..", "XXXXXXX.", "XXXXXXFF", "D..D.DFF"],
    ["......FF", "XXXXXXFF", "XXXXXXX.", "XXXXXX..", "D..D.D.."],
  ],
  { X: "cowBody", F: "cowFace", D: "cowDark" },
);

// A yellow butterfly, wings open and shut.
const butterfly = sprite(
  [
    ["W.W", "WDW"],
    [".W.", ".D."],
  ],
  { W: "wing", D: "wingDark" },
);

// A bat, wings up and wings down.
const bats = sprite(
  [
    ["X...X", ".XXX."],
    [".XXX.", "X...X"],
  ],
  { X: "bat" },
);

// ------------------------------------------------------------------ mark
// The site's mark, on a 17 by 17 grid: the cross close up, on the
// Cerro's granite top against the setting sun, in four bands of dusk.
// Here, unlike in the scene, it's big enough to show what makes it this
// cross: the ring around its crossing, the arms reaching past the ring,
// the long shaft and the stepped base. It's the favicon, the Apple icon
// (at 10x) and the mark in the page's header, the same in both themes.
const M = 17;
const C = 8; // the cross's column, the grid's middle
const mark = layer(M, M);
const markBands = ["markSky", "markSky", "markDusk", "markEmber", "markGold"];
for (let y = 0; y < M; y++) {
  for (let x = 0; x < M; x++) {
    mark.set(x, y, markBands[Math.min(markBands.length - 1, Math.floor((y / M) * 1.35 * markBands.length))]);
    if (Math.hypot(x - C, y + 0.5 - 8) <= 6.3) mark.set(x, y, y >= 8 ? "markHalo" : "markSun");
  }
}
for (let x = 0; x < M; x++) {
  const u = (x - C) / (M / 2);
  for (let y = Math.round(14 + 3 * u * u); y < M; y++) mark.set(x, y, "markHill");
}
const ARM_Y = 5;
for (let y = 1; y < 13; y++) mark.set(C, y, "markHill");
for (let x = C - 4; x <= C + 4; x++) mark.set(x, ARM_Y, "markHill");
for (let y = 0; y < M; y++) {
  for (let x = 0; x < M; x++) {
    const d = Math.hypot(x - C, y - ARM_Y);
    if (d >= 2.2 && d < 3.1) mark.set(x, y, "markHill");
  }
}
for (let x = C - 1; x <= C + 1; x++) mark.set(x, 12, "markHill");
for (let x = C - 2; x <= C + 2; x++) mark.set(x, 13, "markHill");

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

// An indexed PNG: one palette entry per material, in the theme's colour,
// one byte per pixel, and index 0 transparent. Only the entries up to the
// highest one used are written.
function png(width, height, pixel, palette) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 3; // indexed colour
  const raw = Buffer.alloc((width + 1) * height);
  let used = 0;
  for (let y = 0; y < height; y++) {
    raw[y * (width + 1)] = 0;
    for (let x = 0; x < width; x++) {
      const v = pixel(x, y);
      raw[y * (width + 1) + 1 + x] = v;
      used = Math.max(used, v);
    }
  }
  const plte = Buffer.from(names.slice(0, used + 1).flatMap((n) => [1, 3, 5].map((i) => parseInt(palette[n].slice(i, i + 2), 16))));
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

// Each theme's layers, in its own folder; the sprites only where the
// theme uses them.
rmSync(join(root, "public/scene"), { recursive: true, force: true });
const skies = { day: drawSky("day"), night: drawSky("night") };
const orbs = { day: drawOrb("day"), night: drawOrb("night") };
for (const [theme, palette] of Object.entries(THEMES)) {
  const out = (name, l) => write(join(root, "public/scene", theme, name), png(l.w, l.h, (x, y) => l.px[y * l.w + x], palette));
  out("sky.png", skies[theme]);
  out("orb.png", orbs[theme]);
  out("clouds-far.png", far);
  out("clouds-near.png", near);
  out("land.png", land);
  out("grass.png", grass);
  out("wheel.png", wheel);
  out("car.png", car);
  if (theme === "day") {
    out("birds.png", birds);
    out("cows.png", cows);
    out("butterfly.png", butterfly);
  } else {
    out("bats.png", bats);
  }
}

// The positions Horizon.tsx needs, in scene pixels.
const scene = {
  width: W,
  height: H,
  horizon: HORIZON,
  focus: CERRO.x,
  orb: ORB_BOX,
  far: FAR,
  near: NEAR,
  land: { y: LAND.y, h: LAND.h },
  grass: GRASS,
  wheel: { x: MILL.x - MILL.r, y: MILL.hub - MILL.r, w: WHEEL, h: WHEEL },
  road: ROAD,
  car: { w: 6, h: 3 },
  stars,
  fireflies,
  lights,
  glints,
  birds: { y: 144, w: 9, h: 5 },
  cows: [
    { x: 292, y: 239 },
    { x: 306, y: 241 },
    { x: 414, y: 238 },
  ],
  butterflies: [
    { x: 276, y: 258 },
    { x: 352, y: 252 },
    { x: 430, y: 262 },
  ],
  bats: { x: 278, y: 184 },
  meteor: { x: 318, y: 64 },
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
    runs.push([x, y, n, NIGHT[names[c]]]);
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
write(join(root, "src/app/apple-icon.png"), png(M * 10, M * 10, (x, y) => mark.px[Math.floor(y / 10) * M + Math.floor(x / 10)], NIGHT));

// A still frame of a theme, every layer at rest, with the night's stars
// and lights painted in.
function still(theme) {
  const s = layer(W, H);
  const paste = (l, ox, oy, rows = l.h, cols = l.w) => {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const v = l.px[y * l.w + x];
        if (v) s.px[(oy + y) * W + ((ox + x) % W)] = v;
      }
    }
  };
  paste(skies[theme], 0, 0);
  paste(orbs[theme], ORB_BOX.x, ORB_BOX.y);
  paste(far, 0, FAR.y);
  paste(near, 0, NEAR.y);
  paste(land, 0, LAND.y);
  paste(wheel, MILL.x - MILL.r, MILL.hub - MILL.r, WHEEL, WHEEL);
  paste(grass, 0, GRASS.y, GRASS.h);
  if (theme === "night") {
    for (const p of stars) s.set(p.x, p.y, "starBright");
    for (const p of lights) s.set(p.x, p.y, "lamp");
  }
  return s;
}

// For the share image: 200 by 210 pixels of the night around the Cerro,
// the moon and the windmill, at three times, to fill the right half of
// 1200 by 630.
const night = still("night");
const OG = { scale: 3, x: 250, y: 40, w: 200, h: 210 };
write(
  join(root, "src/assets/scene-og.png"),
  png(OG.w * OG.scale, OG.h * OG.scale, (x, y) => night.px[(OG.y + Math.floor(y / OG.scale)) * W + OG.x + Math.floor(x / OG.scale)], NIGHT),
);
// Full still frames, for checking the drawing by eye; not shipped.
const preview = process.argv.find((a) => a.startsWith("--preview="))?.slice(10);
if (preview) {
  for (const theme of ["day", "night"]) {
    const s = theme === "night" ? night : still("day");
    writeFileSync(`${preview}-${theme}.png`, png(W, H, (x, y) => s.px[y * W + x], THEMES[theme]));
  }
}
