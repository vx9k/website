import Reveal from "./Reveal";

const components = [
  {
    name: "4init",
    status: "shipping",
    description:
      "Minimal PID 1 init. Its only job is managing processes — by default it hands off to 4rc, configurable in config.h. If it crashes, the kernel panics, same as any init would.",
    note: "Inspired by rofl0r's minimal init gist.",
  },
  {
    name: "4rc",
    status: "in progress",
    description:
      "The service manager that starts under 4init. Early — the project's own README calls it a service manager that \"larps as being functional,\" which is a more honest status line than most projects give you.",
  },
  {
    name: "logger",
    status: "planned",
    description: "Not started yet. Part of the suite's intended scope.",
  },
  {
    name: "user",
    status: "planned",
    description: "Not started yet. Part of the suite's intended scope.",
  },
];

export default function Works() {
  return (
    <section id="works" className="py-14 sm:py-20">
      <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
        Work
      </h2>

      <Reveal className="mt-10 max-w-2xl rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-mono text-lg">4suite</h3>
          <a
            href="https://github.com/vx9k/4suite"
            className="text-sm text-muted underline decoration-hairline underline-offset-4 transition-colors hover:text-clay hover:decoration-clay"
          >
            github.com/vx9k/4suite
          </a>
        </div>

        <p className="mt-3 text-base leading-7 text-muted">
          A self-contained C boot stack: init, rc, logger, and user, each
          with its own scope and its own README.
        </p>

        <div className="mt-5 flex flex-wrap gap-2 font-mono text-xs text-muted">
          <span className="rounded-full border border-hairline px-3 py-1">
            C
          </span>
          <span className="rounded-full border border-hairline px-3 py-1">
            MIT
          </span>
        </div>

        <div className="mt-8 divide-y divide-hairline border-t border-hairline">
          {components.map((c) => (
            <div
              key={c.name}
              className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <div className="flex items-baseline gap-3 sm:w-1/4 sm:shrink-0">
                <span className="font-mono text-sm text-ink">{c.name}</span>
                <span className="text-xs text-muted">{c.status}</span>
              </div>
              <div className="sm:w-3/4">
                <p className="text-sm leading-6 text-muted">
                  {c.description}
                </p>
                {c.note && (
                  <p className="mt-1 text-xs text-muted/80">{c.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
