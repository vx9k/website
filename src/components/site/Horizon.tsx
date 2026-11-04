/** The pixel-art horizon under the intro: the sun going down over the Río
 *  de la Plata, with the Cerro on the horizon. Drawn pixel by pixel in
 *  scripts/sunset.mjs and scaled by whole numbers only (.horizon in
 *  globals.css). It's scenery, so it's hidden from assistive technology. */
export default function Horizon() {
  return (
    <div aria-hidden className="horizon">
      <img src="/sunset/horizon.png" width={480} height={90} alt="" decoding="async" />
    </div>
  );
}
