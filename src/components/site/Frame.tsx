import type { ReactNode } from "react";
import Mark from "./Mark";
import { MotionScript, MotionToggle } from "./Motion";
import Poster from "./Poster";

/** The one screen every page is: a poster and a console.
 *
 *  On wide screens the poster stands down the left, full height, with its
 *  paper strip at the foot, and the console fills the right: the header
 *  and the page's content on one solid panel, behind an orange and black
 *  pillar like those on an ES EVM mainframe. On narrower screens the
 *  header runs across the top, the poster shows through a band below it,
 *  framed on the aircraft, and the console fills the rest.
 *
 *  Nothing sits over the poster, so the text never depends on what's
 *  behind it. */
export default function Frame({ nav, children }: { nav?: ReactNode; children: ReactNode }) {
  return (
    <div className="frame">
      <header className="frame-head">
        <a href="/" className="brand">
          <Mark />
          vx
        </a>
        <nav aria-label="More">
          <ul className="flex items-center gap-1 sm:gap-2">
            {nav}
            <li>
              <MotionToggle />
            </li>
          </ul>
        </nav>
      </header>
      <MotionScript />

      <Poster />
      <div aria-hidden className="pillar" />

      <main id="main" tabIndex={-1} className="frame-main focus:outline-none">
        {children}
      </main>
    </div>
  );
}
