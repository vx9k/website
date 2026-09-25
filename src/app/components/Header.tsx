import type { Dictionary, Locale } from "../i18n";
import FlagsPanel from "./FlagsPanel";
import LanguageSwitch from "./LanguageSwitch";
import SectionNav from "./SectionNav";

export default function Header({ lang, t }: { lang: Locale; t: Dictionary }) {
  const { label, language, ...labels } = t.nav;

  return (
    <header className="no-print glass-bar fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <a
          href="#top"
          className="inline-flex min-h-11 items-center text-xl font-semibold tracking-[-0.06em] text-ink"
        >
          vx
        </a>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          <SectionNav label={label} labels={labels} />
          <LanguageSwitch lang={lang} label={language} />
          <FlagsPanel text={t.display} />
        </div>
      </div>
    </header>
  );
}
