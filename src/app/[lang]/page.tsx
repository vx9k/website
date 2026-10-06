import Contact from "@/components/site/Contact";
import Intro from "@/components/site/Intro";
import LanguageLinks from "@/components/site/LanguageLinks";
import PanelButton from "@/components/quantum/PanelButton";
import Principles from "@/components/site/Principles";
import Skills from "@/components/site/Skills";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { links, sections } from "../content";
import { getDictionary, hasLocale } from "../i18n";

// The language segments: mono, small, the current one filled. Contrast
// themes drop the fill, so the current one is underlined there too.
const segment = "h-7 px-2 font-mono";
const current = cn(buttonVariants({ variant: "secondary", size: "xs" }), segment, "forced-colors:underline");
const other = cn(buttonVariants({ variant: "ghost", size: "xs" }), segment, "text-muted-foreground");

// The footer's links: small mono capitals, muted until hovered.
const footerLink = "h-8 px-0 font-mono text-xs tracking-wider text-muted-foreground uppercase hover:text-foreground";

// One page in one column whose edges are drawn down the page: the
// introduction centred over the background, then a band per section with
// its title pinned on the left, then the footer (see globals.css).
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  // The layout already 404s unknown languages; this narrows the type.
  if (!hasLocale(lang)) return null;
  const t = getDictionary(lang);

  return (
    <>
      {/* Solid black with a hairline under it: the page scrolls under the
          header, so it has to be opaque. */}
      <header className="site-header sticky top-0 z-40 border-b bg-background">
        <div className="shell flex h-14 items-center justify-between gap-4">
          <a
            href={`/${lang}`}
            className="inline-flex min-h-10 items-center gap-2.5 text-lg font-semibold tracking-tight"
          >
            <span aria-hidden className="size-2.5 rounded-[2px] bg-signal" />
            vx
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <nav aria-label={t.nav.label} className="hidden sm:block">
              <ul className="flex items-center gap-1">
                {sections.map((id) => (
                  <li key={id}>
                    <Button asChild variant="ghost" size="sm">
                      <a href={`#${id}`}>{t.nav[id]}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
            <PanelButton panel="branches" label={t.quantum.branches.open} />
            <PanelButton panel="time" label={t.quantum.time.open} />
            <LanguageLinks lang={lang} label={t.nav.language} current={current} other={other} />
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Intro t={t} />
        <Skills t={t} />
        <Principles t={t} />
        <Contact t={t} />
      </main>

      {/* Two columns of links in mono, and the name as large as the room
          beside them allows, its foot cut off by the bottom of the page. */}
      <footer className="band">
        <div className="shell flex flex-wrap items-end justify-between gap-x-8 gap-y-6 overflow-hidden pt-12">
          <div className="grid grid-cols-2 gap-8 pb-10 sm:gap-16">
            <div className="flex flex-col gap-3">
              <p className="label">{t.nav.label}</p>
              <ul className="flex flex-col items-start">
                {sections.map((id) => (
                  <li key={id}>
                    <Button asChild variant="link" size="sm" className={footerLink}>
                      <a href={`#${id}`}>{t.nav[id]}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <p className="label">{t.footer.site}</p>
              <ul className="flex flex-col items-start">
                <li>
                  <Button asChild variant="link" size="sm" className={footerLink}>
                    <a href={links.website}>{t.footer.source} ↗</a>
                  </Button>
                </li>
                <li>
                  <Button asChild variant="link" size="sm" className={footerLink}>
                    <a href="#top">{t.footer.top} ↑</a>
                  </Button>
                </li>
                <li>
                  <PanelButton panel="effects" label={t.quantum.effects.open} className={footerLink} />
                </li>
              </ul>
            </div>
          </div>
          <p aria-hidden className="wordmark">
            vx
          </p>
        </div>
      </footer>
    </>
  );
}
