import { links } from "../content";

export default function Footer() {
  return (
    <footer className="overflow-hidden">
      <div className="shell">
        <div className="eyebrow flex items-center justify-between gap-6 border-t border-line pt-8">
          <p>© {new Date().getFullYear()} vx</p>
          <p>
            <a
              href={links.website}
              className="inline-flex min-h-11 items-center text-ink transition-colors hover:text-ember sm:min-h-0"
            >
              Source ↗︎
            </a>
          </p>
        </div>
        <p
          aria-hidden
          className="wordmark -mt-[0.12em] -mb-[0.2em] text-[clamp(8rem,4rem+26vw,26rem)] leading-[0.8] font-semibold tracking-[-0.06em] select-none"
        >
          vx
        </p>
        <div className="pb-[env(safe-area-inset-bottom)]" />
      </div>
    </footer>
  );
}
