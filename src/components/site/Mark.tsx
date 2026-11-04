import mark from "./mark.json";

/** The site's mark: the cross on Cerro Pan de Azúcar against the setting
 *  sun, 18 by 18 pixels, drawn by scripts/sunset.mjs as runs of one colour
 *  per row; the favicon is the same drawing (src/app/icon.svg). Shown at
 *  a whole multiple of its size so its pixels stay square. Decorative: the
 *  name next to it says what it is. */
export default function Mark({ scale = 2 }: { scale?: number }) {
  const size = mark.size * scale;
  return (
    <svg viewBox={`0 0 ${mark.size} ${mark.size}`} width={size} height={size} aria-hidden shapeRendering="crispEdges" className="block shrink-0">
      {mark.runs.map(([x, y, n, fill]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={n} height={1} fill={fill as string} />
      ))}
    </svg>
  );
}
