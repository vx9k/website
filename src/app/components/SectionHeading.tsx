import type { ReactNode } from "react";

// Every section below the hero shares this frame: a numbered mono label
// led by a single rust pixel, a title, an optional aside under it, then
// the content. Left-aligned at every width, like a plain document.
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
    <section id={id} aria-labelledby={titleId} className="py-16 sm:py-20 lg:py-24">
      <header className="reveal max-w-[44rem]">
        <p className="eyebrow flex items-center gap-2.5">
          <span aria-hidden className="size-[6px] bg-accent" />
          <span>{index}</span>
          <span aria-hidden>
            /
          </span>
          {kicker}
        </p>
        <h2 id={titleId} className="mt-4 text-title font-medium text-balance">
          {title}
        </h2>
        {aside && (
          <p className="mt-4 text-lede text-pretty">{aside}</p>
        )}
      </header>
      <div className="mt-10 sm:mt-12">{children}</div>
    </section>
  );
}
