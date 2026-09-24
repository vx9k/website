"use client";

import { useState } from "react";

const areas = [
  {
    id: "systems",
    label: "Systems programming",
    body: "Software written close to the machine: memory-safe where it counts, predictable under load, and built to the standards its callers depend on rather than to whatever the current platform happens to allow.",
  },
  {
    id: "portability",
    label: "Portability & standards",
    body: "Code that outlives the machine it was written on. Preferring POSIX interfaces over vendor extensions, and treating 'works on my machine' as a bug, not a milestone.",
  },
];

export default function FocusAreas() {
  const [active, setActive] = useState(areas[0].id);
  const current = areas.find((a) => a.id === active)!;

  return (
    <section className="border-b border-hairline px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-mono text-sm text-muted">Areas of focus</h2>

        <div className="mt-8 flex flex-col gap-0 border-t border-hairline sm:flex-row">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setActive(area.id)}
              className={`flex-1 border-b border-hairline px-0 py-4 text-left font-mono text-sm transition-colors sm:border-b-0 sm:border-r sm:px-5 last:sm:border-r-0 ${
                active === area.id
                  ? "text-signal"
                  : "text-muted hover:text-foreground"
              }`}
              aria-pressed={active === area.id}
            >
              {area.label}
            </button>
          ))}
        </div>

        <p className="mt-8 max-w-2xl font-sans text-base leading-7 text-muted sm:text-lg">
          {current.body}
        </p>
      </div>
    </section>
  );
}
