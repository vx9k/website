import { links, suiteTree, type Node, type Status } from "../content";
import Section from "./SectionHeading";

// Mono chips whose glyph (full, half, empty square) carries the status
// without relying on colour.
const STATUS: Record<Status, { chip: string; glyph: string }> = {
  shipping: { chip: "border-ember/50 text-ember", glyph: "bg-current" },
  "in progress": {
    chip: "text-ink",
    glyph: "border border-current bg-[linear-gradient(90deg,currentColor_50%,transparent_50%)]",
  },
  planned: { chip: "border-dashed text-muted", glyph: "border border-current" },
};

function StatusChip({ status }: { status: Status }) {
  const s = STATUS[status];
  return (
    <span className={`chip eink:border-ink hc:border-current ${s.chip}`}>
      <span aria-hidden className={`size-2 rounded-[1px] ${s.glyph}`} />
      {status}
    </span>
  );
}

function TreeNode({ node }: { node: Node }) {
  return (
    <li>
      <div className="flex min-h-9 flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-[0.95rem] font-medium text-ink">
          {node.name}
        </span>
        <StatusChip status={node.status} />
      </div>
      <p className="mt-1.5 max-w-[34rem] text-[0.95rem] leading-7 text-pretty text-muted">
        {node.body}
      </p>
      {node.note && <p className="mt-1 text-sm text-faint">{node.note}</p>}
      {node.children && (
        <ul className="mt-4 space-y-5">
          {node.children.map((c) => (
            <TreeNode key={c.name} node={c} />
          ))}
        </ul>
      )}
    </li>
  );
}

// Spec sheet in place of tag chips.
function Spec({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="border-b border-line">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 border-t border-line py-2.5"
        >
          <dt className="eyebrow text-faint!">{k}</dt>
          <dd className="text-[0.95rem] font-medium text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function RepoLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group inline-flex min-h-11 items-center gap-2 font-mono text-[0.8rem] text-ink transition-colors hover:text-ember"
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

export default function Work() {
  return (
    <Section
      id="work"
      index="02"
      kicker="Work"
      title="Selected work"
      aside="Small programs that each do one job, laid out the way they run."
    >
      <article aria-labelledby="suite-title" className="reveal card">
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-5 sm:px-8">
          <p className="eyebrow py-3">
            <span className="text-ember">01</span>
            <span aria-hidden className="px-2 text-faint">
              /
            </span>
            Boot stack
          </p>
          <RepoLink href={links.suite} label="github.com/vx9k/4suite" />
        </header>

        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col gap-8 p-5 sm:p-8 lg:p-10">
            <h3
              id="suite-title"
              className="text-title font-medium"
            >
              4suite
            </h3>
            <p className="max-w-[28rem] text-lg leading-8 text-pretty text-muted">
              A self-contained boot stack in C: init, rc, logger and user,
              each with its own scope and its own README.
            </p>
            <div className="mt-auto">
              <Spec
                rows={[
                  ["Language", "C"],
                  ["Target", "Linux"],
                  ["Build", "Ninja"],
                  ["License", "MIT"],
                ]}
              />
            </div>
          </div>

          <div className="border-t border-line p-5 sm:p-8 lg:border-t-0 lg:border-l lg:p-10">
            <p className="eyebrow">Components</p>
            <ul className="tree mt-5 space-y-5" aria-label="4suite components">
              {suiteTree.map((n) => (
                <TreeNode key={n.name} node={n} />
              ))}
            </ul>
          </div>
        </div>
      </article>

      <article
        aria-labelledby="site-title"
        className="reveal card mt-4"
      >
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-5 sm:px-8">
          <p className="eyebrow py-3">
            <span className="text-ember">02</span>
            <span aria-hidden className="px-2 text-faint">
              /
            </span>
            This site
          </p>
          <RepoLink href={links.website} label="github.com/vx9k/website" />
        </header>
        <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-12 lg:p-10">
          <div>
            <h3
              id="site-title"
              className="text-subhead font-medium"
            >
              website
            </h3>
            <p className="mt-5 max-w-[34rem] leading-7 text-pretty text-muted">
              A static Next.js export served from Cloudflare Workers. The ember
              smoke behind the hero is a WebGPU shader that falls back to
              WebGL2, then to plain CSS. The page tells you when you go offline,
              and it has a paper mode for e-ink screens.
            </p>
          </div>
          <Spec
            rows={[
              ["Language", "TypeScript"],
              ["Framework", "Next.js"],
              ["Graphics", "WebGPU, WGSL"],
              ["Hosting", "Cloudflare Workers"],
            ]}
          />
        </div>
      </article>
    </Section>
  );
}
