import { stack } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./Section";

export default function Stack({ t }: { t: Dictionary }) {
  return (
    <Section id="stack" title={t.stack.title}>
      <dl>
        {stack.map(({ group, items }) => (
          <div key={group} className="rule grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-2.5">
            <dt className="eyebrow pt-0.5">{t.stack.groups[group]}</dt>
            <dd>{items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
