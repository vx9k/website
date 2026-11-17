import type { ReactNode } from "react";

// Buttons open and close the dialogs with invoker commands (command and
// commandfor), so the popups work without JavaScript. React's types don't
// know the attributes yet, hence the spreads.
export const opens = (id: string) => ({ command: "show-modal", commandfor: id }) as Record<string, string>;
const closes = (id: string) => ({ command: "close", commandfor: id }) as Record<string, string>;

/** A modal dialog over the page, cut from the poster's paper strip: a
 *  drawer from the right on wide screens, a sheet from the bottom on
 *  narrow ones, with the red rule of the cheatline along its top. The
 *  title, a line under it if there is one, and a Close button, then the
 *  content, which scrolls inside the dialog if it's taller than the
 *  screen. Esc closes it, and so does a click outside it where the
 *  browser supports closedby. Opening it focuses the Close button. */
export default function Sheet({ id, title, sub, children }: { id: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <dialog id={id} aria-labelledby={`${id}-title`} className="sheet" {...({ closedby: "any" } as Record<string, string>)}>
      <div className="sheet-head">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id={`${id}-title`} className="sheet-title">
            {title}
          </h2>
          {sub && <p className="sheet-sub">{sub}</p>}
        </div>
        <button type="button" {...closes(id)} className="key">
          Close<span className="sr-only"> {title}</span>
        </button>
      </div>
      <div className="sheet-body">{children}</div>
    </dialog>
  );
}
