import { stack } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./Section";

export default function Stack({ t }: { t: Dictionary }) {
  return (
    <Section id="stack" title={t.stack.title}>
      <dl>
        {stack.map(({ group, items }) => (
          <div
            key={group}
            className="grid gap-x-6 gap-y-1 border-t border-line py-4 first:border-t-0 first:pt-0 md:grid-cols-4 md:items-baseline"
          >
            <dt className="label">{t.stack.groups[group]}</dt>
            <dd className="md:col-span-3">{items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
