import { links } from "../content";
import BootLog from "./BootLog";

// Facts only: each line is true of the public repos.
const telemetry = [
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
      className="pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20"
    >
      <p
        className="rise eyebrow flex items-center gap-3"
        style={{ ["--i" as string]: 0 }}
      >
        <span aria-hidden className="size-1.5 bg-moss" />
        C · POSIX · PID 1
      </p>

      <h1
        id="hero-title"
        className="rise mt-10 max-w-[15ch] text-display font-medium tracking-[-0.055em] text-balance sm:mt-14"
        style={{ ["--i" as string]: 1 }}
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
          style={{ ["--i" as string]: 2 }}
        >
          {telemetry.map((t) => (
            <div key={t.k}>
              <dt className="eyebrow text-faint!">{t.k}</dt>
              <dd className="mt-1 text-sm text-ink">{t.v}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-x-10 gap-y-12 lg:pl-10 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div
            className="rise flex flex-col"
            style={{ ["--i" as string]: 2 }}
          >
            <p className="max-w-[30rem] text-lede text-pretty text-muted">
              Minimal init systems and POSIX-minded C: code small enough to
              read in one sitting, written to a standard instead of a moment.
            </p>

            <div className="mt-10 flex flex-wrap gap-3 xl:mt-auto xl:pt-10">
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

          <BootLog />
        </div>
      </div>
    </section>
  );
}
