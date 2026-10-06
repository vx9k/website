import type { CSSProperties, ReactNode } from "react";
import { lines, sections } from "@/app/content";

/** The frame every section below the intro shares. It takes the
 *  section's spectral line (content.ts): a rule across the page in its
 *  colour, then its number and wavelength, the title as large as the
 *  page allows, condensed, and the content. `tone="block"` sets the
 *  section on a full-width block of its colour instead (globals.css). */
export default function Section({
  id,
  title,
  tone,
  children,
}: {
  id: (typeof sections)[number];
  title: string;
  tone?: "block";
  children: ReactNode;
}) {
  const number = String(sections.indexOf(id) + 1).padStart(2, "0");
  return (
    <div className="sect-wrap overflow-x-clip" data-tone={tone} style={{ "--line": `var(--line-${lines[id]})` } as CSSProperties}>
      <section
        id={id}
        aria-labelledby={`${id}-title`}
        data-branch-view={id}
        className="sect shell relative isolate py-20 sm:py-28"
      >
        <header className="sect-head mb-12 flex flex-col gap-5 sm:mb-16">
          <p aria-hidden className="label flex items-center gap-3">
            <span className="line-tick" />
            {number}
            <span className="nm">· {lines[id]} nm</span>
          </p>
          <h2 id={`${id}-title`} className="sect-title text-title">
            {title}
          </h2>
        </header>
        {children}
      </section>
    </div>
  );
}
