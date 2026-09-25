import type { ReactNode } from "react";

// Every section below the hero shares this frame: a numbered mono label,
// a large title with an optional aside beside it, then the content.
// Centred on phones, left-aligned from tablet width up.
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
      className="pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-32 lg:pb-36"
    >
      <div className="reveal grid gap-8 text-center sm:text-left lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end lg:gap-20">
        <div>
          <p className="eyebrow flex items-center justify-center gap-3 sm:justify-start">
            <span className="text-ember">{index}</span>
            <span aria-hidden className="draw h-px w-10 bg-ember" />
            {kicker}
          </p>
          <h2
            id={titleId}
            className="mt-5 text-title font-medium text-balance"
          >
            {title}
          </h2>
        </div>
        {aside && (
          <p className="text-lede text-pretty text-muted lg:pb-1">{aside}</p>
        )}
      </div>
      <div className="mt-14 sm:mt-20">{children}</div>
    </section>
  );
}
