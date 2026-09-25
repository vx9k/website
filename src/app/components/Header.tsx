import FlagsPanel from "./FlagsPanel";
import SectionNav from "./SectionNav";

export default function Header() {
  return (
    <header className="no-print glass-bar fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <a
          href="#top"
          className="inline-flex min-h-11 items-center text-xl font-semibold tracking-[-0.06em] text-ink"
        >
          vx
        </a>
        <div className="flex items-center gap-6 lg:gap-10">
          <SectionNav />
          <FlagsPanel />
        </div>
      </div>
    </header>
  );
}
