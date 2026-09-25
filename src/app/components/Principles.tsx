import type { Dictionary } from "../i18n";
import Section from "./SectionHeading";

export default function Principles({ t }: { t: Dictionary }) {
  const { kicker, title, aside, items } = t.principles;
  return (
    <Section
      id="principles"
      index="01"
      kicker={kicker}
      title={title}
      aside={aside}
    >
      <ol className="border-b border-line">
        {items.map((p, i) => (
          <li
            key={p.title}
            className="reveal grid gap-x-8 gap-y-2 border-t border-line py-7 sm:grid-cols-[3rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,0.8fr)_minmax(0,1.2fr)]"
          >
            <span aria-hidden className="eyebrow pt-1 text-ember!">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-subhead font-medium text-balance">{p.title}</h3>
            <p className="max-w-[36rem] leading-7 text-pretty text-muted sm:col-start-2 md:col-start-auto md:pt-0.5">
              {p.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
