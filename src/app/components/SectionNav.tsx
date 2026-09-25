"use client";

import { useEffect, useState } from "react";
import { sections } from "../content";

// Tracks which section is in the middle of the viewport.
function useActiveSection() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
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

/** Numbered section links in the header, from tablet width up. */
export default function SectionNav() {
  const active = useActiveSection();

  return (
    <nav aria-label="Sections" className="hidden md:block">
      <ul className="flex items-center">
        {sections.slice(1).map((s, i) => {
          const current = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={current ? "location" : undefined}
                className={`eyebrow inline-flex min-h-11 items-center gap-2 px-3 transition-colors hover:text-ink! ${
                  current ? "text-ink!" : ""
                }`}
              >
                <span
                  aria-hidden
                  className={`size-1.5 transition-colors ${
                    current ? "bg-moss" : "bg-line-strong"
                  }`}
                />
                <span aria-hidden className="text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
