import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { eraScript, fontVariables, trustedTypesPolicy } from "../document";
import { skills } from "../content";
import { getDictionary, hasLocale, localeKeys, locales } from "../i18n";
import QuantumRoot from "@/components/quantum/QuantumRoot";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export { viewport } from "../document";

// One static copy of the site per language: /en, /es, /pt.
export const dynamicParams = false;

export function generateStaticParams() {
  return localeKeys.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);

  return {
    metadataBase: new URL("https://kthread.dev"),
    title: meta.title,
    description: meta.description,
    authors: [{ name: "vx", url: "https://github.com/vx9k" }],
    // Search engines get every translation, and the root (which picks one
    // for the visitor) as the default.
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...Object.fromEntries(localeKeys.map((l) => [locales[l].tag, `/${l}`])),
        "x-default": "/",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      locale: locales[lang].og,
      alternateLocale: localeKeys.filter((l) => l !== lang).map((l) => locales[l].og),
    },
    twitter: { card: "summary", title: meta.title, description: meta.description },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    // The early script sets data-era and data-year on <html> before React
    // hydrates it, so React is told not to mind.
    <html lang={locales[lang].tag} dir="ltr" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: trustedTypesPolicy }} />
        <script dangerouslySetInnerHTML={{ __html: eraScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip antialiased">
        {/* Out of the layout until it has focus. Parking it off screen isn't
            enough: Safari draws the page under its status bar. No
            transition, or it grows out of the 1px box sr-only leaves. */}
        <a href="#main" className={cn(buttonVariants(), "fixed top-3 left-3 z-50 transition-none not-focus:sr-only")}>
          {t.skip}
        </a>
        {children}
        <QuantumRoot
          lang={lang}
          copy={t.quantum}
          places={{ top: t.quantum.branches.top, skills: t.nav.skills, principles: t.nav.principles, contact: t.nav.contact }}
          echoes={localeKeys.filter((l) => l !== lang).map((l) => ({ lang: l, line: getDictionary(l).hero.line }))}
          names={Object.fromEntries(
            skills
              .flatMap<{ id: string; name?: string }>((g) => g.items)
              .map((i) => [i.id, i.name ?? t.skills.names[i.id as keyof typeof t.skills.names]]),
          )}
        />
      </body>
    </html>
  );
}
