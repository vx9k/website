"use client";

import { useRef } from "react";
import { Pixels } from "../pixel";

// A small campfire at the foot of the screen. Two flame frames swap in steps, so it
// flickers like a sprite. Tapping it stokes the fire: the flicker speeds
// up and sparks jump out. With motion off it holds its first frame and
// the sparks simply show for a moment.
const FLAME_A = ["...#...", "..##...", "..###..", ".#####."];
const FLAME_B = ["....#..", "...##..", "..###..", ".#####."];
const CORE = ["...#...", "..###.."];
const LOGS = ["#.....#", ".##.##.", "...#..."];
// x, y and horizontal drift of each spark, in art pixels.
const SPARKS = [
  [2, 3, -2],
  [4, 2, 1],
  [3, 1, 0],
  [5, 3, 2],
];
const TOP = 7; // headroom above the fire for the sparks to climb into

function draw(y: number, rows: string[]) {
  const px = new Pixels();
  px.sprite(0, TOP + y, rows);
  return px.path();
}

export default function Campfire({ label }: { label: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const timer = useRef(0);

  function stoke() {
    const svg = ref.current;
    if (!svg) return;
    // Restart the burst even if it's still playing.
    svg.classList.remove("is-stoked");
    void svg.getBoundingClientRect();
    svg.classList.add("is-stoked");
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => svg.classList.remove("is-stoked"), 1400);
  }

  return (
    <button
      type="button"
      onClick={stoke}
      aria-label={label}
      title={label}
      data-poke
      className="inline-flex min-h-11 min-w-11 items-end justify-center"
    >
      {/* 7×15 art pixels at 3px each. */}
      <svg
        ref={ref}
        viewBox={`0 0 7 ${TOP + 8}`}
        shapeRendering="crispEdges"
        aria-hidden
        focusable="false"
        className="campfire h-[45px] w-[21px]"
      >
        <path className="fill-line" d={draw(0, FLAME_A)} />
        <path className="flame-alt fill-line" d={draw(0, FLAME_B)} />
        <path className="fill-accent" d={draw(2, CORE)} />
        <path className="fill-ink" d={draw(5, LOGS)} />
        {SPARKS.map(([x, y, dx], n) => (
          <rect
            key={n}
            x={x}
            y={TOP - 1 + y - 3}
            width={1}
            height={1}
            className={`spark ${n % 2 ? "fill-line" : "fill-ink"}`}
            style={{ ["--dx" as string]: `${dx}px`, ["--n" as string]: n }}
          />
        ))}
      </svg>
    </button>
  );
}
