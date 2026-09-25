import FlagsPanel from "./FlagsPanel";
import Mark from "./Mark";
import { HeaderNav } from "./SectionNav";

export default function Header() {
  return (
    <header className="no-print sticky top-0 z-40 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="shell">
        <div className="glass flex h-14 items-center justify-between gap-4 rounded-full pr-1.5 pl-2.5">
          <a
            href="#top"
            className="inline-flex min-h-11 items-center gap-2.5 rounded-full pr-3 pl-1.5 font-mono text-sm font-medium text-ink"
          >
            <Mark className="size-8 text-moss" />
            vx
          </a>
          <HeaderNav />
          <FlagsPanel />
        </div>
      </div>
    </header>
  );
}
