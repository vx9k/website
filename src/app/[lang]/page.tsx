import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Principles from "../components/Principles";
import SectionNav from "../components/SectionNav";
import Stack from "../components/Stack";
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
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero t={t} />
        {/* Two columns from laptop width, after suckless.org: a side menu
            that stays put, and a single column of content that reads like
            a document. */}
        <div className="shell lg:grid lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <SectionNav label={label} labels={labels} />
          <div className="max-w-[60rem]">
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
