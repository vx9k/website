import { links } from "../content";
import type { Dictionary } from "../i18n";
import PixelScene from "./PixelScene";

// The headline sits in the night sky of the pixel scene, which runs full
// width below it and fades into the page through its front range. The
// headline's ending rotates through what the principles below ask of the
// code, and the facts row is true of the public repos.
export default function Hero({ t }: { t: Dictionary }) {
  const { lead, phrases, lede, cta, facts } = t.hero;

  return (
    <section id="top" aria-labelledby="hero-title">
      <div className="shell pt-8 sm:pt-14 lg:pt-20">
        <h1
          id="hero-title"
          className="rise max-w-[20ch] text-display font-medium text-balance"
          style={{ ["--i" as string]: 0 }}
        >
          <span className="sr-only">
            {lead} {phrases[0]}
          </span>
          <span aria-hidden>
            {lead}
            <span className="rotator text-ember">
              {phrases.map((p, n) => (
                <span key={p} style={{ ["--n" as string]: n }}>
                  {p}
                </span>
              ))}
            </span>
          </span>
        </h1>

        <p
          className="rise mt-6 max-w-[36rem] text-lede text-pretty text-muted sm:mt-8"
          style={{ ["--i" as string]: 1 }}
        >
          {lede}
        </p>

        <div
          className="rise mt-8 flex flex-wrap gap-3"
          style={{ ["--i" as string]: 2 }}
        >
          <a href="#work" className="group btn btn-solid">
            {cta}
            <span
              aria-hidden
              className="transition-transform group-hover:translate-y-0.5"
            >
              ↓︎
            </span>
          </a>
          <a href={links.github} className="group btn">
            GitHub
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗︎
            </span>
          </a>
        </div>
      </div>

      {/* The grid is 200×72 art pixels. It keeps that shape where it can,
          grows taller than it on phones (cropping the sides) and stops
          growing on very wide screens (cropping empty sky). */}
      <PixelScene className="mt-2 aspect-[200/72] max-h-[42rem] min-h-52" />

      <div className="shell">
        <dl
          className="rise grid grid-cols-2 gap-x-6 gap-y-5 border-b border-line pb-8 lg:grid-cols-4"
          style={{ ["--i" as string]: 3 }}
        >
          {facts.map((f) => (
            <div key={f.k}>
              <dt className="eyebrow text-faint!">{f.k}</dt>
              <dd className="mt-1.5 text-[0.95rem] font-medium text-ink">
                {f.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
