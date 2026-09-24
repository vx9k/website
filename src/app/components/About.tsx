import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="py-14 sm:py-16">
      <Reveal className="max-w-xl">
        <p className="font-[family-name:var(--font-display)] text-2xl italic leading-relaxed text-ink sm:text-3xl">
          I'd rather ship something small that I fully understand than
          something large I'm still discovering the edges of.
        </p>
      </Reveal>
    </section>
  );
}
