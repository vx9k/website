import { links } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./Section";

export default function Contact({ t }: { t: Dictionary }) {
  return (
    <Section id="contact" title={t.contact.title}>
      <div className="lg:pt-8">
        <p className="max-w-[36rem] text-xl text-pretty">{t.contact.line}</p>
        <a href={links.github} className="btn mt-6">
          github.com/vx9k <span aria-hidden>↗</span>
        </a>
      </div>
    </Section>
  );
}
