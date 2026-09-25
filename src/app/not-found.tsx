import type { Metadata } from "next";
import Mark from "./components/Mark";

export const metadata: Metadata = {
  title: "Page not found",
};

// GitHub Pages serves this as 404.html. In 4init's own words: if init
// can't be found, the kernel panics.
export default function NotFound() {
  return (
    <main
      id="main"
      className="shell flex flex-1 items-center py-[max(3rem,env(safe-area-inset-top))]"
    >
      <div className="glass w-full max-w-2xl rounded-[2rem] p-6 sm:p-10">
        <a
          href="/"
          className="inline-flex min-h-11 items-center gap-2.5 font-mono text-sm text-ink"
        >
          <Mark className="size-8 text-moss" />
          vx
        </a>

        <h1
          className="mt-8 font-display text-title font-[430] tracking-[-0.02em]"
          style={{ fontVariationSettings: '"SOFT" 30, "opsz" 96' }}
        >
          404: page not found
        </h1>

        <pre
          aria-hidden
          className="mt-6 overflow-hidden rounded-2xl border border-line bg-bg/60 p-5 font-mono text-[0.8rem] leading-7 whitespace-pre-wrap text-muted sm:text-sm"
        >
          <span className="text-sun">Kernel panic - not syncing:</span> No
          working init found for this path.{"\n"}
          <span className="text-faint">---[ end Kernel panic - not syncing ]---</span>
        </pre>

        <p className="mt-6 max-w-lg leading-7 text-muted">
          Nothing lives at this address. The link may be old, or the URL may
          have a typo.
        </p>

        <a
          href="/"
          className="mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-moss px-6 font-medium text-on-accent eink:border-2 eink:border-ink"
        >
          <span aria-hidden>↻︎</span>
          Reboot to the home page
        </a>
      </div>
    </main>
  );
}
