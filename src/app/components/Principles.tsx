import type { Dictionary } from "../i18n";
import Section from "./Section";

export default function Principles({ t }: { t: Dictionary }) {
  const p = t.principles;
  return (
    <Section id="principles" title={p.title} aside={p.aside}>
      <ol>
        {p.items.map((item, i) => (
          <li key={item.title} className="rule grid grid-cols-[3rem_minmax(0,1fr)] gap-2 py-5">
            <span aria-hidden className="eyebrow pt-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-pretty">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
