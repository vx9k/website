import type { ReactNode } from "react";
import { sections } from "@/app/content";

/** The frame every section below the intro shares, as a band across the
 *  page: from lg up, its number and title stay pinned on the left while
 *  the content scrolls past on the right; below that, they stack. */
export default function Section({
  id,
  title,
  children,
}: {
  id: (typeof sections)[number];
  title: string;
  children: ReactNode;
}) {
  const number = String(sections.indexOf(id) + 1).padStart(2, "0");
  return (
    <div className="band">
      <section
        id={id}
        aria-labelledby={`${id}-title`}
        data-branch-view={id}
        className="split shell relative isolate grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
      >
        <header className="flex flex-col gap-4 self-start lg:sticky lg:top-24">
          <p aria-hidden className="label">
            {number} / {String(sections.length).padStart(2, "0")}
          </p>
          <h2 id={`${id}-title`} className="text-title font-medium text-balance">
            {title}
          </h2>
        </header>
        <div className="reveal min-w-0">{children}</div>
      </section>
    </div>
  );
}
