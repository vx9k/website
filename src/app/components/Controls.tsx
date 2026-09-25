import type { Dictionary } from "../i18n";
import { path, sprite } from "../pixels";
import PixelButton, { type Action } from "./PixelButton";

// The console's lower half. The D-pad and the speaker are drawing only;
// A sends a gust across the scene and B swaps the palette.

const DPAD = sprite([
  "...###...",
  "...#.#...",
  "...###...",
  "#########",
  "#.#####.#",
  "#########",
  "...###...",
  "...#.#...",
  "...###...",
])["#"];

const ROUND = sprite([
  "..###..",
  ".#####.",
  "#######",
  "#######",
  "#######",
  ".#####.",
  "..###..",
])["#"];

// Six slots at 45 degrees, stepped a pixel at a time.
const SPEAKER = Array.from({ length: 6 }, (_, i) =>
  Array.from({ length: 7 }, (_, k): [number, number] => [i * 3 + k, 6 - k]),
).flat();

function Key({ action, letter, label }: { action: Action; letter: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <PixelButton action={action} label={label} className="key grid size-16 cursor-pointer place-items-center">
        <svg aria-hidden viewBox="0 0 7 7" shapeRendering="crispEdges" className="size-[49px] fill-on-plastic">
          <path d={path(ROUND)} />
        </svg>
      </PixelButton>
      <span aria-hidden className="font-label text-xs text-on-plastic">
        {letter}
      </span>
    </div>
  );
}

export default function Controls({ t }: { t: Dictionary }) {
  return (
    <footer className="console pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between px-2 sm:px-10">
        <svg aria-hidden viewBox="0 0 9 9" shapeRendering="crispEdges" className="size-[81px] fill-on-plastic">
          <path d={path(DPAD)} />
        </svg>
        <div className="flex items-end gap-3">
          <Key action="theme" letter="B" label={t.console.b} />
          <div className="mb-8">
            <Key action="gust" letter="A" label={t.console.a} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end px-2 sm:px-10">
        <svg aria-hidden viewBox="0 0 22 7" shapeRendering="crispEdges" className="h-[21px] w-[66px] fill-on-plastic">
          <path d={path(SPEAKER)} />
        </svg>
      </div>
    </footer>
  );
}
