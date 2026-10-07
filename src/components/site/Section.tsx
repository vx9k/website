import type { ReactNode } from "react";
import { sections } from "@/app/content";

/** The frame every section below the intro shares, on the white page:
 *  the title on the left and the number on the right, over a rule, then
 *  the content. */
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
    <section id={id} aria-labelledby={`${id}-title`} data-branch-view={id} className="sect shell relative isolate py-24 sm:py-32">
      <header className="sect-head mb-12 flex items-end justify-between gap-6 border-b pb-5 sm:mb-16">
        <h2 id={`${id}-title`} className="sect-title text-title">
          {title}
        </h2>
        <p aria-hidden className="label pb-2">
          {number} / {String(sections.length).padStart(2, "0")}
        </p>
      </header>
      {children}
    </section>
  );
}
