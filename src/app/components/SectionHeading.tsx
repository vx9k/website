import type { ReactNode } from "react";

// Every section below the hero shares this frame: a full-bleed rule with
// crosshairs where it meets the background grid, the index and name in the
// left quarter, and the title and content in the remaining three.
export default function Section({
  id,
  index,
  kicker,
  title,
  aside,
  children,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  aside?: string;
  children: ReactNode;
}) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="rule-bleed grid pt-16 pb-24 sm:pt-20 sm:pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]"
    >
      <span aria-hidden className="cross left-0" />
      <span aria-hidden className="cross left-1/4 hidden lg:block" />
      <span aria-hidden className="cross left-full" />

      <div className="reveal lg:pr-8">
        <p className="eyebrow flex items-center gap-3 lg:sticky lg:top-24">
          <span className="text-moss">{index}</span>
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          {kicker}
        </p>
      </div>

      <div className="min-w-0 lg:pl-10">
        <div className="reveal mt-8 lg:mt-0">
          <h2
            id={titleId}
            className="text-title font-medium tracking-[-0.045em] text-balance"
          >
            {title}
          </h2>
          {aside && (
            <p className="mt-6 max-w-[34rem] text-lede text-pretty text-muted">
              {aside}
            </p>
          )}
        </div>
        <div className="mt-14 sm:mt-20">{children}</div>
      </div>
    </section>
  );
}
