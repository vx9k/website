import Campfire from "../components/Campfire";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Game from "../components/game/Game";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Principles from "../components/Principles";
import SectionNav from "../components/SectionNav";
import Stack from "../components/Stack";
import Stairs from "../components/Stairs";
import Work from "../components/Work";
import { getDictionary, hasLocale } from "../i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  // The layout already 404s unknown languages; this narrows the type.
  if (!hasLocale(lang)) return null;
  const t = getDictionary(lang);
  const { label, language, ...labels } = t.nav;

  return (
    <>
      <Header lang={lang} t={t} />
      {/* The console: a bezel with a label strip, and the screen set into
          it. Everything the page says is on the screen. */}
      <main id="main" tabIndex={-1} className="console flex-1 focus:outline-none">
        <div className="notch bg-bezel px-[clamp(0.5rem,1.6vw,1.5rem)] pt-3 pb-[clamp(0.5rem,1.6vw,1.5rem)]">
          <div aria-hidden className="eyebrow flex items-center justify-between gap-4 px-1 pb-3 text-on-bezel!">
            <span className="flex items-center gap-2">
              <span className="power block size-[9px] bg-[var(--teal)]" />
              {t.console.power}
            </span>
            <span>
              VX·9K<span className="hidden sm:inline"> · {t.console.label}</span>
            </span>
          </div>
          <div className="lcd notch">
            <Hero t={t} />
            {/* Two columns from laptop width: a menu with a pointer, and a
                single column that reads like a document. Stairs lead from
                each section down to the next for the game. */}
            <div className="shell lg:grid lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-14 xl:gap-20">
              <SectionNav label={label} labels={labels} />
              <div className="max-w-[60rem] pb-8">
                <Principles t={t} />
                <Stairs />
                <Work t={t} />
                <Stairs reverse />
                <Stack t={t} />
                <Stairs />
                <Contact t={t} />
                <div className="rule-b mt-6 flex items-end">
                  <Campfire label={t.scene.fire} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer t={t} />
      <Game text={t.game} />
    </>
  );
}
