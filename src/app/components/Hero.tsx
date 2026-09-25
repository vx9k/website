import BootStatus from "./BootStatus";

export default function Hero() {
  return (
    <section id="top" className="scroll-mt-24 py-10 sm:py-16">
      <p
        className="fade-up glass inline-block rounded-full px-4 py-1.5 font-mono text-sm text-muted"
        style={{ animationDelay: "0s" }}
      >
        vx — systems engineer
      </p>

      <h1
        className="fade-up mt-5 max-w-xl text-balance font-[family-name:var(--font-display)] text-4xl leading-[1.15] tracking-tight sm:text-5xl sm:leading-[1.15]"
        style={{ animationDelay: "0.12s" }}
      >
        I write software meant to outlast the machine it runs on.
      </h1>

      <p
        className="fade-up mt-6 max-w-lg text-lg leading-8 text-muted"
        style={{ animationDelay: "0.24s" }}
      >
        POSIX-compliant systems, minimal init stacks, and the kind of code
        that's still readable in ten years — because it was written to a
        standard, not a moment.
      </p>

      <div
        className="fade-up mt-8 flex flex-wrap items-center gap-6"
        style={{ animationDelay: "0.36s" }}
      >
        <a
          href="#works"
          className="rounded-full bg-moss px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-ink"
        >
          See my work
        </a>
        <a
          href="https://github.com/vx9k"
          className="text-sm font-medium text-muted underline decoration-hairline underline-offset-4 transition-colors hover:text-moss hover:decoration-moss"
        >
          GitHub
        </a>
        <BootStatus />
      </div>
    </section>
  );
}
