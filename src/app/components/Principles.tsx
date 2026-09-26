import type { Dictionary } from "../i18n";
import Section from "./Section";

export default function Principles({ t }: { t: Dictionary }) {
  return (
    <Section id="principles" title={t.principles.title}>
      <ol className="glass px-5 sm:px-8">
        {t.principles.items.map((item) => (
          <li
            key={item.title}
            className="grid gap-x-6 gap-y-1 border-t border-line py-5 first:border-t-0 sm:py-8 md:grid-cols-4"
          >
            <h3 className="font-medium text-balance">{item.title}</h3>
            <p className="text-muted text-pretty md:col-span-3">{item.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
