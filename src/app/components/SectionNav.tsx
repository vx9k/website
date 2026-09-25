"use client";

import { useEffect, useState } from "react";
import { sections } from "../content";

// Tracks which section is in the middle of the viewport. The hero counts
// too, so no link is marked current while it's in view.
const tracked = ["top", ...sections];

function useActiveSection() {
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const els = tracked
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!("IntersectionObserver" in window) || els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}

/** Section links. A sticky sidebar beside the content on wide screens,
 *  after suckless.org's side menu; a single row above it on smaller ones.
 *  A pixel pointer marks the section on screen. */
export default function SectionNav({
  label,
  labels,
}: {
  label: string;
  labels: Record<(typeof sections)[number], string>;
}) {
  const active = useActiveSection();

  return (
    <nav aria-label={label} className="rule-b lg:bg-none">
      <div className="lg:sticky lg:top-0 lg:pt-24">
        <p className="eyebrow hidden pb-3 lg:block">{label}</p>
        <ol className="-ml-2 flex flex-wrap gap-x-2 py-2 lg:ml-0 lg:flex-col lg:py-0">
          {sections.map((id, i) => {
            const current = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={current ? "location" : undefined}
                  className={`group inline-flex min-h-11 items-center gap-2 px-2 lg:px-0 ${current ? "font-semibold" : ""}`}
                >
                  <svg
                    viewBox="0 0 3 5"
                    shapeRendering="crispEdges"
                    aria-hidden
                    focusable="false"
                    className={`hidden h-[10px] w-[6px] fill-ink lg:block ${
                      current ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                  >
                    <path d="M0 0h1v5h-1zM1 1h1v3h-1zM2 2h1v1h-1z" />
                  </svg>
                  <span aria-hidden className="font-label text-[0.7rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`px-0.5 underline-offset-[0.35em] group-hover:bg-ink group-hover:text-bg ${
                      current ? "underline decoration-ink decoration-[length:var(--px)] lg:no-underline" : ""
                    }`}
                  >
                    {labels[id]}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
