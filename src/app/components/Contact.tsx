import { links } from "../content";
import Section from "./SectionHeading";

export default function Contact() {
  return (
    <Section id="contact" index="04" kicker="Contact" title="Say hello">
      <figure className="reveal max-w-[52rem]">
        <blockquote className="text-[clamp(1.75rem,1rem+2.4vw,3.25rem)] leading-[1.1] font-medium tracking-[-0.04em] text-balance">
          <p>
            <span aria-hidden className="text-ember">
              “
            </span>
            I&apos;d rather ship something small that I fully understand than
            something large I&apos;m still discovering the edges of.
            <span aria-hidden className="text-ember">
              ”
            </span>
          </p>
        </blockquote>
      </figure>

      <div className="reveal mt-12 flex flex-wrap gap-3 sm:mt-16">
        <a href={links.github} className="group btn btn-solid">
          github.com/vx9k
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            ↗︎
          </span>
        </a>
        <a href={links.website} className="group btn">
          Source for this site
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            ↗︎
          </span>
        </a>
      </div>
    </Section>
  );
}
