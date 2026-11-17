import type { CSSProperties } from "react";

/** The painted field behind the slogan, after the Aeroflot posters of the
 *  1960s, in two layers. Texture fills the field: gouache washes and grain,
 *  dry-brush streaks along a 30-degree climb, and stars. Needle draws the
 *  poster's supersonic airliner taken down to flat geometry (wedges, the
 *  red cheatline, the blue band) with its speed streaks, in a box of its
 *  own that Frame places beside the slogan on wide screens and above it on
 *  narrow ones, so the two never cross.
 *
 *  Every colour is a CSS variable from globals.css, so the same drawing is
 *  the night in the dark theme and ultramarine on cream in the light one.
 *  None of it is text; Frame hides it from assistive technology. */

const W = 1440;
const H = 900;

// A small fixed generator, so the stars land in the same places on every
// build and the markup never changes without a reason.
function stars(n: number) {
  let s = 1967;
  const r = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  return Array.from({ length: n }, (_, i) => ({ x: Math.round(r() * W), y: Math.round(r() * H), r: +(0.6 + r() * r() * 2).toFixed(1), i }));
}

// A four-pointed glint, the poster's bright stars.
const glint = (x: number, y: number, s: number) =>
  `M${x} ${y - s}L${x + s * 0.16} ${y - s * 0.16}L${x + s} ${y}L${x + s * 0.16} ${y + s * 0.16}L${x} ${y + s}L${x - s * 0.16} ${y + s * 0.16}L${x - s} ${y}L${x - s * 0.16} ${y - s * 0.16}Z`;

const fill = (token: string) => ({ fill: `var(${token})` }) as CSSProperties;
const delay = (s: number) => ({ "--d": `${s.toFixed(1)}s` }) as CSSProperties;

export function Texture() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="texture">
      <defs>
        {/* Gouache: noise cut into a few flat steps of alpha, then filled
            with the theme's wash colour, so it reads as brushed paint and
            never as a gradient. */}
        <filter id="wash" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse">
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.009" numOctaves={4} seed={17} />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -1.3" />
          <feComponentTransfer result="alpha">
            <feFuncA type="discrete" tableValues="0 0.4 0.75 1" />
          </feComponentTransfer>
          <feFlood className="flood-wash" />
          <feComposite operator="in" in2="alpha" />
        </filter>
        <filter id="brush" x="-1800" y="-260" width="3600" height="520" filterUnits="userSpaceOnUse">
          <feTurbulence type="fractalNoise" baseFrequency="0.0018 0.08" numOctaves={3} seed={4} />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.4 0 0 0 -1.8" />
          <feComponentTransfer result="alpha">
            <feFuncA type="discrete" tableValues="0 0 0.35 0.7" />
          </feComponentTransfer>
          <feFlood className="flood-brush" />
          <feComposite operator="in" in2="alpha" />
        </filter>
        <filter id="grain" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={9} />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  6 0 0 0 -4.1" result="alpha" />
          <feFlood className="flood-grain" />
          <feComposite operator="in" in2="alpha" />
        </filter>
      </defs>

      <rect width={W} height={H} filter="url(#wash)" />
      <rect width={W} height={H} filter="url(#grain)" />
      <g transform={`translate(${W * 0.62} ${H}) rotate(-30)`}>
        <rect x="-1800" y="-260" width="3600" height="520" filter="url(#brush)" />
      </g>

      <g className="stars" style={fill("--paint-star")}>
        {stars(150).map((s) => (
          <circle key={s.i} cx={s.x} cy={s.y} r={s.r} className={s.i % 8 === 0 ? "twinkle" : undefined} style={s.i % 8 === 0 ? delay((s.i % 7) * 0.6) : undefined} />
        ))}
        {[
          [0.08, 0.16, 10],
          [0.3, 0.08, 6],
          [0.6, 0.3, 8],
          [0.92, 0.12, 11],
          [0.5, 0.52, 6],
          [0.78, 0.66, 7],
          [0.2, 0.4, 7],
        ].map(([x, y, s], i) => (
          <path key={i} d={glint(Math.round(x * W), Math.round(y * H), s)} className="twinkle" style={delay(i * 0.5)} />
        ))}
      </g>
    </svg>
  );
}

// The needle's own frame: its tail at the origin, climbing at 30 degrees,
// the nose at the top right of the view box. The streaks trail off behind
// it, ragged, inside the box.
const L = 420;
// Speed streaks behind it, in its frame: y, thickness, opacity, dash.
const streaks: [number, number, number, string][] = [
  [-30, 6, 0.45, "260 30"],
  [-14, 3, 0.35, "120 40"],
  [16, 5, 0.5, "320 22"],
  [30, 2, 0.3, "18 60"],
  [44, 8, 0.25, "260 30"],
  [70, 3, 0.2, "40 40"],
  [96, 12, 0.15, "120 22"],
];

export function Needle() {
  return (
    <svg viewBox="-260 -270 700 400" preserveAspectRatio="xMaxYMid meet" className="needle-svg">
      <g transform="rotate(-30)">
        <g className="needle">
          {streaks.map(([y, t, o, dash], i) => (
            <line
              key={i}
              x1={-150 - ((i * 37) % 5) * 22}
              y1={y}
              x2={L * 0.6}
              y2={y}
              strokeWidth={t}
              strokeDasharray={dash}
              opacity={o}
              style={{ stroke: `var(${i % 3 === 0 ? "--paint-needle" : "--paint-streak"})` }}
            />
          ))}
          <path d={`M0 -20L${L} -3L${L + 60} 0L${L} 3L0 22Z`} style={fill("--paint-needle")} />
          <path d={`M0 -3L${L + 40} -0.8L${L + 40} 0.8L0 3Z`} style={fill("--paint-cheatline")} />
          <path d={`M0 6L${L * 0.86} 3L${L * 0.86} 4.4L0 9Z`} style={fill("--paint-band")} />
          <path d={`M${L * 0.5} 6L${L * 0.1} 140L${-L * 0.03} 140L${L * 0.02} 12Z`} style={fill("--paint-needle")} />
          <path d={`M${L * 0.5} 6L${L * 0.1} 140L${L * 0.07} 140L${L * 0.46} 6Z`} style={fill("--paint-band")} />
          <path d={`M${L * 0.05} -18L${-L * 0.01} -140L${L * 0.07} -140L${L * 0.2} -14Z`} style={fill("--paint-needle")} />
          <rect x={L * 0.035} y="-104" width="30" height="18" style={fill("--paint-cheatline")} />
        </g>
      </g>
    </svg>
  );
}
