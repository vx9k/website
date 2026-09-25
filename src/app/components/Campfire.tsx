import { Pixels } from "../pixel";

// A small campfire for the footer. Two flame frames swap in steps, so it
// flickers like a sprite; with motion off it holds the first frame.
const FLAME_A = ["...#...", "..##...", "..###..", ".#####."];
const FLAME_B = ["....#..", "...##..", "..###..", ".#####."];
const CORE = ["...#...", "..###.."];
const LOGS = ["#.....#", ".##.##.", "...#..."];

export default function Campfire({ className = "" }: { className?: string }) {
  const draw = (y: number, rows: string[]) => {
    const px = new Pixels();
    px.sprite(0, y, rows);
    return px.path();
  };
  return (
    <svg
      viewBox="0 0 7 8"
      shapeRendering="crispEdges"
      aria-hidden
      focusable="false"
      className={`campfire ${className}`}
    >
      <path className="fill-ember" d={draw(0, FLAME_A)} />
      <path className="flame-alt fill-ember" d={draw(0, FLAME_B)} />
      <path className="fill-blush eink:fill-bg hc:fill-bg" d={draw(2, CORE)} />
      <path className="fill-muted" d={draw(5, LOGS)} />
    </svg>
  );
}
