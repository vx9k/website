import Contact from "../components/Contact";
import Controls from "../components/Controls";
import Intro from "../components/Intro";
import LanguageLinks from "../components/LanguageLinks";
import Mark from "../components/Mark";
import Principles from "../components/Principles";
import Scene from "../components/Scene";
import Screen from "../components/Screen";
import Stack from "../components/Stack";
import Work from "../components/Work";
import { getDictionary, hasLocale } from "../i18n";

// The page is a handheld console: the header is the top edge of the case,
// everything the page says is on the screen set into the bezel, and the
// footer is the lower half with the controls.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  // The layout already 404s unknown languages; this narrows the type.
  if (!hasLocale(lang)) return null;
  const t = getDictionary(lang);

  return (
    <>
      <header className="console flex items-center justify-between py-3 text-on-plastic">
        <a href={`/${lang}`} className="inline-flex min-h-11 items-center gap-3 px-1">
          <Mark className="h-[21px] w-[39px]" />
          <span className="font-label text-xs">vx</span>
        </a>
        <LanguageLinks lang={lang} label={t.nav.language} />
      </header>

      <main id="main" tabIndex={-1} className="console focus:outline-none">
        <div className="notch bg-bezel px-[clamp(0.5rem,2vw,1.5rem)] pt-2 pb-[clamp(0.5rem,2vw,1.5rem)]">
          <p aria-hidden className="flex items-center gap-2 px-1 pb-2 font-label text-xs text-on-bezel">
            <span className="size-[calc(2*var(--px))] bg-[var(--teal)]" />
            VX·9K
          </p>
          <Screen>
            <Scene labels={t.scene} />
            <div className="art-inset pb-16">
              <p className="mt-4 text-sm text-soft text-pretty">{t.scene.hint}</p>
              <div className="max-w-[44rem]">
                <Intro t={t} />
                <Work t={t} />
                <Principles t={t} />
                <Stack t={t} />
                <Contact t={t} />
              </div>
            </div>
          </Screen>
        </div>
      </main>

      <Controls t={t} />
    </>
  );
}
