/** The CCRU numogram, in the layout of the CCRU's own drawing: the Warp
 *  (3 and 6) at the top, the Time-Circuit (2::7, 5::4, 1::8) in the
 *  middle and the Plex (9 over 0) at the bottom.
 *
 *  - Ten zones, paired into five syzygies that each sum to 9.
 *  - Each syzygy's current is the difference of its pair and flows to the
 *    zone with that number: 2::7 to 5, 5::4 to 1, 1::8 to 7 (the
 *    Time-Circuit), 6::3 to 3 and 9::0 to 9.
 *  - Each zone's gate is named by the sum 1 + … + n and leads to that sum's
 *    digital root: Gt-1 (1 to 1), Gt-3 (2 to 3), Gt-6 (3 to 6), Gt-10 (4 to
 *    1), Gt-15 (5 to 6), Gt-21 (6 to 3), Gt-28 (7 to 1), Gt-36 (8 to 9) and
 *    Gt-45 (9 to 9). Zone 0's gate is 0 and isn't drawn.
 *
 *  Plain SVG rendered on the server. Syzygies and currents are stippled,
 *  as in the original; a pulse runs along each current in CSS
 *  (.numogram in globals.css) and stops under reduced motion. */

type Point = [number, number];

const R = 70;

const zones: Record<number, Point> = {
  3: [378, 262],
  6: [566, 258],
  2: [790, 505],
  7: [902, 655],
  5: [265, 672],
  4: [176, 806],
  1: [545, 1100],
  8: [545, 1306],
  9: [545, 1516],
  0: [545, 1722],
};

// The stippled bands between partners.
const syzygies: [number, number][] = [
  [6, 3],
  [7, 2],
  [5, 4],
  [8, 1],
  [9, 0],
];

// Currents, each from between its pair to the zone it names.
const currents = [
  { id: "2::7", to: 5, d: "M812 585 Q600 600 352 668" },
  { id: "5::4", to: 1, d: "M232 752 Q300 930 470 1060" },
  { id: "1::8", to: 7, d: "M560 1206 Q860 1110 905 742" },
  { id: "6::3", to: 3, d: "M472 262 C580 290 560 360 456 318" },
  { id: "9::0", to: 9, d: "M545 1620 C660 1640 690 1560 616 1548" },
];

// Gates: a path out of the zone to the gate's numbered circle, and one
// from the circle into the zone it leads to.
const gates = [
  { n: 1, at: [568, 930], out: "M582 1032 Q604 960 590 944", into: "M544 932 Q500 950 516 1026" },
  { n: 3, at: [366, 398], out: "M722 522 Q480 530 392 410", into: "M356 370 L350 334" },
  { n: 6, at: [478, 152], out: "M410 198 Q420 160 450 152", into: "M506 152 Q540 160 552 188" },
  { n: 10, at: [372, 1110], out: "M196 874 Q240 1090 344 1110", into: "M400 1112 L472 1122" },
  { n: 15, at: [568, 58], out: "M228 612 C150 60 330 30 540 58", into: "M590 76 Q610 120 600 192" },
  { n: 21, at: [462, 420], out: "M614 318 C610 440 530 430 490 424", into: "M444 398 L418 334" },
  { n: 28, at: [664, 1000], out: "M852 706 Q760 900 682 980", into: "M644 1018 L612 1060" },
  { n: 36, at: [652, 1410], out: "M598 1356 Q620 1380 632 1392", into: "M640 1432 L606 1468" },
  { n: 45, at: [426, 1494], out: "M478 1534 Q450 1530 444 1516", into: "M430 1466 Q450 1440 482 1456" },
] as const;

export default function Numogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1080 1860"
      role="img"
      aria-labelledby="numogram-title numogram-desc"
      className={`numogram ${className ?? ""}`}
    >
      <title id="numogram-title">The numogram</title>
      <desc id="numogram-desc">
        The CCRU’s numogram: ten zones, 0 to 9, paired into five syzygies that each sum to nine. Each pair’s current
        flows to the zone numbered by its difference. In the Time-Circuit, 2::7 flows to 5, 5::4 to 1 and 1::8 to 7. The
        Warp, 6::3, and the Plex, 9::0, flow back into themselves. Gates numbered 1, 3, 6, 10, 15, 21, 28, 36 and 45 link
        each zone to another.
      </desc>
      <defs>
        <pattern id="numogram-stipple" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="currentColor" />
          <circle cx="6.5" cy="6.5" r="1.3" fill="currentColor" />
        </pattern>
        <marker
          id="numogram-head"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="52"
          markerHeight="52"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
        <marker
          id="numogram-tip"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="22"
          markerHeight="22"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </marker>
      </defs>

      <g className="numogram-regions" aria-hidden>
        <text x="1070" y="268">
          Warp
        </text>
        <text x="1070" y="1190">
          Time-Circuit
        </text>
        <text x="1070" y="1620">
          Plex
        </text>
      </g>

      <g className="numogram-syzygies" aria-hidden>
        {syzygies.map(([a, b]) => (
          <line key={`${a}${b}`} x1={zones[a][0]} y1={zones[a][1]} x2={zones[b][0]} y2={zones[b][1]} />
        ))}
      </g>

      <g className="numogram-gates" aria-hidden>
        {gates.map((g) => (
          <g key={g.n}>
            <path d={g.out} />
            <path d={g.into} markerEnd="url(#numogram-tip)" />
          </g>
        ))}
      </g>

      <g className="numogram-currents" aria-hidden>
        {currents.map((c, i) => (
          <g key={c.id}>
            <path d={c.d} className="numogram-track" markerEnd="url(#numogram-head)" />
            <path d={c.d} pathLength={100} className="numogram-flow" style={{ animationDelay: `${i * -0.6}s` }} />
          </g>
        ))}
      </g>

      <g className="numogram-zones" aria-hidden>
        {Object.entries(zones).map(([n, [x, y]]) => (
          <g key={n}>
            <circle cx={x} cy={y} r={R} />
            <text x={x} y={y} dy="0.36em">
              {n}
            </text>
          </g>
        ))}
      </g>

      <g className="numogram-gate-labels" aria-hidden>
        {gates.map((g) => (
          <g key={g.n}>
            <circle cx={g.at[0]} cy={g.at[1]} r={28} />
            <text x={g.at[0]} y={g.at[1]} dy="0.36em">
              {g.n}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
