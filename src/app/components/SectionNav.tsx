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

/** Section links in the header, from tablet width up. */
export default function SectionNav() {
  const active = useActiveSection();

  return (
    <nav aria-label="Sections" className="hidden md:block">
      <ul className="flex items-center gap-1 lg:gap-3">
        {sections.slice(1).map((s) => {
          const current = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={current ? "location" : undefined}
                className={`relative inline-flex min-h-11 items-center px-3 text-[0.95rem] font-medium tracking-[-0.01em] transition-colors ${
                  current ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {s.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 bottom-2 h-px bg-ember transition-opacity ${
                    current ? "opacity-100" : "opacity-0"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
