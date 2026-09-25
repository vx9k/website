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

/** Compact links in the floating header, for tablet and small laptops. */
export function HeaderNav() {
  const active = useActiveSection();

  return (
    <nav aria-label="Sections" className="hidden md:block xl:hidden">
      <ul className="flex items-center gap-1">
        {sections.slice(1).map((s) => {
          const current = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={current ? "location" : undefined}
                className={`relative inline-flex min-h-11 items-center rounded-full px-3.5 text-sm transition-colors ${
                  current ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {s.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-3.5 bottom-2 h-px bg-moss transition-opacity ${
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

/**
 * Desktop side rail, laid out like `ps` output. The section on screen is
 * R (running); the rest are S (sleeping).
 */
export function ProcessRail() {
  const active = useActiveSection();

  return (
    <nav
      aria-label="Sections"
      className="no-print sticky top-28 hidden self-start pt-24 xl:block"
    >
      <div className="font-mono text-xs">
        <p
          aria-hidden
          className="grid grid-cols-[3.25rem_1fr_1.5rem] border-b border-line pb-2.5 text-faint"
        >
          <span>PID</span>
          <span>COMM</span>
          <span className="text-right">S</span>
        </p>
        <ul className="py-1.5">
          {sections.map((s, i) => {
            const current = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={current ? "location" : undefined}
                  className={`group grid min-h-10 grid-cols-[3.25rem_1fr_1.5rem] items-center rounded-md transition-colors ${
                    current ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  <span aria-hidden className="text-faint">
                    {String(i + 1).padStart(4, "0")}
                  </span>
                  <span>{s.comm}</span>
                  <span
                    aria-hidden
                    className={`text-right ${current ? "text-moss" : "text-faint"}`}
                  >
                    {current ? "R" : "S"}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        <p aria-hidden className="border-t border-line pt-2.5 text-faint">
          R running · S sleeping
        </p>
      </div>
    </nav>
  );
}
