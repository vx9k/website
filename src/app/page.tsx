import Header from "./components/Header";
import ProcessNav from "./components/ProcessNav";
import Hero from "./components/Hero";
import Principles from "./components/Principles";
import Works from "./components/Works";
import Stack from "./components/Stack";
import About from "./components/About";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <div className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-10 lg:grid lg:grid-cols-[180px_1fr] lg:gap-16 lg:px-10">
        <ProcessNav />
        <main className="min-w-0">
          <Hero />
          <Principles />
          <Works />
          <Stack />
          <About />
        </main>
      </div>
      <Footer />
    </div>
  );
}
