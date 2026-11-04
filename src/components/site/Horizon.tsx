import type { CSSProperties } from "react";
import scene from "./scene.json";

/** The pixel-art scene: the sun going down behind Cerro Pan de Azúcar and
 *  its cross, seen across the plains. Each layer is drawn in
 *  scripts/sunset.mjs and placed here in scene pixels (--x, --y, --w,
 *  --h); globals.css (.scene) turns those into screen pixels at a
 *  whole-number scale and moves the layers, in whole scene pixels too.
 *  It's scenery, so it's hidden from assistive technology. */

type Box = { x?: number; y?: number; w?: number; h?: number; i?: number };

const at = ({ x = 0, y = 0, w, h, i }: Box) =>
  ({
    "--x": x,
    "--y": y,
    ...(w !== undefined && { "--w": w }),
    ...(h !== undefined && { "--h": h }),
    ...(i !== undefined && { "--i": i }),
  }) as CSSProperties;

const { width: W, height: H, horizon, focus, sun, far, near, land, grass, stars, fireflies, birds } = scene;

export default function Horizon() {
  return (
    <div className="scene" style={{ ...at({ w: W, h: H }), "--focus": focus } as CSSProperties}>
      <img className="layer" src="/scene/sky.png" alt="" width={W} height={horizon} style={at({ w: W, h: horizon })} />

      {stars.map((s, i) => (
        <span key={i} className={s.bright ? "dot star star-bright" : "dot star"} style={at({ x: s.x, y: s.y, i })} />
      ))}

      <div className="layer clouds clouds-far" style={at({ y: far.y, w: W * 2, h: far.h })} />

      {/* Cut off at the horizon; the hill in front hides the rest as it sets. */}
      <div className="layer overflow-hidden" style={at({ x: sun.x, y: sun.y, w: sun.w, h: sun.clip })}>
        <img className="layer sun" src="/scene/sun.png" alt="" width={sun.w} height={sun.h} style={at({ w: sun.w, h: sun.h })} />
      </div>

      <div className="layer clouds clouds-near" style={at({ y: near.y, w: W * 2, h: near.h })} />

      <div className="layer flock" style={at({ x: W, y: birds.y, w: 44, h: 12 })}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="bird" style={at({ x: i * 13, y: (i % 2) * 5 + (i === 2 ? 2 : 0), w: 9, h: 5, i })} />
        ))}
      </div>

      <img className="layer" src="/scene/land.png" alt="" width={W} height={land.h} style={at({ y: land.y, w: W, h: land.h })} />

      {/* Four frames stacked; the page steps through them. */}
      <div className="layer overflow-hidden" style={at({ y: grass.y, w: W, h: grass.h })}>
        <img className="layer grass" src="/scene/grass.png" alt="" width={W} height={grass.h * grass.frames} style={at({ w: W, h: grass.h * grass.frames })} />
      </div>

      {fireflies.map((f, i) => (
        <span key={i} className="dot firefly" style={at({ x: f.x, y: f.y, i })} />
      ))}
    </div>
  );
}
