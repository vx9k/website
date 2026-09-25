import { links } from "../content";
import type { Dictionary } from "../i18n";
import PixelScene from "./PixelScene";

// The headline sits in the sky of the pixel scene, which runs full width
// below it and meets the page through its front range. The headline's
// ending cycles through what the principles below ask of the code, each
// phrase set on an accent block like a selected menu item, and
// dissolving into the next through a dither. The facts row is
// true of the public repos.
export default function Hero({ t }: { t: Dictionary }) {
  const { lead, phrases, lede, cta, facts } = t.hero;

  return (
    <section id="top" aria-labelledby="hero-title">
      <div className="shell pt-8 sm:pt-14 lg:pt-20">
        <h1
          id="hero-title"
          className="rise max-w-[20ch] text-display font-semibold text-balance"
          style={{ ["--i" as string]: 0 }}
        >
          <span className="sr-only">
            {lead} {phrases[0]}
          </span>
          <span aria-hidden>
            {lead}{" "}
            {/* Brown on teal (7.1:1) by day, mint on deep teal (5.6:1) at night. */}
            <span className="rotator mt-2">
              {phrases.map((p, n) => (
                <span key={p} style={{ ["--n" as string]: n }}>
                  <span className="bg-accent box-decoration-clone px-2 text-on-accent">
                    {p}
                  </span>
                </span>
              ))}
            </span>
          </span>
        </h1>

        {/* The lede as a dialogue box, its "more" arrow waiting for A. */}
        <div
          className="rise dialog relative mt-6 max-w-[38rem] px-5 pt-4 pb-6 sm:mt-8"
          style={{ ["--i" as string]: 1 }}
        >
          <p className="text-lede text-pretty">{lede}</p>
          <svg
            viewBox="0 0 5 3"
            shapeRendering="crispEdges"
            aria-hidden
            focusable="false"
            className="more absolute right-4 bottom-2.5 h-[9px] w-[15px] fill-ink"
          >
            <path d="M0 0h5v1H0zM1 1h3v1H1zM2 2h1v1H2z" />
          </svg>
        </div>

        <div
          className="rise mt-8 flex flex-wrap gap-3"
          style={{ ["--i" as string]: 2 }}
        >
          <a href="#work" className="btn btn-solid">
            {cta}
            <span aria-hidden>↓︎</span>
          </a>
          <a href={links.github} className="btn">
            GitHub
            <span aria-hidden>↗︎</span>
          </a>
        </div>
      </div>

      {/* The grid is 200×72 art pixels. It keeps that shape where it can,
          grows taller than it on phones (cropping the sides) and stops
          growing on very wide screens (cropping empty sky). */}
      <PixelScene
        className="mt-2 aspect-[200/72] max-h-[38rem] min-h-56"
        text={t.scene}
        play={t.game.character}
      />

      <div className="shell">
        <p className="eyebrow pt-4 pb-8">
          <span aria-hidden className="mr-2 inline-block size-[6px] bg-ink align-middle" />
          {t.scene.hint}
        </p>
        <dl
          className="rise rule-b grid grid-cols-2 gap-x-6 gap-y-5 pb-8 lg:grid-cols-4"
          style={{ ["--i" as string]: 3 }}
        >
          {facts.map((f) => (
            <div key={f.k}>
              <dt className="eyebrow">{f.k}</dt>
              <dd className="mt-1.5 font-medium">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
