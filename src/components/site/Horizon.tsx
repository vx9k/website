import type { CSSProperties } from "react";
import scene from "./scene.json";

/** The pixel-art scene: Cerro Pan de Azúcar and its cross, seen from the
 *  east across the plains, with the sea far off on the left; on a sunny
 *  day in the light theme and at night in the dark one. Each layer and
 *  sprite is drawn in scripts/sunset.mjs and placed here in scene pixels
 *  (--x, --y, --w, --h); globals.css (.scene) turns those into screen
 *  pixels at a whole-number scale and moves them, in whole scene pixels
 *  too. Each theme's things carry .by-day or .by-night, so only the
 *  system's theme shows. It's scenery, so it's hidden from assistive
 *  technology. */

type Box = { x?: number; y?: number; w?: number; h?: number; i?: number; sw?: number };

const at = ({ x = 0, y = 0, w, h, i, sw }: Box) =>
  ({
    "--x": x,
    "--y": y,
    ...(w !== undefined && { "--w": w }),
    ...(h !== undefined && { "--h": h }),
    ...(i !== undefined && { "--i": i }),
    ...(sw !== undefined && { "--sw": sw }),
  }) as CSSProperties;

const s = scene;

/** An image layer in both themes' versions: the picture loads only the
 *  one the system asks for, and swaps if it changes. */
function Layer({ name, box, className = "layer" }: { name: string; box: Required<Pick<Box, "w" | "h">> & Box; className?: string }) {
  return (
    <picture>
      <source media="(prefers-color-scheme: dark)" srcSet={`/scene/night/${name}.png`} />
      <img className={className} src={`/scene/day/${name}.png`} alt="" width={box.w} height={box.h} style={at(box)} />
    </picture>
  );
}

export default function Horizon() {
  return (
    <div className="scene" style={{ ...at({ w: s.width, h: s.height }), "--focus": s.focus } as CSSProperties}>
      <Layer name="sky" box={{ w: s.width, h: s.horizon }} />

      {s.stars.map((p, i) => (
        <span key={i} className={p.bright ? "by-night dot star star-bright" : "by-night dot star"} style={at({ x: p.x, y: p.y, i })} />
      ))}
      <span className="by-night dot meteor" style={at(s.meteor)} />

      <div className="layer clouds clouds-far" style={at({ y: s.far.y, w: s.width * 2, h: s.far.h })} />
      <Layer name="orb" box={s.orb} className="layer orb" />
      <div className="layer clouds clouds-near" style={at({ y: s.near.y, w: s.width * 2, h: s.near.h })} />

      {/* Teros crossing by day; bats flitting by night. */}
      <div className="by-day layer flock" style={at({ x: s.width, y: s.birds.y, w: 44, h: 12 })}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="layer sprite bird" style={at({ x: i * 13, y: (i % 2) * 5 + (i === 2 ? 2 : 0), w: 9, h: 5, i, sw: 18 })} />
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <span key={i} className="by-night layer sprite bat" style={at({ x: s.bats.x + i * 23, y: s.bats.y + (i % 2) * 6, w: 5, h: 2, i, sw: 10 })} />
      ))}

      <Layer name="land" box={{ y: s.land.y, w: s.width, h: s.land.h }} />
      <span className="layer sprite wheel" style={at({ ...s.wheel, sw: s.wheel.w * 4 })} />

      {s.lights.map((p, i) => (
        <span key={i} className={p.off ? "by-night dot light light-off" : "by-night dot light"} style={at({ x: p.x, y: p.y, i })} />
      ))}
      {s.glints.map((p, i) => (
        <span key={i} className="dot glint" style={at({ x: p.x, y: p.y, i })} />
      ))}
      {s.cows.map((p, i) => (
        <span key={i} className="by-day layer sprite cow" style={at({ ...p, w: 8, h: 5, i, sw: 16 })} />
      ))}
      {/* Two cars on the road, one each way. */}
      <span className="layer sprite car car-left" style={at({ x: s.width, y: s.road - 2, w: s.car.w, h: s.car.h, sw: s.car.w * 2 })} />
      <span className="layer sprite car car-right" style={at({ x: -s.car.w, y: s.road - 2, w: s.car.w, h: s.car.h, sw: s.car.w * 2 })} />

      {/* Four frames stacked; the page steps through them. */}
      <div className="layer overflow-hidden" style={at({ y: s.grass.y, w: s.width, h: s.grass.h })}>
        <Layer name="grass" box={{ w: s.width, h: s.grass.h * s.grass.frames }} className="layer grass" />
      </div>

      {s.butterflies.map((p, i) => (
        <span key={i} className="by-day layer sprite butterfly" style={at({ ...p, w: 3, h: 2, i, sw: 6 })} />
      ))}
      {s.fireflies.map((p, i) => (
        <span key={i} className="by-night dot firefly" style={at({ x: p.x, y: p.y, i })} />
      ))}
    </div>
  );
}
