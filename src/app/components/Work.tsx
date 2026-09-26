import type { ReactNode } from "react";
import { links, specs, suite, type Status } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./Section";
import Specs from "./Specs";

// The shape carries the status, not the colour: a filled, half and empty
// square. They keep their fill in contrast themes, where --signal becomes
// the text colour.
const glyph: Record<Status, string> = {
  shipping: "bg-signal",
  "in progress": "border border-signal bg-[linear-gradient(90deg,var(--signal)_50%,transparent_0)]",
  planned: "border border-signal",
};

function Project({ name, href, children }: { name: string; href: string; children: ReactNode }) {
  return (
    <article aria-labelledby={`${name}-title`}>
      <header className="flex flex-wrap items-baseline justify-between gap-x-6">
        <h3 id={`${name}-title`} className="text-xl font-medium tracking-tight">
          {name}
        </h3>
        <a href={href} className="link inline-flex min-h-11 items-center font-mono text-sm text-muted hover:text-fg">
          {href.replace("https://", "")}&nbsp;<span aria-hidden>↗</span>
        </a>
      </header>
      {children}
    </article>
  );
}

export default function Work({ t }: { t: Dictionary }) {
  const w = t.work;
  const notes: Partial<Record<string, string>> = w.suite.nodes;
  return (
    <Section id="work" title={w.title}>
      <div className="space-y-20">
        <Project name="4suite" href={links.suite}>
          <p className="mt-2 max-w-[36rem] text-pretty">{w.suite.body}</p>
          <Specs
            className="mt-8"
            rows={[
              [w.spec.language, specs.suite.language],
              [w.spec.target, w.suite.target],
              [w.spec.build, specs.suite.build],
              [w.spec.license, specs.suite.license],
            ]}
          />

          <h4 className="label mt-10">{w.suite.components}</h4>
          <ul className="mt-4 border-b border-line">
            {suite.map(({ name, status }) => (
              <li key={name} className="grid gap-x-6 gap-y-1 border-t border-line py-4 md:grid-cols-4">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-medium">{name}</span>
                  <span className="label inline-flex items-center gap-2">
                    <span aria-hidden className={`size-2 shrink-0 forced-color-adjust-none ${glyph[status]}`} />
                    {w.status[status]}
                  </span>
                </p>
                {notes[name] && <p className="text-muted text-pretty md:col-span-3">{notes[name]}</p>}
              </li>
            ))}
          </ul>
        </Project>

        <Project name="website" href={links.website}>
          <p className="mt-2 max-w-[36rem] text-pretty">{w.site.body}</p>
          <Specs
            className="mt-8"
            rows={[
              [w.spec.language, specs.site.language],
              [w.spec.framework, specs.site.framework],
              [w.spec.styling, specs.site.styling],
              [w.spec.hosting, specs.site.hosting],
            ]}
          />
        </Project>
      </div>
    </Section>
  );
}
