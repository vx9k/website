import type { ReactNode } from "react";

/** The frame every section below the intro shares: a title led by one ink
 *  pixel, an optional aside, then the content. */
export default function Section({
  id,
  title,
  aside,
  children,
}: {
  id: string;
  title: string;
  aside?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-16 scroll-mt-6">
      <h2 id={`${id}-title`} className="flex items-center gap-3 text-heading font-semibold">
        <span aria-hidden className="size-[calc(2*var(--px))] shrink-0 bg-ink" />
        {title}
      </h2>
      {aside && <p className="mt-2 text-soft text-pretty">{aside}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
