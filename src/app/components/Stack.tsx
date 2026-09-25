import { stack } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./SectionHeading";

export default function Stack({ t }: { t: Dictionary }) {
  const { kicker, title, groups } = t.stack;
  return (
    <Section id="stack" index="03" kicker={kicker} title={title}>
      <dl className="rule-b">
        {stack.map((g) => (
          <div
            key={g.group}
            className="reveal grid gap-x-8 gap-y-2 rule-t py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-baseline"
          >
            <dt className="eyebrow">{groups[g.group]}</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-subhead font-medium">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="after:ml-3 after:font-normal after:text-line after:content-['/'] last:after:content-none"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
