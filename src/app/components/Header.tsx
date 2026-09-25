import FlagsPanel from "./FlagsPanel";
import Mark from "./Mark";
import SectionNav from "./SectionNav";

export default function Header() {
  return (
    <header className="no-print glass-bar sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className="shell grid h-14 grid-cols-[auto_1fr_auto] items-center gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-0">
        <a
          href="#top"
          className="inline-flex min-h-11 items-center gap-3 self-center justify-self-start text-sm font-semibold tracking-[-0.02em] text-ink"
        >
          <Mark className="size-7 text-moss" />
          vx
        </a>
        <div className="flex items-center justify-end gap-6 lg:justify-between lg:pl-10">
          <SectionNav />
          <FlagsPanel />
        </div>
      </div>
    </header>
  );
}
