import { links } from "../content";
import type { Dictionary } from "../i18n";

export default function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="overflow-hidden">
      <div className="shell">
        <div className="eyebrow flex flex-col items-center justify-between gap-2 border-t border-line pt-8 sm:flex-row sm:gap-6">
          <p>© {new Date().getFullYear()} vx</p>
          <p>
            <a
              href={links.website}
              className="inline-flex min-h-11 items-center text-ink transition-colors hover:text-ember sm:min-h-0"
            >
              {t.footer.source} ↗︎
            </a>
          </p>
        </div>
        <p
          aria-hidden
          className="reveal wordmark text-center sm:text-left -mt-[0.12em] -mb-[0.2em] text-[clamp(8rem,4rem+26vw,26rem)] leading-[0.8] font-semibold tracking-[-0.06em] select-none"
        >
          vx
        </p>
        <div className="pb-[env(safe-area-inset-bottom)]" />
      </div>
    </footer>
  );
}
