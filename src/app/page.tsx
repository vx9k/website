import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Principles from "./components/Principles";
import Stack from "./components/Stack";
import Work from "./components/Work";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero />
        {/* Solid from here down, so the shader only shows behind the hero. */}
        <div className="relative bg-bg">
          <div className="shell">
            <Principles />
            <Work />
            <Stack />
            <Contact />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
