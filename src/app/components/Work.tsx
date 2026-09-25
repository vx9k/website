import { links, suiteTree, type Node, type Status } from "../content";
import SectionHeading from "./SectionHeading";

const STATUS: Record<Status, { mark: string; className: string }> = {
  shipping: {
    mark: "●",
    className: "border-moss/40 bg-moss-wash text-moss",
  },
  "in progress": {
    mark: "◐",
    className: "border-sun/40 bg-sun-wash text-sun",
  },
  planned: {
    mark: "○",
    className: "border-line-strong text-muted",
  },
};

function StatusPill({ status }: { status: Status }) {
  const s = STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] tracking-wide whitespace-nowrap eink:border-ink hc:border-current ${s.className}`}
    >
      <span aria-hidden>{s.mark}</span>
      {status}
    </span>
  );
}

function TreeNode({ node }: { node: Node }) {
  return (
    <li>
      <div className="flex min-h-9 flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-base text-ink">{node.name}</span>
        <StatusPill status={node.status} />
      </div>
      <p className="mt-1.5 max-w-[34rem] text-[0.95rem] leading-7 text-pretty text-muted">
        {node.body}
      </p>
      {node.note && (
        <p className="mt-1 text-sm text-faint">{node.note}</p>
      )}
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

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Built with">
      {items.map((t) => (
        <li
          key={t}
          className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted eink:border-ink"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="border-t border-line py-20 sm:py-28"
    >
      <div className="reveal">
        <SectionHeading
          id="work-title"
          index="02"
          kicker="work"
          title="Selected work"
          aside="Small programs, each doing one job. Laid out the way they run."
        />
      </div>

      <article
        aria-labelledby="suite-title"
        className="reveal glass mt-12 grid gap-10 rounded-[2rem] p-6 sm:mt-16 sm:p-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 lg:p-12"
      >
        <div className="flex flex-col gap-6">
          <div>
            <p className="eyebrow">Boot stack · C</p>
            <h3
              id="suite-title"
              className="mt-3 font-mono text-3xl font-medium tracking-tight sm:text-4xl"
            >
              4suite
            </h3>
          </div>
          <p className="text-lg leading-8 text-pretty text-muted">
            A self-contained boot stack in C: init, rc, logger and user, each
            with its own scope and its own README.
          </p>
          <Tags items={["C", "Linux", "Ninja", "MIT"]} />
          <p className="mt-auto pt-2">
            <a href={links.suite} className="link font-mono text-sm text-ink">
              github.com/vx9k/4suite
            </a>
          </p>
        </div>

        <div className="border-t border-line pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
          <p className="font-mono text-sm text-faint">
            <span aria-hidden>$ </span>tree 4suite
          </p>
          <ul className="tree mt-5 space-y-5" aria-label="4suite components">
            {suiteTree.map((n) => (
              <TreeNode key={n.name} node={n} />
            ))}
          </ul>
        </div>
      </article>

      <article
        aria-labelledby="site-title"
        className="reveal mt-5 grid gap-6 rounded-[2rem] border border-line bg-surface/60 p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12 eink:border-2 eink:border-ink"
      >
        <div>
          <p className="eyebrow">This site</p>
          <h3
            id="site-title"
            className="mt-3 font-mono text-2xl font-medium tracking-tight"
          >
            website
          </h3>
          <p className="mt-4 max-w-[40rem] leading-7 text-pretty text-muted">
            A static Next.js export on GitHub Pages. The forest behind this
            text is a WebGPU shader with WebGL2 and plain CSS fallbacks, it
            keeps working offline, and it has a paper mode for e-ink screens.
          </p>
          <div className="mt-5">
            <Tags items={["TypeScript", "Next.js", "WebGPU", "WGSL"]} />
          </div>
        </div>
        <a href={links.website} className="link font-mono text-sm text-ink">
          github.com/vx9k/website
        </a>
      </article>
    </section>
  );
}
