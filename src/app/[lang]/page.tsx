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

// The footer's links: plain text, underlined on hover.
const footerLink = "h-8 px-0 text-base font-normal text-foreground";

// One page: a dark first screen with the introduction, then the sections
// on white, then the footer (see globals.css).
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  // The layout already 404s unknown languages; this narrows the type.
  if (!hasLocale(lang)) return null;
  const t = getDictionary(lang);

  return (
    <>
      {/* The header is a dark zone over the whole page, solid so the page
          scrolls under it cleanly. */}
      <header className="site-header dark sticky top-0 z-40 border-b bg-background">
        <div className="shell flex h-14 items-center justify-between gap-4">
          <a href={`/${lang}`} className="logo inline-flex min-h-10 items-center gap-2.5 font-mono text-[0.9375rem] font-light [font-stretch:112.5%]">
            <span aria-hidden className="size-2 bg-signal" />
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
        {/* The first screen is dark and see-through, over the background
            canvas; the rest of the page is white. */}
        <div className="dark">
          <Intro t={t} />
        </div>
        <div className="page">
          <Skills t={t} />
          <Principles t={t} />
          <Contact t={t} />
        </div>
      </main>

      {/* The name on the left, two columns of links under small labels. */}
      <footer className="site-footer page border-t">
        <div className="shell grid gap-10 py-14 sm:grid-cols-12 sm:py-20">
          <p className="inline-flex items-center gap-2.5 self-start font-mono text-[0.9375rem] sm:col-span-6">
            <span aria-hidden className="size-2 bg-signal" />
            vx
          </p>
          <div className="flex flex-col gap-4 sm:col-span-3">
            <p className="label">{t.nav.label}</p>
            <ul className="flex flex-col items-start gap-1">
              {sections.map((id) => (
                <li key={id}>
                  <Button asChild variant="link" size="sm" className={footerLink}>
                    <a href={`#${id}`}>{t.nav[id]}</a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 sm:col-span-3">
            <p className="label">{t.footer.site}</p>
            <ul className="flex flex-col items-start gap-1">
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
      </footer>
    </>
  );
}
