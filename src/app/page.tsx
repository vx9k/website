import Hero from "./components/Hero";
import StackMarquee from "./components/StackMarquee";
import FocusAreas from "./components/FocusAreas";
import Work from "./components/Work";
import About from "./components/About";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <StackMarquee />
      <FocusAreas />
      <Work />
      <About />
      <Footer />
    </div>
  );
}
