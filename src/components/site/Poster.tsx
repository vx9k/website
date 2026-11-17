import type { CSSProperties } from "react";
import { year } from "@/app/github";

/** The poster: a supersonic airliner climbing through a night sky above
 *  the Earth's rim, in the manner of the Aeroflot posters of the 1960s,
 *  painted in gouache: flat ink, dry-brush streaks along the line of
 *  flight, white and red on blue. All of it is SVG drawn here, so the page
 *  ships no image for it. Under it, the poster's paper strip: the wordmark
 *  on the left and the year stacked in red on the right.
 *
 *  The drawing is framed on the aircraft (the viewBox) and painted well
 *  past it (overflow: visible), so any window it's shown through, tall on
 *  wide screens or a short band on phones, shows the whole aircraft with
 *  sky around it. Decorative: the page says everything in text. */

// A small fixed generator, so the stars fall in the same places on every
// build and the markup never changes without a reason.
function stars(seed: number, n: number) {
  let s = seed;
  const r = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  return Array.from({ length: n }, (_, i) => ({ x: -700 + r() * 2100, y: -560 + r() * 1700, r: 0.6 + r() * r() * 2.2, i }));
}
const field = stars(1967, 190);
const sparkles = [
  [118, 70, 11],
  [242, 30, 6],
  [520, 250, 7],
  [600, 360, 9],
  [70, 230, 7],
  [688, 470, 6],
  [330, 140, 5],
  [-120, 120, 9],
  [860, 160, 10],
  [-60, 420, 6],
  [790, 560, 7],
  [430, -60, 8],
];
// A four-pointed glint, the poster's bright stars.
const glint = (x: number, y: number, s: number) =>
  `M${x} ${y - s}L${x + s * 0.16} ${y - s * 0.16}L${x + s} ${y}L${x + s * 0.16} ${y + s * 0.16}L${x} ${y + s}L${x - s * 0.16} ${y + s * 0.16}L${x - s} ${y}L${x - s * 0.16} ${y - s * 0.16}Z`;

// Speed streaks behind the aircraft, in its own frame: [y, height, opacity, dash].
const streaks: [number, number, number, string][] = [
  [-9, 3, 0.55, "260 30 120 18"],
  [-3, 2, 0.4, "180 22 300 40"],
  [4, 5, 0.6, "320 24 90 30"],
  [11, 2, 0.35, "140 30 220 16"],
  [16, 4, 0.5, "240 20 160 26"],
  [24, 2, 0.3, "90 18 260 40"],
  [34, 6, 0.28, "380 30 120 50"],
  [52, 3, 0.22, "200 40 300 60"],
  [72, 8, 0.16, "420 60 180 80"],
];

export default function Poster() {
  return (
    <div aria-hidden className="poster">
      <div className="poster-art">
        <svg viewBox="40 40 660 540" preserveAspectRatio="xMidYMid meet" overflow="visible" className="poster-svg">
          <defs>
            {/* Gouache: fractal noise, cut into a few flat steps of
                alpha and coloured, so it reads as brushed paint rather
                than a gradient. */}
            <filter id="wash" x="-700" y="-600" width="2100" height="1800" filterUnits="userSpaceOnUse">
              <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="4" seed="17" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.18  0 0 0 0 0.5  3 0 0 0 -1.3" />
              <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0 0.45 0.8 1" />
              </feComponentTransfer>
            </filter>
            <filter id="brush" x="-1200" y="-200" width="2400" height="400" filterUnits="userSpaceOnUse">
              <feTurbulence type="fractalNoise" baseFrequency="0.002 0.09" numOctaves="3" seed="4" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.4  0 0 0 0 0.82  3.4 0 0 0 -1.8" />
              <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0 0 0.35 0.7" />
              </feComponentTransfer>
            </filter>
            <filter id="speck" x="-700" y="-600" width="2100" height="1800" filterUnits="userSpaceOnUse">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="9" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.6  0 0 0 0 0.95  6 0 0 0 -4.1" />
            </filter>
          </defs>

          <rect x="-700" y="-600" width="2100" height="1800" fill="var(--p-night)" />
          <rect x="-700" y="-600" width="2100" height="1800" filter="url(#wash)" />
          <rect x="-700" y="-600" width="2100" height="1800" filter="url(#speck)" opacity="0.35" />

          {/* Dry-brush strokes along the line of flight. */}
          <g transform="translate(150 470) rotate(-34)">
            <rect x="-1200" y="-200" width="2400" height="400" filter="url(#brush)" />
          </g>

          <g className="stars">
            {field.map((s) => (
              <circle
                key={s.i}
                cx={s.x.toFixed(1)}
                cy={s.y.toFixed(1)}
                r={s.r.toFixed(2)}
                className={s.i % 9 === 0 ? "twinkle" : undefined}
                style={s.i % 9 === 0 ? ({ "--d": `${(s.i % 7) * 0.7}s` } as CSSProperties) : undefined}
              />
            ))}
            {sparkles.map(([x, y, s], i) => (
              <path key={i} d={glint(x, y, s)} className="twinkle" style={{ "--d": `${i * 0.45}s` } as CSSProperties} />
            ))}
          </g>
          {/* A far planet, the poster's one warm dot. */}
          <circle cx="160" cy="104" r="7" fill="var(--p-planet)" />

          {/* A shooting star, now and then. */}
          <g className="meteor">
            <path d="M600 -40 l-120 70" stroke="var(--p-star)" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* The Earth's rim, far below. */}
          <circle cx="380" cy="1580" r="960" fill="var(--p-earth)" />
          <circle cx="380" cy="1580" r="960" fill="none" stroke="var(--p-rim)" strokeWidth="3" />
          <circle cx="380" cy="1580" r="972" fill="none" stroke="var(--p-rim)" strokeWidth="1" opacity="0.4" />

          <g className="jet-path" transform="translate(150 470) rotate(-34)">
            <g className="jet">
              {/* Streaks and afterglow behind it. */}
              <g className="trails">
                {streaks.map(([y, h, o, dash], i) => (
                  <line
                    key={i}
                    x1="-1100"
                    y1={y}
                    x2="-6"
                    y2={y}
                    stroke={i % 3 === 0 ? "var(--p-star)" : "var(--p-cobalt)"}
                    strokeWidth={h}
                    strokeDasharray={dash}
                    opacity={o}
                    className={`trail trail-${i % 3}`}
                  />
                ))}
              </g>
              <rect x="20" y="16" width="16" height="7" fill="var(--p-flame)" className="flame" />
              <rect x="22" y="25" width="14" height="6" fill="var(--p-flame)" className="flame flame-2" />

              {/* Engines under the wing. */}
              <path d="M34 14 H128 L136 22 L128 32 H34 Z" fill="var(--p-shade)" />
              <path d="M34 14 H128 L132 18 H34 Z" fill="var(--p-white)" />

              {/* Fin, with the flag and the band of the old livery. */}
              <path d="M6 -12 C10 -50 13 -88 16 -112 L52 -110 C62 -84 80 -44 98 -12 Z" fill="var(--p-white)" />
              <path d="M10 -36 L80 -36 L88 -24 L8 -24 Z" fill="var(--p-blue)" />
              <path d="M16 -112 L52 -110 L56 -100 L15 -102 Z" fill="var(--p-blue)" />
              <rect x="22" y="-78" width="26" height="16" fill="var(--p-red)" />
              <text x="16" y="-44" className="jet-reg">
                VX-9000
              </text>

              {/* Fuselage: a long needle, shaded underneath. */}
              <path
                d="M0 -13 C120 -15 380 -14 470 -10 C540 -7 588 -3 614 0 C588 3 540 6 470 8 C380 11 120 12 0 12 Z"
                fill="var(--p-white)"
              />
              <path d="M0 4 C120 5 380 5 470 4 C540 3 588 1 614 0 C588 3 540 6 470 8 C380 11 120 12 0 12 Z" fill="var(--p-shade)" />
              <path d="M6 -1.5 H520 C548 -1 570 -0.5 590 0 C570 0.5 548 1 520 1.5 H6 Z" fill="var(--p-red)" />
              <path d="M6 2.5 H470 L470 4 H6 Z" fill="var(--p-blue)" />
              <line x1="120" y1="-6" x2="468" y2="-6" stroke="var(--p-window)" strokeWidth="2.2" strokeDasharray="2.4 3.6" />
              <text x="250" y="-9" className="jet-name">
                KTHREAD
              </text>

              {/* The ogival delta wing, towards us and below. */}
              <path d="M340 7 C268 28 170 82 98 112 L72 116 L56 104 C50 70 38 34 24 9 Z" fill="var(--p-white)" />
              <path d="M98 112 L72 116 L56 104 C50 70 38 34 24 9 L44 9 C54 40 64 76 76 104 Z" fill="var(--p-shade)" />
              <path d="M340 7 C268 28 170 82 98 112 L94 108 C168 76 262 25 330 7 Z" fill="var(--p-blue)" opacity="0.7" />
              <text x="150" y="58" className="jet-num" transform="rotate(-24 150 58)">
                9000
              </text>
            </g>
          </g>
        </svg>
      </div>

      <div className="poster-strip">
        <div className="flex flex-col">
          <span className="poster-word">VX</span>
          <span className="poster-sub">kthread.dev</span>
        </div>
        <div className="poster-year">
          <span>{year.slice(0, 2)}</span>
          <span>{year.slice(2)}</span>
        </div>
      </div>
    </div>
  );
}
