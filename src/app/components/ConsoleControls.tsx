"use client";

import { Pixels } from "../pixel";
import { requestGame, usePlaying } from "./game/control";

// The bottom half of the console: a D-pad and A/B buttons (scenery the
// character can stand on), a speaker grille, and Start and Select, which
// work: Start plays the page, Select swaps the palette.

const DPAD = [
  "...xxx...",
  "...xox...",
  "...xxx...",
  "xxxxxxxxx",
  "xoxx.xxox",
  "xxxxxxxxx",
  "...xxx...",
  "...xox...",
  "...xxx...",
];
const ROUND = [".xxxxx.", "xxxxxxx", "xxxxxxx", "xxxxxxx", "xxxxxxx", "xxxxxxx", ".xxxxx."];
const CAPSULE = [".xxxxxxxxxx.", "xxxxxxxxxxxx", ".xxxxxxxxxx."];

function art(rows: string[], ch: string) {
  const px = new Pixels();
  rows.forEach((r, y) => {
    for (let x = 0; x < r.length; x++) if (r[x] === ch) px.set(x, y);
  });
  return px.path();
}

function Art({ rows, scale, className = "" }: { rows: string[]; scale: number; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      width={rows[0].length * scale}
      height={rows.length * scale}
      shapeRendering="crispEdges"
      aria-hidden
      focusable="false"
      className={`block ${className}`}
    >
      <path className="fill-bezel" d={art(rows, "x")} />
      <path className="fill-plastic" d={art(rows, "o")} />
    </svg>
  );
}

export type ConsoleText = { start: string; select: string; startLabel: string; selectLabel: string };

export default function ConsoleControls({ text }: { text: ConsoleText }) {
  const playing = usePlaying();

  function swapPalette() {
    const api = window.__vxFlags;
    if (!api) return;
    const day = document.documentElement.getAttribute("data-theme") !== "night";
    api.save({ ...api.read(), day: !day });
    api.apply();
  }

  const small = (label: string, name: string, onClick: () => void, pressed?: boolean) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className="group flex min-h-11 min-w-11 -rotate-[20deg] flex-col items-center gap-1.5 px-1 py-2"
    >
      <span data-solid className="block group-active:translate-y-[var(--px)]">
        <Art rows={CAPSULE} scale={3} />
      </span>
      <span className="eyebrow text-on-plastic!">{name}</span>
    </button>
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6 py-8">
      <div data-solid aria-hidden>
        <Art rows={DPAD} scale={9} />
      </div>

      <div className="flex gap-4 sm:order-last">
        <div className="flex items-end gap-5" aria-hidden>
          <div className="flex flex-col items-center gap-1.5">
            <span data-solid className="block">
              <Art rows={ROUND} scale={7} />
            </span>
            <span className="eyebrow text-on-plastic!">B</span>
          </div>
          <div className="mb-6 flex flex-col items-center gap-1.5">
            <span data-solid className="block">
              <Art rows={ROUND} scale={7} />
            </span>
            <span className="eyebrow text-on-plastic!">A</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {small(text.selectLabel, text.select, swapPalette)}
        {small(text.startLabel, text.start, () => requestGame("toggle"), playing)}
      </div>

      {/* Speaker grille: six slots cut at the console's angle. */}
      <div aria-hidden className="hidden gap-2.5 sm:flex">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="block h-14 w-[var(--px)] -rotate-[20deg] bg-bezel" />
        ))}
      </div>
    </div>
  );
}
