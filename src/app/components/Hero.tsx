import { links } from "../content";

// Facts only: each line is true of the public repos.
const facts = [
  { k: "Role", v: "Systems engineer" },
  { k: "Focus", v: "Init systems, POSIX C" },
  { k: "Current", v: "4suite / 4rc" },
  { k: "Source", v: "github.com/vx9k" },
];

export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32"
    >
      <h1
        id="hero-title"
        className="rise max-w-[15ch] text-display font-medium tracking-[-0.055em] text-balance"
        style={{ ["--i" as string]: 0 }}
      >
        I write software meant to{" "}
        <span className="text-moss">outlast</span> the machine it runs on.
      </h1>

      <div className="rule-bleed mt-16 grid gap-y-12 pt-10 sm:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
        <span aria-hidden className="cross left-0" />
        <span aria-hidden className="cross left-1/4 hidden lg:block" />
        <span aria-hidden className="cross left-full" />

        <dl
          className="rise grid grid-cols-2 gap-x-6 gap-y-5 self-start sm:grid-cols-4 lg:grid-cols-1 lg:pr-8"
          style={{ ["--i" as string]: 1 }}
        >
          {facts.map((t) => (
            <div key={t.k}>
              <dt className="eyebrow text-faint!">{t.k}</dt>
              <dd className="mt-1 text-sm text-ink">{t.v}</dd>
            </div>
          ))}
        </dl>

        <div
          className="rise grid gap-x-10 gap-y-10 lg:pl-10 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start"
          style={{ ["--i" as string]: 2 }}
        >
          <p className="max-w-[36rem] text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)] leading-[1.4] tracking-[-0.02em] text-pretty text-muted">
            Minimal init systems and POSIX-minded C: code small enough to read
            in one sitting, written to a standard instead of a moment.
          </p>

          <div className="flex flex-wrap gap-3 xl:self-end">
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
      </div>
    </section>
  );
}
