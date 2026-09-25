import { links, suiteTree, type Node, type Status } from "../content";
import type { Dictionary } from "../i18n";
import Section from "./SectionHeading";

type WorkText = Dictionary["work"];

// Mono chips whose glyph (full, half, empty square) carries the status
// without relying on colour.
const STATUS: Record<Status, { chip: string; glyph: string }> = {
  shipping: { chip: "[--frame:var(--accent)]", glyph: "bg-accent" },
  "in progress": {
    chip: "",
    glyph: "border-2 border-current bg-[linear-gradient(90deg,currentColor_50%,transparent_50%)]",
  },
  planned: { chip: "", glyph: "border-2 border-current" },
};

function StatusChip({ status, label }: { status: Status; label: string }) {
  const s = STATUS[status];
  return (
    <span className={`chip px-frame ${s.chip}`}>
      <span aria-hidden className={`size-2.5 ${s.glyph}`} />
      {label}
    </span>
  );
}

function TreeNode({ node, w }: { node: Node; w: WorkText }) {
  const text: { body: string; note?: string } = w.suite.nodes[node.name];
  return (
    <li>
      <div className="flex min-h-9 flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-lg font-semibold">
          {node.name}
        </span>
        <StatusChip status={node.status} label={w.status[node.status]} />
      </div>
      <p className="mt-1.5 max-w-[34rem] leading-7 text-pretty">
        {text.body}
      </p>
      {text.note && <p className="mt-1 text-sm">{text.note}</p>}
      {node.children && (
        <ul className="mt-4 space-y-5">
          {node.children.map((c) => (
            <TreeNode key={c.name} node={c} w={w} />
          ))}
        </ul>
      )}
    </li>
  );
}

// Spec sheet in place of tag chips.
function Spec({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="rule-b">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 rule-t py-2.5"
        >
          <dt className="eyebrow pt-1">{k}</dt>
          <dd className="font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function RepoLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group inline-flex min-h-11 items-center gap-2 px-1 font-label text-xs hover:bg-ink hover:text-bg"
    >
      {label}
      <span
        aria-hidden
        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        ↗︎
      </span>
    </a>
  );
}

export default function Work({ t }: { t: Dictionary }) {
  const w = t.work;
  return (
    <Section
      id="work"
      index="02"
      kicker={w.kicker}
      title={w.title}
      aside={w.aside}
    >
      <article aria-labelledby="suite-title" className="reveal px-frame m-[var(--px)]">
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 rule-b px-5 sm:px-8">
          <p className="eyebrow py-3">
            <span>01</span>
            <span aria-hidden className="px-2">
              /
            </span>
            {w.suite.eyebrow}
          </p>
          <RepoLink href={links.suite} label="github.com/vx9k/4suite" />
        </header>

        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col gap-6 p-5 sm:p-8">
            <h3
              id="suite-title"
              className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight font-semibold"
            >
              4suite
            </h3>
            <p className="max-w-[28rem] leading-7 text-pretty">
              {w.suite.body}
            </p>
            <div className="mt-auto">
              <Spec
                rows={[
                  [w.spec.language, "C"],
                  [w.spec.target, w.suite.target],
                  [w.spec.build, "Ninja"],
                  [w.spec.license, "MIT"],
                ]}
              />
              <p className="mt-4 text-sm leading-6 text-pretty">
                {w.suite.platforms}
              </p>
            </div>
          </div>

          <div className="rule-t p-5 sm:p-8 lg:bg-none lg:border-l-3 lg:border-dashed lg:border-line lg:p-8">
            <p className="eyebrow">{w.suite.components}</p>
            <ul className="tree mt-5 space-y-5" aria-label={w.suite.componentsLabel}>
              {suiteTree.map((n) => (
                <TreeNode key={n.name} node={n} w={w} />
              ))}
            </ul>
          </div>
        </div>
      </article>

      <article
        aria-labelledby="site-title"
        className="reveal px-frame m-[var(--px)] mt-10"
      >
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 rule-b px-5 sm:px-8">
          <p className="eyebrow py-3">
            <span>02</span>
            <span aria-hidden className="px-2">
              /
            </span>
            {w.site.eyebrow}
          </p>
          <RepoLink href={links.website} label="github.com/vx9k/website" />
        </header>
        <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-12 lg:p-8">
          <div>
            <h3
              id="site-title"
              className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight font-semibold"
            >
              website
            </h3>
            <p className="mt-5 max-w-[34rem] leading-7 text-pretty">
              {w.site.body}
            </p>
          </div>
          <Spec
            rows={[
              [w.spec.language, "TypeScript"],
              [w.spec.framework, "Next.js"],
              [w.spec.graphics, "SVG"],
              [w.spec.hosting, "Cloudflare Workers"],
            ]}
          />
        </div>
      </article>
    </Section>
  );
}
