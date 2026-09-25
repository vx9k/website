// Build-time helpers for pixel art. One SVG unit is one art pixel, and
// every shape ends up as a path of whole-pixel runs, drawn crisp.

export type Cell = readonly [x: number, y: number];

/** A seeded PRNG (mulberry32), so the art is the same on every build. */
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

/** Reads a sprite drawn as rows of characters and returns its cells by
 *  character, offset to (x, y). "." is empty. */
export function sprite(rows: readonly string[], x = 0, y = 0) {
  const cells: Record<string, Cell[]> = {};
  rows.forEach((row, dy) =>
    [...row].forEach((ch, dx) => {
      if (ch !== ".") (cells[ch] ??= []).push([x + dx, y + dy]);
    }),
  );
  return cells;
}

/** Merges cells into horizontal runs so the path stays short. */
export function path(cells: Iterable<Cell>) {
  const rows = new Map<number, Set<number>>();
  for (const [x, y] of cells) {
    if (!rows.has(y)) rows.set(y, new Set());
    rows.get(y)!.add(x);
  }
  let d = "";
  for (const [y, set] of [...rows].sort((a, b) => a[0] - b[0])) {
    const xs = [...set].sort((a, b) => a - b);
    for (let i = 0; i < xs.length; ) {
      let j = i;
      while (xs[j + 1] === xs[j] + 1) j++;
      d += `M${xs[i]} ${y}h${j - i + 1}v1h${-(j - i + 1)}z`;
      i = j + 1;
    }
  }
  return d;
}

/** A skyline filled down to `bottom`: one column height per x. */
export function skyline(tops: readonly number[], bottom: number) {
  let d = `M0 ${bottom}`;
  tops.forEach((top, x) => (d += `V${top}H${x + 1}`));
  return `${d}V${bottom}z`;
}

/** Cells inside a union of circles, for round things: canopies, clouds,
 *  the sun. Each circle is [cx, cy, r]. */
export function blob(circles: readonly (readonly [number, number, number])[]) {
  const cells: Cell[] = [];
  const xs = circles.flatMap(([cx, , r]) => [cx - r, cx + r]);
  const ys = circles.flatMap(([, cy, r]) => [cy - r, cy + r]);
  for (let y = Math.floor(Math.min(...ys)); y <= Math.max(...ys); y++)
    for (let x = Math.floor(Math.min(...xs)); x <= Math.max(...xs); x++)
      if (circles.some(([cx, cy, r]) => (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r))
        cells.push([x, y]);
  return cells;
}

/** The cells just outside a shape (four-way neighbours), for outlines. */
export function outline(cells: readonly Cell[]) {
  const inside = new Set(cells.map(([x, y]) => `${x},${y}`));
  const edge = new Map<string, Cell>();
  for (const [x, y] of cells)
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]] as const)
      if (!inside.has(`${nx},${ny}`)) edge.set(`${nx},${ny}`, [nx, ny]);
  return [...edge.values()];
}
