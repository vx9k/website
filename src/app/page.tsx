import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Principles from "./components/Principles";
import { ProcessRail } from "./components/SectionNav";
import Stack from "./components/Stack";
import Work from "./components/Work";

export default function Home() {
  return (
    <>
      <Header />
      <div className="shell flex-1 xl:grid xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-16">
        <ProcessRail />
        <main id="main" tabIndex={-1} className="min-w-0 focus:outline-none">
          <Hero />
          <Principles />
          <Work />
          <Stack />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
}
