import { path, sprite } from "../pixels";

// The "vx" mark, the same grid as icon.svg: a mint v and a teal x on the
// bezel's brown, in both palettes.
const { v, x } = sprite([
  "v...v.x...x",
  "v...v..x.x.",
  ".v.v....x..",
  ".v.v...x.x.",
  "..v...x...x",
]);

export default function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="-1 -1 13 7"
      shapeRendering="crispEdges"
      className={`bg-bezel ${className}`}
    >
      <path d={path(v)} fill="var(--mint)" />
      <path d={path(x)} fill="var(--teal)" />
    </svg>
  );
}
