import type { CSSProperties } from "react";
import { lines } from "@/app/content";

// Hydrogen's visible emission lines, drawn where they fall on a scale from
// 380 to 700 nm. Server components: plain markup and CSS (`.spectrum` in
// globals.css).

type Place = keyof typeof lines;

const order = Object.keys(lines) as Place[];

/** Where a wavelength (nm) falls across the scale, as a percentage. */
export const position = (nm: number) => `${(((nm - 380) / (700 - 380)) * 100).toFixed(2)}%`;

const style = (place: Place, i: number) =>
  ({
    "--x": position(lines[place]),
    "--line": `var(--line-${lines[place]})`,
    // Each line breathes at its own pace.
    "--t": `${4 + i * 1.3}s`,
  }) as CSSProperties;

/** The four lines, small, as the mark before "vx". */
export function SpectrumMark() {
  return (
    <span aria-hidden className="spectrum-mark">
      {order.map((place) => (
        <span key={place} style={{ "--line": `var(--line-${lines[place]})` } as CSSProperties} />
      ))}
    </span>
  );
}

/** The index under the introduction: each line a link to its place. */
export function SpectrumIndex({ names }: { names: Record<Place, string> }) {
  return (
    <div className="spectrum">
      <ul className="spectrum-index shell">
        {order.map((place, i) => (
          <li key={place} style={style(place, i)} data-side={i % 2 ? "down" : "up"}>
            <span aria-hidden className="spectrum-line" />
            <a href={`#${place}`} className="spectrum-link">
              <span aria-hidden className="label">
                {String(i).padStart(2, "0")} · {lines[place]} nm
              </span>
              <span className="name">{names[place]}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The same lines without words, above the footer. */
export function SpectrumStrip() {
  return (
    <div aria-hidden className="spectrum spectrum-strip">
      <div className="shell relative h-full">
        {order.map((place, i) => (
          <span key={place} className="spectrum-line" style={style(place, i)} />
        ))}
      </div>
    </div>
  );
}
