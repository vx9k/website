import { stack } from "../content";
import Section from "./SectionHeading";

export default function Stack() {
  return (
    <Section id="stack" index="03" kicker="Stack" title="Tools I reach for">
      <dl className="border-b border-line">
        {stack.map((g) => (
          <div
            key={g.group}
            className="reveal grid gap-x-10 gap-y-3 border-t border-line py-7 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-baseline sm:py-9"
          >
            <dt className="eyebrow">{g.group}</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-subhead font-medium">
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
