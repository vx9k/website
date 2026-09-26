import type { Dictionary } from "../i18n";
import Section from "./Section";

export default function Principles({ t }: { t: Dictionary }) {
  return (
    <Section id="principles" title={t.principles.title}>
      <ol>
        {t.principles.items.map((item) => (
          <li
            key={item.title}
            className="grid gap-x-6 gap-y-1 border-t border-line py-4 first:border-t-0 first:pt-0 md:grid-cols-4"
          >
            <h3 className="font-medium text-balance">{item.title}</h3>
            <p className="text-muted text-pretty md:col-span-3">{item.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
