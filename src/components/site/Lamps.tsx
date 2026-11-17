import type { CSSProperties } from "react";
import { day, github } from "@/app/github";

/** The lamp bar between the paint and the paper: vx's GitHub contribution
 *  calendar as the lamp row of an ES EVM console, one column of seven
 *  lamps a week, each lit to GitHub's own level for that day. The newest
 *  weeks are on the right; narrow screens show as many as fit. A few lamps
 *  blink while motion is on. scripts/github.mjs refreshes it daily, and
 *  the caption says in words what it shows. */
export default function Lamps() {
  const cal = github.calendar;
  if (!cal) return null;
  const total = cal.total.toLocaleString("en-US");
  return (
    <figure className="lampbar">
      <div className="lamps" aria-hidden>
        {cal.weeks.map((week, w) => (
          <div key={w} className="lamp-week">
            {week.map((level, d) => {
              const n = w * 7 + d;
              const blink = level > 0 && n % 13 === 5;
              return (
                <span
                  key={d}
                  className={`lamp l${level}${blink ? " blink" : ""}`}
                  style={blink ? ({ "--d": `${((n % 11) * 0.37).toFixed(2)}s` } as CSSProperties) : undefined}
                />
              );
            })}
          </div>
        ))}
      </div>
      <figcaption className="lamp-caption">
        <strong>{total}</strong> contributions on GitHub in the year to {day(cal.end)}
      </figcaption>
    </figure>
  );
}
