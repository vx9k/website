"use client";

import { useEffect, useState } from "react";

type Settings = {
  theme: "light" | "dark";
  contrast: "normal" | "high";
  motion: "normal" | "reduced";
};

const DEFAULTS: Settings = {
  theme: "light",
  contrast: "normal",
  motion: "normal",
};

function apply(settings: Settings) {
  const root = document.documentElement;
  root.setAttribute("data-theme", settings.theme === "dark" ? "dark" : "");
  root.setAttribute(
    "data-contrast",
    settings.contrast === "high" ? "high" : "",
  );
  root.setAttribute(
    "data-motion",
    settings.motion === "reduced" ? "reduced" : "",
  );
  if (settings.theme !== "dark") root.removeAttribute("data-theme");
  if (settings.contrast !== "high") root.removeAttribute("data-contrast");
  if (settings.motion !== "reduced") root.removeAttribute("data-motion");
}

export default function SettingsToggle() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = JSON.parse(
        localStorage.getItem("vx-settings") || "{}",
      );
      setSettings({ ...DEFAULTS, ...stored });
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    apply(settings);
    localStorage.setItem("vx-settings", JSON.stringify(settings));
  }, [settings, mounted]);

  const flags: {
    key: keyof Settings;
    label: string;
    on: string;
    off: string;
  }[] = [
    { key: "theme", label: "theme", on: "dark", off: "light" },
    { key: "contrast", label: "contrast", on: "high", off: "normal" },
    { key: "motion", label: "motion", on: "reduced", off: "normal" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Display settings"
        className="rounded-full border border-hairline px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-clay hover:text-clay"
      >
        --flags
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-xl border border-hairline bg-surface p-4 shadow-sm">
          {flags.map((f) => {
            const isOn = settings[f.key] === f.on;
            return (
              <button
                key={f.key}
                onClick={() =>
                  setSettings((s) => ({
                    ...s,
                    [f.key]: isOn ? f.off : f.on,
                  }))
                }
                aria-pressed={isOn}
                className="flex w-full items-center justify-between py-2 text-left font-mono text-xs first:pt-0 last:pb-0"
              >
                <span className="text-muted">
                  --{f.label}={isOn ? f.on : f.off}
                </span>
                <span
                  className={`inline-block h-4 w-8 rounded-full border border-hairline transition-colors ${
                    isOn ? "bg-clay" : "bg-transparent"
                  }`}
                  aria-hidden
                >
                  <span
                    className={`block h-3.5 w-3.5 rounded-full bg-ink transition-transform ${
                      isOn ? "translate-x-3.5" : "translate-x-0"
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
