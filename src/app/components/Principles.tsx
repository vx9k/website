import type { Dictionary } from "../i18n";
import Section from "./Section";

export default function Principles({ t }: { t: Dictionary }) {
  const p = t.principles;
  return (
    <Section id="principles" title={p.title} aside={p.aside}>
      <ol className="grid gap-x-8 md:grid-cols-3">
        {p.items.map((item) => (
          <li key={item.title} className="border-t border-line pt-4 pb-8">
            <h3 className="font-medium text-balance">{item.title}</h3>
            <p className="mt-2 text-muted text-pretty">{item.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
