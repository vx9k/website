import Contact from "../components/Contact";
import Intro from "../components/Intro";
import LanguageLinks from "../components/LanguageLinks";
import Principles from "../components/Principles";
import Stack from "../components/Stack";
import Work from "../components/Work";
import { links, sections } from "../content";
import { getDictionary, hasLocale } from "../i18n";

// One page that reads like a spec sheet: a statement, the facts, then
// numbered sections, with the content on panes of glass. From lg up the
// header, every section and the footer share one split, so everything but
// the titles hangs from one vertical. The header bar bleeds past the shell
// by its own padding (less its 1px border), so its contents stay on it.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  // The layout already 404s unknown languages; this narrows the type.
  if (!hasLocale(lang)) return null;
  const t = getDictionary(lang);

  return (
    <>
      <header className="shell sticky top-3 z-10">
        <div className="glass frost split -mx-3 flex items-center justify-between px-[calc(0.75rem-1px)] py-1.5 lg:grid">
          <a href={`/${lang}`} className="inline-flex min-h-11 min-w-11 items-center gap-2.5 justify-self-start font-medium tracking-tight">
            <span aria-hidden className="size-2.5 rounded-[2px] bg-signal" />
            vx
          </a>
          <div className="flex items-center justify-between gap-6">
            <nav aria-label={t.nav.label} className="hidden md:block">
              <ul className="flex gap-8 text-sm">
                {sections.map((id) => (
                  <li key={id}>
                    <a href={`#${id}`} className="inline-flex min-h-11 items-center text-muted hover:text-fg">
                      {t.nav[id]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <LanguageLinks lang={lang} label={t.nav.language} />
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Intro t={t} />
        <Work t={t} />
        <Principles t={t} />
        <Stack t={t} />
        <Contact t={t} />
      </main>

      <footer className="shell">
        <div className="split flex flex-wrap items-center justify-between gap-x-6 border-t border-line py-2 text-sm text-muted lg:grid lg:gap-x-12">
          <p>vx</p>
          <p className="flex flex-wrap items-center justify-between gap-x-6">
            <a href={links.website} className="link inline-flex min-h-11 items-center hover:text-fg">
              {t.footer.source}&nbsp;<span aria-hidden>↗</span>
            </a>
            <a href="#top" className="inline-flex min-h-11 items-center hover:text-fg">
              {t.footer.top}&nbsp;<span aria-hidden>↑</span>
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
