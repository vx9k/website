// Pixel-art helpers. Everything here runs at build time inside server
// components, so the page ships finished SVG paths and no script.

/** Seeded PRNG (mulberry32), so a scene looks the same on every build. */
export function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A set of lit pixels on a grid, drawn as one SVG path. */
export class Pixels {
  private rows = new Map<number, Set<number>>();

  set(x: number, y: number) {
    let row = this.rows.get(y);
    if (!row) this.rows.set(y, (row = new Set()));
    row.add(x);
  }

  /** Paints a sprite given as rows of "#" (on) and "." (off). */
  sprite(x: number, y: number, rows: readonly string[]) {
    rows.forEach((r, dy) => {
      for (let dx = 0; dx < r.length; dx++) if (r[dx] === "#") this.set(x + dx, y + dy);
    });
  }

  /** Horizontal runs merged into rectangles, so a solid mountain is a few
   *  dozen path commands rather than thousands of squares. */
  path() {
    let d = "";
    for (const [y, row] of [...this.rows].sort((a, b) => a[0] - b[0])) {
      const xs = [...row].sort((a, b) => a - b);
      for (let i = 0; i < xs.length; ) {
        let j = i;
        while (j + 1 < xs.length && xs[j + 1] === xs[j] + 1) j++;
        d += `M${xs[i]} ${y}h${j - i + 1}v1h${-(j - i + 1)}z`;
        i = j + 1;
      }
    }
    return d;
  }
}

/** A mountain ridge as the top row of each column. It's the skyline of a
 *  row of overlapping peaks, each with its own slope on either side, made
 *  ragged with a random walk and cleaned of one-pixel spikes. */
export function ridge(
  rand: () => number,
  width: number,
  { base, height, peaks }: { base: number; height: number; peaks: number },
) {
  const lift = new Array<number>(width).fill(0);
  const gap = width / peaks;
  for (let i = -1; i <= peaks; i++) {
    const px = (i + 0.2 + rand() * 0.6) * gap;
    const ph = height * (0.45 + rand() * 0.55);
    const left = 0.5 + rand() * 0.7; // rows per column
    const right = 0.5 + rand() * 0.7;
    for (let x = 0; x < width; x++) {
      const v = ph - Math.abs(x - px) * (x < px ? left : right);
      if (v > lift[x]) lift[x] = v;
    }
  }
  let walk = 0;
  const top = lift.map((v) => {
    walk = Math.max(-1.5, Math.min(1.5, walk + (rand() - 0.5) * 0.9));
    return Math.round(base - Math.max(0, v + walk));
  });
  for (let x = 1; x < width - 1; x++) {
    const [a, b] = [top[x - 1], top[x + 1]];
    if (top[x] < Math.min(a, b)) top[x] = Math.min(a, b);
    if (top[x] > Math.max(a, b)) top[x] = Math.max(a, b);
  }
  return top;
}

/** Fills every column from its ridge row down to the bottom of the grid. */
export function fill(top: number[], bottom: number) {
  const px = new Pixels();
  top.forEach((y, x) => {
    for (let r = Math.max(0, y); r < bottom; r++) px.set(x, r);
  });
  return px;
}
