"use client";

import { useEffect, useId, useRef, useState } from "react";

type Key = "day" | "motion" | "large";
type Flags = Partial<Record<Key, boolean>>;

type Option = { label: string; hint: string };

export type FlagsText = Record<Key, Option> & {
  button: string;
  label: string;
  systemOn: string;
  note: string;
};

const KEYS: Key[] = ["day", "motion", "large"];

function systemWantsLessMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

// What each switch shows. Daylight shows the theme on screen, whether it
// came from a saved choice, the system or the sun in the hero; the others
// show the saved flag.
function current(): Flags {
  const saved = window.__vxFlags?.read() ?? {};
  return {
    day: document.documentElement.getAttribute("data-theme") !== "night",
    motion: !!saved.motion,
    large: !!saved.large,
  };
}

export default function FlagsPanel({ text }: { text: FlagsText }) {
  const [open, setOpen] = useState(false);
  const [flags, setFlags] = useState<Flags>({});
  const [systemMotion, setSystemMotion] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    setFlags(current());
    setSystemMotion(systemWantsLessMotion());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  function toggle(key: Key) {
    const api = window.__vxFlags;
    if (!api) return;
    const next = { ...flags, [key]: !flags[key] };
    api.save({ ...api.read(), [key]: next[key] });
    api.apply();
    setFlags(next);
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="btn min-h-10! px-3! text-base!"
      >
        <svg
          viewBox="0 0 7 7"
          shapeRendering="crispEdges"
          aria-hidden="true"
          focusable="false"
          className="size-3.5 fill-current"
        >
          <path d="M0 1h7v1H0zM4 0h1v3H4zM0 5h7v1H0zM1 4h1v3H1z" />
        </svg>
        <span className="sr-only sm:not-sr-only">{text.button}</span>
      </button>

      <div
        id={panelId}
        role="group"
        aria-label={text.label}
        hidden={!open}
        className="px-frame absolute top-[calc(100%+0.75rem)] right-[var(--px)] z-50 w-[min(21rem,calc(100vw-2.5rem))] bg-bg"
      >
        <p className="eyebrow rule-b px-4 py-3">{text.button}</p>
        <ul className="p-1">
          {KEYS.map((key) => {
            const on = !!flags[key];
            const noteId = `${panelId}-${key}`;
            const hint =
              key === "motion" && systemMotion && !on ? text.systemOn : text[key].hint;
            return (
              <li key={key}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-describedby={noteId}
                  onClick={() => toggle(key)}
                  className="flex min-h-14 w-full items-center gap-4 px-3 py-2.5 text-left hover:bg-ink hover:text-bg"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{text[key].label}</span>
                    <span id={noteId} className="block text-sm leading-5">
                      {hint}
                    </span>
                  </span>
                  <span aria-hidden className="px-switch" data-on={on} />
                </button>
              </li>
            );
          })}
        </ul>
        <p className="rule-t px-4 py-3 text-sm leading-5">{text.note}</p>
      </div>
    </div>
  );
}
