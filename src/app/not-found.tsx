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
      <div className="glass ticks w-full max-w-2xl p-6 sm:p-10">
        <a
          href="/"
          className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold tracking-[-0.02em] text-ink"
        >
          <Mark className="size-7 text-moss" />
          vx
        </a>

        <p className="eyebrow mt-10">
          <span className="text-moss">404</span>
          <span aria-hidden className="px-2 text-faint">
            /
          </span>
          Not found
        </p>
        <h1 className="mt-4 text-title font-medium tracking-[-0.045em]">
          Page not found
        </h1>

        <pre
          aria-hidden
          className="mt-6 overflow-hidden border border-line bg-bg/60 p-5 font-mono text-[0.8rem] leading-7 whitespace-pre-wrap text-muted sm:text-sm"
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
          className="btn btn-solid mt-8"
        >
          Reboot to the home page
          <span aria-hidden>↻︎</span>
        </a>
      </div>
    </main>
  );
}
