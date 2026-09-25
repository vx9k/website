"use client";

import { useEffect, useRef, useState } from "react";

// Dark-only site: no theme flag, just the two accessibility settings.
type Settings = {
  contrast: "normal" | "high";
  motion: "normal" | "reduced";
};

const DEFAULTS: Settings = { contrast: "normal", motion: "normal" };

const FLAGS: { key: keyof Settings; on: string; off: string }[] = [
  { key: "contrast", on: "high", off: "normal" },
  { key: "motion", on: "reduced", off: "normal" },
];

function apply(settings: Settings) {
  const root = document.documentElement;
  if (settings.contrast === "high") root.setAttribute("data-contrast", "high");
  else root.removeAttribute("data-contrast");
  if (settings.motion === "reduced") root.setAttribute("data-motion", "reduced");
  else root.removeAttribute("data-motion");
}

export default function SettingsToggle() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("vx-settings") || "{}");
      setSettings({ ...DEFAULTS, ...stored });
    } catch {
      // ignore malformed storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    apply(settings);
    try {
      localStorage.setItem("vx-settings", JSON.stringify(settings));
    } catch {
      // storage can be unavailable (private mode); settings still apply
    }
  }, [settings, loaded]);

  // Close on Escape or a tap outside the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
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

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="display-flags"
        aria-label="Display settings"
        className="glass min-h-11 rounded-full px-4 font-mono text-xs text-muted transition-colors hover:text-moss"
      >
        --flags
      </button>

      {open && (
        <div
          id="display-flags"
          className="glass absolute right-0 z-10 mt-2 w-64 rounded-2xl p-2"
        >
          {FLAGS.map((f) => {
            const isOn = settings[f.key] === f.on;
            return (
              <button
                key={f.key}
                type="button"
                role="switch"
                aria-checked={isOn}
                onClick={() =>
                  setSettings((s) => ({ ...s, [f.key]: isOn ? f.off : f.on }))
                }
                className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left font-mono text-xs transition-colors hover:bg-moss-soft"
              >
                <span className="text-muted">
                  --{f.key}={isOn ? f.on : f.off}
                </span>
                <span
                  aria-hidden
                  className={`inline-flex h-4 w-8 items-center rounded-full border border-hairline p-px transition-colors ${
                    isOn ? "bg-moss" : "bg-transparent"
                  }`}
                >
                  <span
                    className={`block h-3 w-3 rounded-full bg-ink transition-transform ${
                      isOn ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
