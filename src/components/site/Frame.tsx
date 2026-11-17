import type { ReactNode } from "react";
import Lamps from "./Lamps";
import { MotionScript, MotionToggle } from "./Motion";
import { Needle, Texture } from "./Paint";

/** The one screen every page is, laid out like a 1960s Aeroflot poster.
 *
 *  Above, the painted field: the wordmark and the header on it, and the
 *  slogan (the page's h1) resting at its foot. Across the middle, the lamp
 *  bar: vx's contribution calendar as a mainframe console's lamp row.
 *  Below, the paper strip: the poster's band of plain paper, here holding
 *  the page's content. The field takes whatever height is left, so the
 *  whole thing is one screen at every size.
 *
 *  The only text on the paint is the header and the slogan, in the
 *  field's ink, kept clear of the needle on every layout. */
export default function Frame({ slogan, nav, children }: { slogan: ReactNode; nav?: ReactNode; children: ReactNode }) {
  return (
    <div className="frame">
      <div className="field">
        <div aria-hidden className="field-paint">
          <Texture />
        </div>
        <header className="field-head">
          <a href="/" className="wordmark" aria-label="vx, home">
            VX
          </a>
          <nav aria-label="More">
            <ul className="nav">
              {nav}
              <li>
                <MotionToggle />
              </li>
            </ul>
          </nav>
        </header>
        <MotionScript />
        <div aria-hidden className="needle-box">
          <Needle />
        </div>
        <h1 className="slogan">{slogan}</h1>
      </div>

      <Lamps />

      <main id="main" tabIndex={-1} className="strip focus:outline-none">
        {children}
      </main>
    </div>
  );
}
