import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontVariables } from "../document";
import { getDictionary, hasLocale, localeKeys, locales } from "../i18n";

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
    <html lang={locales[lang].tag} dir="ltr" className={fontVariables}>
      <body className="min-h-dvh overflow-x-clip antialiased">
        <a
          href="#main"
          className="fixed top-[calc(var(--safe-top)+0.75rem)] left-3 z-20 -translate-y-[calc(100%+var(--safe-top)+1rem)] rounded-sm bg-fg px-4 py-3 text-sm text-bg focus-visible:translate-y-0"
        >
          {t.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
