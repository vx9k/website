import { Pixels } from "../pixel";

// "vx" in a 5×5 pixel face. icon.svg draws the same grid.
const V = ["#...#", "#...#", ".#.#.", ".#.#.", "..#.."];
const X = ["#...#", ".#.#.", "..#..", ".#.#.", "#...#"];

export default function PixelMark({ className = "" }: { className?: string }) {
  const v = new Pixels();
  v.sprite(0, 0, V);
  const x = new Pixels();
  x.sprite(6, 0, X);
  return (
    <svg
      viewBox="0 0 11 5"
      shapeRendering="crispEdges"
      aria-hidden
      focusable="false"
      className={className}
    >
      {/* Drawn on the bezel-coloured badge, so it uses fixed palette colours. */}
      <path className="fill-[var(--mint)]" d={v.path()} />
      <path className="fill-[var(--teal)]" d={x.path()} />
    </svg>
  );
}
