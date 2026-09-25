import { links } from "../content";

// Facts only: each line is true of the public repos.
const facts = [
  { k: "Role", v: "Systems engineer" },
  { k: "Focus", v: "Init systems, POSIX C" },
  { k: "Current", v: "4suite / 4rc" },
  { k: "Source", v: "github.com/vx9k" },
];

// The headline's ending rotates through what the principles below ask of
// the code. The first phrase is the one that stays when motion is off.
const phrases = [
  "outlast the machine it runs on.",
  "fit in one reader's head.",
  "do one job, predictably.",
];

// Full-bleed, like a video hero: the ember shader behind the page shows
// through here, and fades into the solid page below.
export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-end pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-bg"
      />

      <div className="shell relative pb-10 sm:pb-14">
        <h1
          id="hero-title"
          className="rise mx-auto max-w-[16ch] text-center text-display font-medium text-balance sm:mx-0 sm:max-w-[20ch] sm:text-left"
          style={{ ["--i" as string]: 0 }}
        >
          <span className="sr-only">
            I write software meant to {phrases[0]}
          </span>
          <span aria-hidden>
            I write software meant to
            <span className="rotator justify-items-center text-ember sm:justify-items-start">
              {phrases.map((p, n) => (
                <span key={p} style={{ ["--n" as string]: n }}>
                  {p}
                </span>
              ))}
            </span>
          </span>
        </h1>

        <div
          className="rise mt-8 flex flex-col items-center gap-8 text-center sm:mt-10 sm:items-start sm:text-left lg:flex-row lg:items-end lg:justify-between"
          style={{ ["--i" as string]: 1 }}
        >
          <p className="max-w-[34rem] text-lede text-pretty text-muted">
            I write minimal init systems in C. The code is small enough to
            read in one sitting and sticks to POSIX interfaces where it can.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            <a href="#work" className="group btn btn-solid">
              See the work
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

        <dl
          className="rise mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 text-center sm:mt-20 sm:text-left lg:grid-cols-4"
          style={{ ["--i" as string]: 2 }}
        >
          {facts.map((t, i) => (
            <div
              key={t.k}
              className="rise"
              style={{ ["--i" as string]: 3 + i }}
            >
              <dt className="eyebrow text-faint!">{t.k}</dt>
              <dd className="mt-1.5 text-[0.95rem] font-medium text-ink">
                {t.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
