import type { ReactNode } from "react";

/** The frame every section shares: a hairline, the title in the left
 *  column on wide screens, the content in the right. */
export default function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="shell py-20 sm:py-28">
      <div className="grid gap-10 border-t pt-8 md:grid-cols-12 md:gap-8">
        <h2 id={`${id}-title`} className="label md:col-span-3">
          {title}
        </h2>
        <div className="md:col-span-9">{children}</div>
      </div>
    </section>
  );
}
