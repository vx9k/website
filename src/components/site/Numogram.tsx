/** The CCRU numogram, drawn from its rules rather than traced:
 *
 *  - ten zones, 0 to 9, paired into five syzygies that each sum to 9;
 *  - each syzygy's current is the difference of its pair, and flows to the
 *    zone with that number: 8::1 to 7, 7::2 to 5, 5::4 to 1, which closes
 *    the Time-Circuit; 6::3 to 3 (the Warp) and 9::0 to 9 (the Plex) loop
 *    back into themselves;
 *  - a zone's gate leads to the digital root of the sum 1 + … + n. The
 *    three that leave the Time-Circuit are drawn: Gt-3 (2 to the Warp's 3),
 *    Gt-15 (5 to 6) and Gt-36 (8 to the Plex's 9).
 *
 *  It's plain SVG rendered on the server. The currents flow in CSS
 *  (.numogram in globals.css), still under reduced motion. */

type Point = [number, number];

const zones: Record<number, Point> = {
  // The Warp, above.
  6: [150, 70],
  3: [250, 70],
  // The Time-Circuit, a hexagon: each syzygy is a side, and each current
  // runs to the next side's nearer zone.
  4: [145, 215],
  5: [255, 215],
  2: [310, 310],
  7: [255, 405],
  8: [145, 405],
  1: [90, 310],
  // The Plex, below.
  9: [150, 550],
  0: [250, 550],
};

const syzygies: [number, number][] = [
  [6, 3],
  [5, 4],
  [7, 2],
  [8, 1],
  [9, 0],
];

const r = 17;

const mid = (a: Point, b: Point): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

// A curve from one point to another, bowed by `bend` (a fraction of its
// length, to the left of the direction of travel), pulled back from both
// ends so arrowheads stop at a zone's edge.
function curve(from: Point, to: Point, bend: number, trimStart: number, trimEnd: number) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const sx = x1 + ux * trimStart;
  const sy = y1 + uy * trimStart;
  const ex = x2 - ux * trimEnd;
  const ey = y2 - uy * trimEnd;
  const cx = (sx + ex) / 2 + uy * len * bend;
  const cy = (sy + ey) / 2 - ux * len * bend;
  const f = (n: number) => n.toFixed(1);
  return `M${f(sx)} ${f(sy)} Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`;
}

const currents = syzygies.map(([a, b]) => {
  const from = mid(zones[a], zones[b]);
  const target = a - b;
  // The Warp's and the Plex's currents return to one of their own zones,
  // so they arc out and back.
  const loop = target === 3 || target === 9;
  const d = loop
    ? (() => {
        const [tx, ty] = zones[target];
        const out = target === 3 ? -1 : 1;
        const [mx, my] = from;
        return `M${mx} ${my + out * 4} C${mx} ${my + out * 70} ${tx + 50} ${ty + out * 70} ${tx + 9} ${ty + out * (r + 3)}`;
      })()
    : curve(from, zones[target], -0.12, 4, r + 3);
  return { id: `${a}::${b}`, value: target, d };
});

const gates = [
  { name: "Gt-3", from: 2, to: 3, bend: 0.18 },
  { name: "Gt-15", from: 5, to: 6, bend: -0.1 },
  { name: "Gt-36", from: 8, to: 9, bend: -0.18 },
].map((g) => ({ ...g, d: curve(zones[g.from], zones[g.to], g.bend, r + 2, r + 4) }));

export default function Numogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 620"
      role="img"
      aria-labelledby="numogram-title numogram-desc"
      className={`numogram ${className ?? ""}`}
    >
      <title id="numogram-title">The numogram</title>
      <desc id="numogram-desc">
        The CCRU’s numogram: ten zones, 0 to 9, paired into five syzygies that each sum to nine. Each pair’s current
        flows to the zone numbered by its difference. In the Time-Circuit, 8::1 flows to 7, 7::2 to 5 and 5::4 to 1. The
        Warp, 6::3, and the Plex, 9::0, flow back into themselves. Gates lead out of the Time-Circuit from 2, 5 and 8.
      </desc>
      <defs>
        <marker id="numogram-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
        </marker>
      </defs>

      <g className="numogram-regions" aria-hidden>
        <text x="392" y="74">Warp</text>
        <text x="392" y="190">Time-Circuit</text>
        <text x="392" y="554">Plex</text>
      </g>

      <g className="numogram-gates" aria-hidden>
        {gates.map((g) => (
          <path key={g.name} d={g.d} />
        ))}
      </g>

      <g className="numogram-syzygies" aria-hidden>
        {syzygies.map(([a, b]) => (
          <line key={`${a}${b}`} x1={zones[a][0]} y1={zones[a][1]} x2={zones[b][0]} y2={zones[b][1]} />
        ))}
      </g>

      <g className="numogram-currents" aria-hidden>
        {currents.map((c, i) => (
          <g key={c.id}>
            <path d={c.d} className="numogram-track" markerEnd="url(#numogram-arrow)" />
            <path d={c.d} pathLength={100} className="numogram-flow" style={{ animationDelay: `${i * -0.7}s` }} />
          </g>
        ))}
      </g>

      <g className="numogram-zones" aria-hidden>
        {Object.entries(zones).map(([n, [x, y]]) => (
          <g key={n}>
            <circle cx={x} cy={y} r={r} />
            <text x={x} y={y} dy="0.36em">
              {n}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
