import { links } from "../content";

export default function Footer() {
  return (
    <footer className="overflow-hidden">
      <div className="shell rule-bleed">
        <div className="eyebrow grid gap-3 pt-8 sm:grid-cols-3 sm:items-center">
          <p>© {new Date().getFullYear()} vx</p>
          <p className="sm:text-center">Static · works offline · no trackers</p>
          <p className="sm:text-right">
            <a
              href={links.website}
              className="inline-flex min-h-11 items-center text-ink transition-colors hover:text-moss sm:min-h-0"
            >
              Source ↗︎
            </a>
          </p>
        </div>
        <p
          aria-hidden
          className="wordmark -mt-[0.12em] -mb-[0.2em] text-[clamp(8rem,4rem+26vw,26rem)] leading-[0.8] font-semibold tracking-[-0.03em] select-none"
        >
          vx
        </p>
        <div className="pb-[env(safe-area-inset-bottom)]" />
      </div>
    </footer>
  );
}
