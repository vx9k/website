import type { ReactNode } from "react";

/** The screen set into the bezel: a one-pixel line, then the screen. The
 *  line keeps the screen's edge visible at night, when the screen and the
 *  bezel are both brown. */
export default function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="notch bg-line p-(--px)">
      <div className="notch bg-bg pt-6">{children}</div>
    </div>
  );
}
