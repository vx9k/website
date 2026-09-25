import { links } from "../content";
import type { Dictionary } from "../i18n";
import PixelScene from "./PixelScene";

// The headline sits in the sky of the pixel scene, which runs full width
// below it and meets the page through its front range. The headline's
// ending cycles through what the principles below ask of the code, each
// phrase set on a rust block like a selected menu item. The facts row is
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
            {/* Cream on rust is 3.7:1, which is enough at display size. */}
            <span className="rotator mt-2">
              {phrases.map((p, n) => (
                <span key={p} style={{ ["--n" as string]: n }}>
                  <span className="bg-accent box-decoration-clone px-2 text-cream">
                    {p}
                  </span>
                </span>
              ))}
            </span>
          </span>
        </h1>

        <p
          className="rise mt-6 max-w-[36rem] text-lede text-pretty sm:mt-8"
          style={{ ["--i" as string]: 1 }}
        >
          {lede}
        </p>

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
        className="mt-2 aspect-[200/72] max-h-[42rem] min-h-52"
        text={t.scene}
      />

      <div className="shell">
        <p className="eyebrow pt-4 pb-8">
          <span aria-hidden className="mr-2 inline-block size-[6px] bg-accent align-middle" />
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
