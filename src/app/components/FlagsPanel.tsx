"use client";

import { useEffect, useId, useRef, useState } from "react";

type Key = "contrast" | "motion" | "eink" | "large";
type Flags = Partial<Record<Key, boolean>>;

type Option = { label: string; hint: string };

export type FlagsText = Record<Key, Option> & {
  button: string;
  label: string;
  systemOn: string;
  note: string;
};

// The system preference each switch mirrors, if any.
const OPTIONS: { key: Key; system?: string }[] = [
  { key: "contrast", system: "(prefers-contrast: more)" },
  { key: "motion", system: "(prefers-reduced-motion: reduce)" },
  { key: "eink", system: "(update: slow)" },
  { key: "large" },
];

function systemWants(query?: string) {
  if (!query) return false;
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

export default function FlagsPanel({ text }: { text: FlagsText }) {
  const [open, setOpen] = useState(false);
  const [flags, setFlags] = useState<Flags>({});
  const [system, setSystem] = useState<Partial<Record<Key, boolean>>>({});
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    setFlags(window.__vxFlags?.read() ?? {});
  }, []);

  useEffect(() => {
    if (!open) return;
    setSystem(
      Object.fromEntries(OPTIONS.map((o) => [o.key, systemWants(o.system)])),
    );

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
    const next = { ...flags, [key]: !flags[key] };
    setFlags(next);
    try {
      localStorage.setItem("vx-flags", JSON.stringify(next));
    } catch {
      // Storage can be blocked; the change still applies to this visit.
    }

    const apply = () => window.__vxFlags?.apply();
    const calm =
      document.documentElement.hasAttribute("data-motion") ||
      next.motion === true;
    // Cross-fade between modes where the browser supports it.
    if (!calm && "startViewTransition" in document) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex min-h-11 items-center gap-2.5 rounded-xs border px-4 text-[0.95rem] font-medium text-ink transition-colors hover:border-line-strong hover:bg-raised ${
          open ? "border-line-strong bg-raised" : "border-line"
        }`}
      >
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M3 6h9M16 6h1M3 14h1M8 14h9" />
          <circle cx="14" cy="6" r="2" />
          <circle cx="6" cy="14" r="2" />
        </svg>
        {text.button}
      </button>

      <div
        id={panelId}
        role="group"
        aria-label={text.label}
        hidden={!open}
        className="glass glass-dense absolute top-[calc(100%+0.6rem)] right-0 z-50 w-[min(21rem,calc(100vw-2.5rem))]"
      >
        <p className="eyebrow border-b border-line px-4 py-3">{text.button}</p>
        <ul className="p-1">
          {OPTIONS.map((o) => {
            const on = !!flags[o.key];
            const noteId = `${panelId}-${o.key}`;
            return (
              <li key={o.key}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-describedby={noteId}
                  onClick={() => toggle(o.key)}
                  className="flex min-h-14 w-full items-center gap-4 px-3 py-2.5 text-left transition-colors hover:bg-ember-wash"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-ink">
                      {text[o.key].label}
                    </span>
                    <span
                      id={noteId}
                      className="block text-xs text-muted"
                    >
                      {system[o.key] && !on ? text.systemOn : text[o.key].hint}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-xs border transition-colors ${
                      on
                        ? "border-ember bg-ember"
                        : "border-line-strong bg-transparent"
                    }`}
                  >
                    <span
                      className={`absolute size-3 rounded-[2px] transition-[left,background-color] ${
                        on ? "left-[1.1rem] bg-on-accent" : "left-[0.2rem] bg-muted"
                      }`}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="border-t border-line px-4 py-3 text-xs leading-5 text-muted">
          {text.note}
        </p>
      </div>
    </div>
  );
}
