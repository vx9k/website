import { links } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./SectionHeading";

export default function Contact({ t }: { t: Dictionary }) {
  const { kicker, title, quote, source } = t.contact;
  return (
    <Section id="contact" index="04" kicker={kicker} title={title}>
      <figure className="reveal max-w-[44rem] border-l-[6px] border-accent pl-5 sm:pl-7">
        <blockquote className="text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-[1.35] font-medium text-pretty">
          <p>{quote}</p>
        </blockquote>
      </figure>

      <div className="reveal mt-10 flex flex-wrap gap-3">
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
          {source}
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
