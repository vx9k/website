import type { ReactNode } from "react";
import { sections } from "../content";

/** The frame every section below the intro shares: a hairline across the
 *  shell, then the number and title on the left and the content on the
 *  right. On small screens the two stack. */
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
    <section id={id} aria-labelledby={`${id}-title`} className="shell">
      <div className="split border-t border-line pt-6 pb-20 lg:grid lg:pb-28">
        <header className="lg:sticky lg:top-8 lg:self-start">
          <p aria-hidden className="label">
            {number}
          </p>
          <h2 id={`${id}-title`} className="mt-3 text-3xl font-medium tracking-tight">
            {title}
          </h2>
        </header>
        <div className="mt-10 lg:mt-0">{children}</div>
      </div>
    </section>
  );
}
