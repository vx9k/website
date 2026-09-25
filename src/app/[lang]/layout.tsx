import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import OfflineBanner from "../components/OfflineBanner";
import { bootScript, fontVariables } from "../document";
import { getDictionary, hasLocale, localeKeys, locales } from "../i18n";

export { viewport } from "../document";

// One static copy of the site per language: /en, /es, /pt. Anything else
// under the root is a 404 rather than a page rendered on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return localeKeys.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);

  return {
    metadataBase: new URL("https://kthread.dev"),
    title: { default: meta.title, template: "%s · vx" },
    description: meta.description,
    authors: [{ name: "vx", url: "https://github.com/vx9k" }],
    // Search engines get every translation, and the root (which picks
    // one for the visitor) as the default.
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...Object.fromEntries(
          localeKeys.map((l) => [locales[l].tag, `/${l}`]),
        ),
        "x-default": "/",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      locale: locales[lang].og,
      alternateLocale: localeKeys
        .filter((l) => l !== lang)
        .map((l) => locales[l].og),
    },
    twitter: {
      card: "summary",
      title: meta.title,
      description: meta.description,
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html
      lang={locales[lang].tag}
      dir="ltr"
      suppressHydrationWarning
      className={fontVariables}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip text-ink antialiased">
        <a
          href="#main"
          className="px-frame eyebrow fixed bg-bg top-3 left-3 z-[60] -translate-y-24 px-5 py-3.5 text-ink! focus-visible:translate-y-0"
        >
          {t.skip}
        </a>
        {children}
        <OfflineBanner text={t.offline} />
      </body>
    </html>
  );
}
