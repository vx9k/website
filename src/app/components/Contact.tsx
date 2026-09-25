import { links } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./Section";

export default function Contact({ t }: { t: Dictionary }) {
  return (
    <Section id="contact" title={t.contact.title}>
      <blockquote className="border-l-[calc(2*var(--px))] border-line pl-5 text-xl leading-8 font-medium text-pretty sm:pl-7">
        <p>{t.contact.quote}</p>
      </blockquote>
      <p className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6">
        <a href={links.github} className="btn">
          github.com/vx9k <span aria-hidden>↗</span>
        </a>
        <a href={links.website} className="link">
          {t.contact.source} <span aria-hidden>↗</span>
        </a>
      </p>
    </Section>
  );
}
