import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Principles from "../components/Principles";
import Stack from "../components/Stack";
import Work from "../components/Work";
import { getDictionary, hasLocale } from "../i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  // The layout already 404s unknown languages; this narrows the type.
  if (!hasLocale(lang)) return null;
  const t = getDictionary(lang);

  return (
    <>
      <Header lang={lang} t={t} />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero t={t} />
        {/* Solid from here down, so the shader only shows behind the hero. */}
        <div className="relative bg-bg">
          <div className="shell">
            <Principles t={t} />
            <Work t={t} />
            <Stack t={t} />
            <Contact t={t} />
          </div>
        </div>
      </main>
      <Footer t={t} />
    </>
  );
}
