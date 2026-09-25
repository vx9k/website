import { stack } from "../content";
import SectionHeading from "./SectionHeading";

export default function Stack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="border-t border-line py-20 sm:py-28"
    >
      <div className="reveal">
        <SectionHeading
          id="stack-title"
          index="03"
          kicker="stack"
          title="Tools I reach for"
        />
      </div>

      <div className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-3">
        {stack.map((g) => (
          <div
            key={g.group}
            className="reveal rounded-3xl border border-line p-6 sm:p-7 eink:border-2 eink:border-ink"
          >
            <h3 className="eyebrow">{g.group}</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {g.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-surface/50 px-3.5 py-1.5 font-mono text-sm text-ink eink:border-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
