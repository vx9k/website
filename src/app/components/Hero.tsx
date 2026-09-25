import { links } from "../content";

// Facts only: each line is true of the public repos.
const facts = [
  { k: "Role", v: "Systems engineer" },
  { k: "Focus", v: "Init systems, POSIX C" },
  { k: "Current", v: "4suite / 4rc" },
  { k: "Source", v: "github.com/vx9k" },
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
          className="rise max-w-[15ch] text-display font-medium text-balance"
          style={{ ["--i" as string]: 0 }}
        >
          I write software meant to{" "}
          <span className="text-ember">outlast</span> the machine it runs on.
        </h1>

        <div
          className="rise mt-8 flex flex-col gap-8 sm:mt-10 lg:flex-row lg:items-end lg:justify-between"
          style={{ ["--i" as string]: 1 }}
        >
          <p className="max-w-[34rem] text-lede text-pretty text-muted">
            Minimal init systems and POSIX-minded C: code small enough to read
            in one sitting, written to a standard instead of a moment.
          </p>
          <div className="flex flex-wrap gap-3">
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
          className="rise mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:mt-20 lg:grid-cols-4"
          style={{ ["--i" as string]: 2 }}
        >
          {facts.map((t) => (
            <div key={t.k}>
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
