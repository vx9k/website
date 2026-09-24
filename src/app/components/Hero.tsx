const lines = [
  { delay: 0.0, text: "$ whoami" },
  { delay: 0.35, text: "vx — systems engineer" },
];

export default function Hero() {
  return (
    <section className="relative border-b border-hairline px-6 pt-28 pb-20 sm:px-10 sm:pt-36 sm:pb-28 lg:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--hairline) 1px, transparent 1px), linear-gradient(90deg, var(--hairline) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative mx-auto max-w-4xl">
        <div className="font-mono text-xs text-muted">
          {lines.map((l) => (
            <p
              key={l.text}
              className="boot-line"
              style={{ animationDelay: `${l.delay}s` }}
            >
              {l.text}
            </p>
          ))}
        </div>

        <h1
          className="boot-line mt-6 font-mono text-4xl font-medium leading-[1.15] tracking-tight sm:text-6xl"
          style={{ animationDelay: "0.7s" }}
        >
          Building software that
          <br />
          runs anywhere, for decades.
          <span className="caret text-signal">_</span>
        </h1>

        <p
          className="boot-line mt-8 max-w-xl font-sans text-base leading-7 text-muted sm:text-lg"
          style={{ animationDelay: "1.05s" }}
        >
          I write POSIX-compliant software, design for portability over
          convenience, and spend as much time reading datasheets as I do
          writing code.
        </p>

        <div
          className="boot-line mt-10 flex flex-wrap gap-3 font-mono text-xs text-muted"
          style={{ animationDelay: "1.3s" }}
        >
          {["POSIX & portability", "systems architecture", "hardware"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-none border border-hairline px-3 py-1.5"
              >
                {tag}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
