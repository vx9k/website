import { links } from "../content";
import BootLog from "./BootLog";

export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="grid gap-x-12 gap-y-12 pt-14 pb-20 sm:pt-20 sm:pb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-y-14 lg:pt-24 xl:gap-x-16"
    >
      <div className="lg:col-span-2">
        <p
          className="rise eyebrow inline-flex items-center gap-2.5 rounded-full border border-line px-3.5 py-1.5"
          style={{ ["--i" as string]: 0 }}
        >
          <span
            aria-hidden
            className="size-2 rounded-full bg-moss shadow-[0_0_12px_var(--moss)] eink:shadow-none"
          />
          Systems engineer
        </p>

        <h1
          id="hero-title"
          className="rise mt-7 font-display text-display font-[420] tracking-[-0.025em] text-balance"
          style={{
            ["--i" as string]: 1,
            fontVariationSettings: '"SOFT" 30, "opsz" 144',
          }}
        >
          I write software meant to{" "}
          <em
            className="font-[380] text-moss italic"
            style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
          >
            outlast
          </em>{" "}
          the machine it runs on.
        </h1>
      </div>

      <div className="lg:pt-2">
        <p
          className="rise max-w-[36rem] text-lede text-pretty text-muted"
          style={{ ["--i" as string]: 2 }}
        >
          Minimal init systems and POSIX-minded C: code small enough to read
          in one sitting, written to a standard instead of a moment.
        </p>

        <div
          className="rise mt-10 flex flex-wrap items-center gap-3"
          style={{ ["--i" as string]: 3 }}
        >
          <a
            href="#work"
            className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-moss px-6 font-medium text-on-accent transition-[background-color,box-shadow] hover:shadow-[0_0_0_4px_var(--moss-wash)] eink:border-2 eink:border-ink"
          >
            See the work
            <span
              aria-hidden
              className="transition-transform group-hover:translate-y-0.5"
            >
              ↓︎
            </span>
          </a>
          <a
            href={links.github}
            className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-line-strong px-6 text-ink transition-colors hover:border-moss hover:text-moss eink:border-2"
          >
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
    </section>
  );
}
