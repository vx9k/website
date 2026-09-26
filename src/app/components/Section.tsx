import type { ReactNode } from "react";
import { sections } from "../content";

/** The frame every section below the intro shares: a hairline across the
 *  column, then the number and title on the left and the content on the
 *  right. On small screens the two stack. */
export default function Section({
  id,
  title,
  aside,
  children,
}: {
  id: (typeof sections)[number];
  title: string;
  aside?: string;
  children: ReactNode;
}) {
  const number = String(sections.indexOf(id) + 1).padStart(2, "0");
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="wrap">
      <div className="grid gap-x-12 gap-y-8 border-t border-line pt-6 pb-24 lg:grid-cols-12 lg:pb-36">
        <header className="lg:sticky lg:top-8 lg:col-span-4 lg:self-start">
          <p aria-hidden className="label">
            {number}
          </p>
          <h2 id={`${id}-title`} className="mt-3 text-3xl font-medium tracking-tight">
            {title}
          </h2>
        </header>
        <div className="lg:col-span-8">
          {aside && <p className="mb-10 max-w-[40rem] text-lg text-muted text-pretty">{aside}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
