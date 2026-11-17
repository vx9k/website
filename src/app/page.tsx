import type { CSSProperties } from "react";
import Frame from "@/components/site/Frame";
import ProjectDialog from "@/components/site/ProjectDialog";
import Sheet, { opens } from "@/components/site/Sheet";
import { contact, intro, products, site, skills } from "./content";
import { day, github, statsFor, year } from "./github";

// Structured data for search engines: vx, and the products as vx's work
// (or, for group work, the group's, with vx as a contributor).
// It's a data block, not a script, so the CSP doesn't apply to it; "<" is
// escaped so nothing in it can close the tag.
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: site.name,
    jobTitle: "Software engineer",
    url: site.url,
    email: `mailto:${contact.email}`,
    sameAs: [site.github, site.x],
    memberOf: { "@type": "Organization", name: intro.lab.name, url: intro.lab.href },
    address: { "@type": "PostalAddress", addressCountry: "UY" },
  },
  hasPart: products.map((p) => ({
    "@type": "SoftwareSourceCode",
    name: p.name,
    description: p.summary,
    codeRepository: p.repo,
    programmingLanguage: p.stack[0],
    license: `https://spdx.org/licenses/${p.license}`,
    ...(p.group
      ? {
          author: { "@type": "Organization", name: p.group.name, url: p.group.href },
          contributor: { "@type": "Person", name: site.name },
        }
      : { author: { "@type": "Person", name: site.name } }),
  })),
}).replace(/</g, "\\u003c");

// The order things rise in on load (.rise in globals.css).
const order = (i: number) => ({ "--i": i }) as CSSProperties;
const plural = (n: number, one: string) => `${n.toLocaleString("en-US")} ${one}${n === 1 ? "" : "s"}`;

// One screen: the slogan on the paint, the lamp bar, and on the paper strip
// who vx is, the work as a numbered programme, and the year. Everything
// else opens in a dialog.
export default function Home() {
  return (
    <>
      <Frame
        slogan={intro.line}
        nav={
          <>
            <li className="nav-wide">
              <button type="button" {...opens("repos")} aria-haspopup="dialog" className="navlink">
                Repositories
              </button>
            </li>
            <li>
              <button type="button" {...opens("skills")} aria-haspopup="dialog" className="navlink">
                Skills
              </button>
            </li>
            <li>
              <button type="button" {...opens("contact")} aria-haspopup="dialog" className="navlink">
                Contact
              </button>
            </li>
          </>
        }
      >
        <div className="about rise" style={order(1)}>
          <p className="status">{intro.status}</p>
          <p className="lede">
            {intro.lede}{" "}
            <span className="whitespace-nowrap">{intro.lab.role}</span> of{" "}
            <a href={intro.lab.href} className="link">
              {intro.lab.name}
            </a>
            .
          </p>
          {/* Where the strip has room, it answers "how do I reach you"
              without a click; elsewhere Contact is in the header. */}
          <ul className="reach">
            <li>
              <a href={`mailto:${contact.email}`} className="link inline-flex min-h-6 items-center">
                {contact.email}
              </a>
            </li>
            <li>
              <a href={site.github} className="link inline-flex min-h-6 items-center">
                GitHub
              </a>
            </li>
            <li>
              <a href={site.x} className="link inline-flex min-h-6 items-center">
                X
              </a>
            </li>
          </ul>
        </div>

        <section aria-labelledby="work-title" className="work">
          <h2 id="work-title" className="strip-title rise" style={order(2)}>
            Work
          </h2>
          <ol className="programme">
            {products.map((p, i) => {
              const live = statsFor(p.repo);
              return (
                <li key={p.id} className="rise flex" style={order(3 + i)}>
                  <button type="button" {...opens(`p-${p.id}`)} aria-haspopup="dialog" className="entry">
                    <span aria-hidden className="entry-n">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="entry-name">
                      {p.name}
                      <span className="entry-kind">{p.kind}</span>
                    </span>
                    {live && <span className="entry-fig">{plural(live.commits, "commit")}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        {/* The poster's stacked date in red, here the year of the data. */}
        <div aria-hidden className="colophon rise" style={order(10)}>
          <div className="year">
            <svg viewBox="0 0 32 32" className="year-star">
              <path d="M16 1.6L20.2 13.8L33.1 14L22.8 21.8L26.6 34.2L16 26.8L5.4 34.2L9.2 21.8L-1.1 14L11.8 13.8Z" />
            </svg>
            <span>{year.slice(0, 2)}</span>
            <span>{year.slice(2)}</span>
          </div>
          <p className="colophon-site">kthread.dev</p>
        </div>
      </Frame>

      {products.map((p) => (
        <ProjectDialog key={p.id} product={p} />
      ))}

      <Sheet id="repos" title="Repositories" sub={`Refreshed from GitHub on ${day(github.generated)}`}>
        <div className="flex flex-col gap-10">
          <p className="max-w-[60ch] text-muted text-pretty">
            Every public repository I’ve committed to, on my profile and at {intro.lab.name}, with my commits in each. A workflow reads them from GitHub every day.
          </p>
          <ul className="ledger">
            {github.repos.map((r) => (
              <li key={r.repo} className="ledger-row">
                <div className="flex min-w-0 flex-col gap-1">
                  <a href={r.url} className="ledger-name link">
                    {r.name}
                  </a>
                  {r.description && <p className="text-muted text-pretty">{r.description}</p>}
                </div>
                <dl className="ledger-facts">
                  <div>
                    <dt>Commits</dt>
                    <dd>{r.commits.toLocaleString("en-US")}</dd>
                  </div>
                  <div>
                    <dt>Stars</dt>
                    <dd>{r.stars}</dd>
                  </div>
                  <div>
                    <dt>Language</dt>
                    <dd>{r.language ?? "None"}</dd>
                  </div>
                  <div>
                    <dt>Last push</dt>
                    <dd>{day(r.pushed)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
          <section aria-labelledby="langs-title" className="flex flex-col gap-4">
            <h3 id="langs-title" className="strip-title">
              Languages
            </h3>
            <p className="text-muted">
              By bytes of code across these repositories, {plural(github.commits, "commit")} of mine in all.
            </p>
            <ul className="langs">
              {github.languages.map((l) => (
                <li key={l.name} className="lang">
                  <span>{l.name}</span>
                  <span aria-hidden className="lang-bar">
                    {Array.from({ length: 24 }, (_, i) => (
                      <i key={i} className={i < Math.round((l.share / 100) * 24) ? "on" : undefined} />
                    ))}
                  </span>
                  <span className="text-right tabular-nums">{l.share.toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Sheet>

      <Sheet id="skills" title="Skills" sub="What I work with">
        <dl className="grid gap-8 sm:grid-cols-2">
          {skills.map((g) => (
            <div key={g.group} className="flex flex-col gap-2">
              <dt className="label">{g.group}</dt>
              {g.items.map((item) => (
                <dd key={item}>{item}</dd>
              ))}
            </div>
          ))}
        </dl>
      </Sheet>

      <Sheet id="contact" title="Contact" sub={contact.heading}>
        <p className="max-w-[52ch] text-muted text-pretty">{contact.body}</p>
        <ul className="mt-6 flex flex-col gap-3 text-lg">
          <li>
            <a href={`mailto:${contact.email}`} className="link inline-flex min-h-6 items-center">
              {contact.email}
            </a>
          </li>
          <li>
            <a href={site.github} className="link inline-flex min-h-6 items-center">
              github.com/vx9k
            </a>
          </li>
          <li>
            <a href={site.x} className="link inline-flex min-h-6 items-center">
              x.com/vx9000k
            </a>
          </li>
          <li className="text-base text-muted">
            <a href={site.source} className="link inline-flex min-h-6 items-center">
              Source for this site
            </a>
          </li>
        </ul>
      </Sheet>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </>
  );
}
