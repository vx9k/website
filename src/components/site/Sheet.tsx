import type { ReactNode } from "react";

// Buttons open and close the dialogs with invoker commands (command and
// commandfor), so the popups work without JavaScript. React's types don't
// know the attributes yet, hence the spreads.
export const opens = (id: string) => ({ command: "show-modal", commandfor: id }) as Record<string, string>;
const closes = (id: string) => ({ command: "close", commandfor: id }) as Record<string, string>;

/** A modal dialog over the scene: a title with a close button, then the
 *  content, which scrolls inside the dialog if it's taller than the
 *  screen. Esc closes it, and so does a click outside it where the browser
 *  supports closedby. Opening it focuses the close button, the first
 *  control in it. */
export default function Sheet({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <dialog id={id} aria-labelledby={`${id}-title`} className="sheet" {...({ closedby: "any" } as Record<string, string>)}>
      <div className="sticky top-0 z-[1] flex items-start justify-between gap-6 border-b bg-surface px-5 pt-5 pb-4 sm:px-8 sm:pt-7">
        <div className="flex flex-col gap-1">
          <p className="label">{eyebrow}</p>
          <h2 id={`${id}-title`} className="text-title">
            {title}
          </h2>
        </div>
        <button type="button" {...closes(id)} className="label inline-flex min-h-10 shrink-0 items-center gap-2 border px-3 text-foreground hover:border-foreground">
          Close<span className="sr-only"> {title}</span>
          <kbd aria-hidden className="hidden text-muted sm:inline">
            Esc
          </kbd>
        </button>
      </div>
      <div className="px-5 pt-6 pb-8 sm:px-8 sm:pb-10">{children}</div>
    </dialog>
  );
}
