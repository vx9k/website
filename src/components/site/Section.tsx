import type { ReactNode } from "react";

/** The frame every section shares: a hairline, the title over it, then
 *  the content at the full width of the page. */
export default function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="shell py-20 sm:py-28">
      <h2 id={`${id}-title`} className="label mb-12 border-t pt-6 sm:mb-16">
        {title}
      </h2>
      {children}
    </section>
  );
}
