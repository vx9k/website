import type { CSSProperties } from "react";
import scene from "./scene.json";

/** The pixel-art scene behind the page: the sun going down over the Río de
 *  la Plata, with the Cerro and its lighthouse on the horizon. Each layer
 *  is drawn in scripts/sunset.mjs and placed here in scene pixels (--x,
 *  --y, --w, --h); globals.css (.scene) turns those into screen pixels at a
 *  whole-number scale and moves the layers, in whole scene pixels too.
 *  It's scenery, so it's hidden from assistive technology. */

type Box = { x?: number; y?: number; w?: number; h?: number; i?: number };

const at = ({ x = 0, y = 0, w, h, i }: Box) =>
  ({ "--x": x, "--y": y, ...(w !== undefined && { "--w": w }), ...(h !== undefined && { "--h": h }), ...(i !== undefined && { "--i": i }) }) as CSSProperties;

const { width: W, horizon, sun, far, near, land, light, water, stars, birds, boat } = scene;

export default function Horizon() {
  return (
    <div aria-hidden className="scene-frame">
      <div className="scene" style={at({ w: W, h: scene.height })}>
        <img className="layer" src="/sunset/sky.png" alt="" width={W} height={horizon} style={at({ w: W, h: horizon })} />

        {stars.map((s, i) => (
          <span key={i} className={s.bright ? "star star-bright" : "star"} style={at({ x: s.x, y: s.y, i })} />
        ))}

        {/* Cut off at the horizon, so the sun can sink below it. */}
        <div className="layer overflow-hidden" style={at({ x: sun.x, y: sun.y, w: sun.w, h: sun.clip })}>
          <img className="layer sun" src="/sunset/sun.png" alt="" width={sun.w} height={sun.h} style={at({ w: sun.w, h: sun.h })} />
        </div>

        <div className="layer clouds clouds-far" style={at({ y: far.y, w: W * 2, h: far.h })} />
        <div className="layer clouds clouds-near" style={at({ y: near.y, w: W * 2, h: near.h })} />

        <div className="layer flock" style={at({ x: W, y: birds.y, w: 40, h: 10 })}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="bird" style={at({ x: i * 11, y: (i % 2) * 4 + (i === 2 ? 2 : 0), w: 7, h: 3, i })} />
          ))}
        </div>

        <img className="layer" src="/sunset/land.png" alt="" width={land.w} height={land.h} style={at(land)} />
        <span className="light" style={at(light)} />

        {/* Four frames stacked; the page steps through them. */}
        <div className="layer overflow-hidden" style={at({ y: water.y, w: W, h: water.h })}>
          <img
            className="layer water"
            src="/sunset/water.png"
            alt=""
            width={W}
            height={water.h * water.frames}
            style={at({ w: W, h: water.h * water.frames })}
          />
        </div>

        <img className="layer boat" src="/sunset/boat.png" alt="" width={boat.w} height={boat.h} style={at({ x: 330, ...boat })} />
      </div>
    </div>
  );
}
