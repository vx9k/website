import type { ReactNode } from "react";
import { links, specs, suite, type Status } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./Section";
import Specs from "./Specs";

// The shape carries the status, not the colour: a filled, half and empty
// square.
const glyph: Record<Status, string> = {
  shipping: "bg-signal",
  "in progress": "border border-signal bg-[linear-gradient(90deg,var(--signal)_50%,transparent_0)]",
  planned: "border border-signal",
};

function Project({ name, href, children }: { name: string; href: string; children: ReactNode }) {
  return (
    <article aria-labelledby={`${name}-title`}>
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 id={`${name}-title`} className="text-2xl font-medium tracking-tight">
          {name}
        </h3>
        <a href={href} className="link font-mono text-sm text-muted hover:text-fg">
          {href.replace("https://", "")} <span aria-hidden>↗</span>
        </a>
      </header>
      {children}
    </article>
  );
}

export default function Work({ t }: { t: Dictionary }) {
  const w = t.work;
  return (
    <Section id="work" title={w.title}>
      <div className="space-y-20">
        <Project name="4suite" href={links.suite}>
          <p className="mt-4 max-w-[40rem] text-pretty">{w.suite.body}</p>
          <Specs
            className="mt-8"
            rows={[
              [w.spec.language, specs.suite.language],
              [w.spec.target, w.suite.target],
              [w.spec.build, specs.suite.build],
              [w.spec.license, specs.suite.license],
            ]}
          />
          <p className="mt-1 text-sm text-muted text-pretty">{w.suite.platforms}</p>

          <h4 className="label mt-12">{w.suite.components}</h4>
          <ul className="mt-4 border-b border-line">
            {suite.map(({ name, status }) => (
              <li key={name} className="grid gap-x-6 gap-y-2 border-t border-line py-5 sm:grid-cols-[10rem_minmax(0,1fr)]">
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="label mt-1.5 flex items-center gap-2">
                    <span aria-hidden className={`size-2 shrink-0 ${glyph[status]}`} />
                    {w.status[status]}
                  </p>
                </div>
                <p className="text-muted text-pretty">{w.suite.nodes[name]}</p>
              </li>
            ))}
          </ul>
        </Project>

        <Project name="website" href={links.website}>
          <p className="mt-4 max-w-[40rem] text-pretty">{w.site.body}</p>
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
