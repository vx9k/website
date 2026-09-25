import { stack } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./SectionHeading";

export default function Stack({ t }: { t: Dictionary }) {
  const { kicker, title, groups } = t.stack;
  return (
    <Section id="stack" index="03" kicker={kicker} title={title}>
      <dl className="border-b border-line">
        {stack.map((g) => (
          <div
            key={g.group}
            className="reveal grid gap-x-10 gap-y-3 border-t border-line py-7 text-center sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-baseline sm:py-9 sm:text-left"
          >
            <dt className="eyebrow">{groups[g.group]}</dt>
            <dd>
              <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-subhead font-medium sm:justify-start">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="after:ml-4 after:font-normal after:text-faint after:content-['/'] last:after:content-none"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
            <dd aria-hidden className="eyebrow hidden text-faint! sm:block">
              {String(g.items.length).padStart(2, "0")}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
