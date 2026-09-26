import type { ReactNode } from "react";
import { sections } from "@/app/content";

/** The frame every section below the intro shares: its number and title
 *  above the content, in the one centred column. */
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
    <section id={id} aria-labelledby={`${id}-title`} className="shell py-12 sm:py-16">
      <header className="mb-8 flex flex-col gap-2">
        <p aria-hidden className="label">
          {number}
        </p>
        <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}
