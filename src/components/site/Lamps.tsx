import type { CSSProperties } from "react";
import { day, github } from "@/app/github";

/** vx's GitHub contribution calendar, shown as the lamp field of a
 *  mainframe console: one column of seven lamps a week, each lit to
 *  GitHub's own level for that day. The most recent weeks are on the
 *  right, and narrow panels show only as many as fit. A few lamps blink,
 *  as a console's do while it works. The data is refreshed daily
 *  (scripts/github.mjs); the label says what it shows, in words. */
export default function Lamps({ className = "" }: { className?: string }) {
  const cal = github.calendar;
  if (!cal) return null;
  const label = `${cal.total.toLocaleString("en-US")} contributions on GitHub in the year to ${day(cal.end)}`;
  return (
    <figure className={`lamps-panel ${className}`}>
      <div role="img" aria-label={label} className="lamps">
        {cal.weeks.map((week, w) => (
          <div key={w} className="lamp-week">
            {week.map((level, d) => {
              const n = w * 7 + d;
              const blink = level > 0 && n % 13 === 5;
              return (
                <span
                  key={d}
                  className={`lamp l${level}${blink ? " blink" : ""}`}
                  style={blink ? ({ "--d": `${(n % 11) * 0.37}s` } as CSSProperties) : undefined}
                />
              );
            })}
          </div>
        ))}
      </div>
      <figcaption className="plate-caption">
        <span>Activity</span>
        <span>{label.replace(" on GitHub", "")}</span>
      </figcaption>
    </figure>
  );
}
