import { links } from "../content";
import type { Dictionary } from "../i18n";
import ConsoleControls from "./ConsoleControls";

// The console's lower half, on the case: the controls, then the small print.
export default function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="console pb-[env(safe-area-inset-bottom)]">
      <ConsoleControls text={t.console} />
      <div className="eyebrow flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pb-6 text-on-plastic!">
        <p>© {new Date().getFullYear()} vx</p>
        <p>
          <a href={links.website} className="inline-flex min-h-11 items-center px-1 hover:bg-ink hover:text-bg">
            {t.footer.source} ↗︎
          </a>
        </p>
      </div>
    </footer>
  );
}
