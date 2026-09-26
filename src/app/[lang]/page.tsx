import Contact from "@/components/site/Contact";
import Intro from "@/components/site/Intro";
import LanguageLinks from "@/components/site/LanguageLinks";
import Principles from "@/components/site/Principles";
import Skills from "@/components/site/Skills";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { links, sections } from "../content";
import { getDictionary, hasLocale } from "../i18n";

// The language segments: mono, small, the current one filled. Contrast
// themes drop the fill, so the current one is underlined there too.
const segment = "h-7 px-2 font-mono";
const current = cn(buttonVariants({ variant: "secondary", size: "xs" }), segment, "forced-colors:underline");
const other = cn(buttonVariants({ variant: "ghost", size: "xs" }), segment, "text-muted-foreground");

// One page in one centred column: the introduction, then numbered
// sections of cards, on carbon with a faint mesh behind (see globals.css).
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  // The layout already 404s unknown languages; this narrows the type.
  if (!hasLocale(lang)) return null;
  const t = getDictionary(lang);

  return (
    <>
      {/* Text scrolls under the header, so it's frosted, and solid when
          the system asks for less transparency. */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md [@media(prefers-reduced-transparency:reduce)]:bg-background [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none">
        <div className="shell flex h-14 items-center justify-between gap-4">
          <a href={`/${lang}`} className="inline-flex min-h-10 items-center gap-2.5 font-semibold tracking-tight">
            <span aria-hidden className="size-2.5 rounded-[2px] bg-signal" />
            vx
          </a>
          <div className="flex items-center gap-3">
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

      <footer className="shell">
        <Separator />
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-6 text-sm text-muted-foreground">
          <p>vx</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="link" size="sm">
              <a href={links.website}>{t.footer.source} ↗</a>
            </Button>
            <Button asChild variant="link" size="sm">
              <a href="#top">{t.footer.top} ↑</a>
            </Button>
          </div>
        </div>
      </footer>
    </>
  );
}
