import type { Dictionary, Locale } from "../i18n";
import FlagsPanel from "./FlagsPanel";
import PlayButton from "./game/PlayButton";
import LanguageSwitch from "./LanguageSwitch";
import PixelMark from "./PixelMark";

// The console's top edge, on the case: the mark on its badge (it drops in
// on load, like a boot logo) and the controls that aren't part of the
// screen: language, display settings, and Play.
export default function Header({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <header className="console pt-[env(safe-area-inset-top)]">
      <div className="flex h-16 items-center justify-between gap-3 sm:h-20">
        <a href="#top" className="group inline-flex min-h-11 items-center gap-3">
          {/* 11×5 art pixels at exactly 3px each, so the mark stays sharp. */}
          <span className="boot px-frame inline-flex bg-bezel px-2 py-2 [--frame:var(--bezel)]">
            <PixelMark className="h-[15px] w-[33px]" />
          </span>
          <span className="sr-only">vx</span>
          <span className="hidden px-0.5 font-label text-xs group-hover:bg-ink group-hover:text-bg sm:inline">
            kthread.dev
          </span>
        </a>
        <div className="flex items-center gap-1 sm:gap-3">
          <LanguageSwitch lang={lang} label={t.nav.language} />
          <FlagsPanel text={t.display} />
          <PlayButton play={t.game.play} stop={t.game.stop} />
        </div>
      </div>
    </header>
  );
}
