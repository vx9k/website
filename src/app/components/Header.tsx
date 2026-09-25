import type { Dictionary, Locale } from "../i18n";
import FlagsPanel from "./FlagsPanel";
import LanguageSwitch from "./LanguageSwitch";
import PixelMark from "./PixelMark";

// A plain top bar, like a document's masthead: the mark and the domain on
// the left, language and display settings on the right. It scrolls away
// with the page; the section nav lives beside the content instead.
export default function Header({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <header className="no-print pt-[env(safe-area-inset-top)]">
      <div className="shell flex h-16 items-center justify-between gap-4 sm:h-20">
        <a
          href="#top"
          className="group inline-flex min-h-11 items-center gap-3"
        >
          {/* 11×5 art pixels at exactly 3px each, so the mark stays sharp. */}
          <PixelMark className="h-[15px] w-[33px]" />
          <span className="sr-only">vx</span>
          <span className="hidden font-mono text-[0.8rem] text-muted transition-colors group-hover:text-ink sm:inline">
            kthread.dev
          </span>
        </a>
        <div className="flex items-center gap-1 sm:gap-4">
          <LanguageSwitch lang={lang} label={t.nav.language} />
          <FlagsPanel text={t.display} />
        </div>
      </div>
    </header>
  );
}
