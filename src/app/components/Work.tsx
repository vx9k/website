import type { ReactNode } from "react";
import { links, specs, suite, type Status } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./Section";

// The glyph carries the status without relying on colour: a filled, half
// and empty square.
const glyph: Record<Status, string> = {
  shipping: "bg-current",
  "in progress": "border-[length:var(--px)] border-current bg-[linear-gradient(90deg,currentColor_50%,transparent_0)]",
  planned: "border-[length:var(--px)] border-current",
};

function Spec({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="mt-6">
      {rows.map(([k, v]) => (
        <div key={k} className="rule grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-2.5">
          <dt className="eyebrow pt-0.5">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Project({
  name,
  href,
  children,
}: {
  name: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <article aria-labelledby={`${name}-title`} className="dialog px-6 py-6 sm:px-8 sm:py-7">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 id={`${name}-title`} className="text-2xl font-semibold">
          {name}
        </h3>
        <a href={href} className="link font-label text-xs">
          {href.replace("https://", "")} ↗
        </a>
      </header>
      {children}
    </article>
  );
}

export default function Work({ t }: { t: Dictionary }) {
  const w = t.work;
  return (
    <Section id="work" title={w.title} aside={w.aside}>
      <div className="space-y-10">
        <Project name="4suite" href={links.suite}>
          <p className="mt-3 text-pretty">{w.suite.body}</p>
          <Spec
            rows={[
              [w.spec.language, specs.suite.language],
              [w.spec.target, w.suite.target],
              [w.spec.build, specs.suite.build],
              [w.spec.license, specs.suite.license],
            ]}
          />
          <p className="mt-3 text-sm text-soft text-pretty">{w.suite.platforms}</p>

          <h4 className="eyebrow mt-8">{w.suite.components}</h4>
          <ul className="mt-3">
            {suite.map(({ name, status, depth }) => (
              <li key={name} className={`rule py-4 ${depth ? "ml-6 sm:ml-8" : ""}`}>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  {depth > 0 && (
                    <span aria-hidden className="text-soft">
                      └
                    </span>
                  )}
                  <span className="text-lg font-semibold">{name}</span>
                  <span className="chip">
                    <span aria-hidden className={`size-2.5 ${glyph[status]}`} />
                    {w.status[status]}
                  </span>
                </p>
                <p className="mt-2 text-pretty">{w.suite.nodes[name]}</p>
              </li>
            ))}
          </ul>
        </Project>

        <Project name="website" href={links.website}>
          <p className="mt-3 text-pretty">{w.site.body}</p>
          <Spec
            rows={[
              [w.spec.language, specs.site.language],
              [w.spec.framework, specs.site.framework],
              [w.spec.graphics, specs.site.graphics],
              [w.spec.hosting, specs.site.hosting],
            ]}
          />
        </Project>
      </div>
    </Section>
  );
}
