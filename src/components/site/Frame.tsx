import type { ReactNode } from "react";
import Horizon from "./Horizon";
import Mark from "./Mark";
import { MotionScript, MotionToggle } from "./Motion";

/** The one screen every page is: a panel and the scene.
 *
 *  On wide screens the scene fills the window behind a panel down the left,
 *  which holds the header and the page's content on one solid surface; the
 *  Cerro stands in the open part on the right. On narrower screens the
 *  header runs across the top, the panel across the bottom, and the scene
 *  shows through a window between them, centred on the Cerro.
 *
 *  Nothing sits over the scene, so the text never depends on what's
 *  behind it. */
export default function Frame({ nav, children }: { nav?: ReactNode; children: ReactNode }) {
  return (
    <div className="frame">
      <header className="frame-head">
        <a href="/" className="inline-flex min-h-10 items-center gap-3 font-semibold">
          <Mark />
          vx
        </a>
        <nav aria-label="More">
          <ul className="flex items-center gap-4 sm:gap-6">
            {nav}
            <li>
              <MotionToggle />
            </li>
          </ul>
        </nav>
      </header>
      <MotionScript />

      <div aria-hidden className="stage">
        <Horizon />
      </div>

      <main id="main" tabIndex={-1} className="frame-main focus:outline-none">
        {children}
      </main>
    </div>
  );
}
