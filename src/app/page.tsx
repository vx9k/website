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
      <main id="main" tabIndex={-1} className="shell flex-1 focus:outline-none">
        <Hero />
        <Principles />
        <Work />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
